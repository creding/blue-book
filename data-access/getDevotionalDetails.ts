import { createClient } from "@/lib/supabaseServerClient";
import { Devotional, Reading, Scripture } from "@/types/devotional";
import { Note, ReferenceType } from "@/types/note";

// Type for raw note data fetched from DB
type RawNote = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  reference_type: ReferenceType;
  reference_id: string;
  devotion_id: number | null;
  scripture_id: number | null;
  reading_id: number | null;
};

export async function getDevotionalDetails(
  devotionId: number
): Promise<Devotional | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  // 1. Fetch core Devotion data + Psalm Scripture
  const { data: coreDevotion, error: coreDevotionError } = await supabase
    .from("devotions")
    .select(
      `
      id, title, slug, opening_prayer, opening_prayer_source, 
      closing_prayer, closing_prayer_source, song_title
    `
    )
    .eq("id", devotionId)
    .maybeSingle(); // Use maybeSingle to handle not found without error

  if (coreDevotionError) {
    console.error("Error fetching core devotional:", coreDevotionError);
    return null;
  }
  if (!coreDevotion) {
    console.log(`Devotion with ID ${devotionId} not found.`);
    return null;
  }

  type DevotionScriptureRow = {
    id: number;
    scripture_id: number;
    day_of_week: string | null;
    is_psalm: boolean;
    scripture: {
      id: number;
      reference: string;
      text: string;
    };
  };

  // 2. Fetch DevotionScriptures (including psalm)
  const { data: devotionScriptures, error: dsError } = await supabase
    .from("devotion_scriptures")
    .select(
      `
      id,
      scripture_id,
      day_of_week,
      is_psalm,
      scripture:scriptures!scripture_id (*)
    `
    )
    .eq("devotion_id", devotionId)
    .returns<DevotionScriptureRow[]>();

  if (dsError) {
    console.error("Error fetching devotion scriptures:", dsError);
    // Continue without scriptures? Or return null?
    return null;
  }

  // 3. Fetch Readings
  const { data: readingsData, error: readingsError } = await supabase
    .from("readings")
    .select(`id, text, source, title`)
    .eq("devotion_id", devotionId);

  if (readingsError) {
    console.error("Error fetching readings:", readingsError);
    // Continue without readings? Or return null?
    return null;
  }

  // Prepare IDs for note fetching
  const scriptureIds = (devotionScriptures || []).map((ds) => ds.scripture_id);
  const readingIds = (readingsData || []).map((r) => r.id);

  // 4. Fetch all relevant Notes for the user
  const { data: notesData, error: notesError } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .or(
      [
        `devotion_id.eq.${devotionId}`,
        scriptureIds.length > 0 ? `scripture_id.in.(${scriptureIds.join(",")})` : "scripture_id.is.null",
        readingIds.length > 0 ? `reading_id.in.(${readingIds.join(",")})` : "reading_id.is.null"
      ].filter(Boolean).join(",")
    );

  if (notesError) {
    console.error("Error fetching notes:", notesError);
    // Continue without notes? Or return null?
    return null;
  }

  // 5. Process and combine data

  // Find the psalm in devotionScriptures
  const psalmEntry = (devotionScriptures || []).find((ds: DevotionScriptureRow) => ds.is_psalm);
  const psalm: Scripture | null = psalmEntry
    ? {
        id: psalmEntry.scripture.id,
        reference: psalmEntry.scripture.reference,
        text: psalmEntry.scripture.text,
      }
    : null;

  const mainScriptures: Scripture[] = (devotionScriptures || [])
    .filter((ds: DevotionScriptureRow) => !ds.is_psalm) // Exclude psalm from main scriptures
    .map((ds: DevotionScriptureRow) => {
      const scriptureData = ds.scripture;
      const scripture: Scripture = {
        id: scriptureData.id,
        reference: scriptureData.reference,
        text: scriptureData.text,
      };
      if (ds.day_of_week) {
        scripture.day = ds.day_of_week;
      }
      return scripture;
    }); // Type predicate filter to remove nulls

  const processedReadings: Reading[] = (readingsData || []).map((r) => ({
    // Keep existing reading processing
    ...r,
  }));

  // Process notes into the required structure
  const processedNotes: Devotional["notes"] = {
    devotion: [],
    psalm: [],
    scripture: [],
    readings: processedReadings.map(() => []), // Initialize empty arrays for each reading
  };

  (notesData || []).forEach((note: RawNote) => {
    let reference_type: ReferenceType | null = null;
    let reference_id: string | null = null;

    if (note.devotion_id === devotionId) {
      reference_type = "devotion";
      reference_id = String(devotionId);
      processedNotes.devotion.push({
        id: Number(note.id),
        user_id: note.user_id,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
        reference_type,
        reference_id,
        devotion_id: note.devotion_id,
        scripture_id: note.scripture_id,
        reading_id: note.reading_id,
      });
    } else if (note.scripture_id && note.scripture_id === psalm?.id) {
      reference_type = "scripture";
      reference_id = String(psalm.id);
      processedNotes.psalm.push({
        id: Number(note.id),
        user_id: note.user_id,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
        reference_type,
        reference_id,
        devotion_id: note.devotion_id,
        scripture_id: note.scripture_id,
        reading_id: note.reading_id,
      });
    } else if (
      note.scripture_id &&
      mainScriptures.some((s) => s.id === note.scripture_id)
    ) {
      reference_type = "scripture";
      reference_id = String(note.scripture_id);
      processedNotes.scripture.push({
        id: Number(note.id),
        user_id: note.user_id,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
        reference_type,
        reference_id,
        devotion_id: note.devotion_id,
        scripture_id: note.scripture_id,
        reading_id: note.reading_id,
      });
    } else if (note.reading_id) {
      const readingIndex = processedReadings.findIndex(
        (r) => r.id === note.reading_id
      );
      if (readingIndex !== -1) {
        reference_type = "reading";
        reference_id = String(note.reading_id);
        processedNotes.readings[readingIndex].push({
          id: Number(note.id),
          user_id: note.user_id,
          content: note.content,
          created_at: note.created_at,
          updated_at: note.updated_at,
          reference_type,
          reference_id,
          devotion_id: note.devotion_id,
          scripture_id: note.scripture_id,
          reading_id: note.reading_id,
        });
      }
    }
  });

  const finalDevotional: Devotional = {
    id: coreDevotion.id,
    devotion_id: coreDevotion.id,
    title: coreDevotion.title,
    slug: coreDevotion.slug,
    opening_prayer: coreDevotion.opening_prayer,
    opening_prayer_source: coreDevotion.opening_prayer_source,
    closing_prayer: coreDevotion.closing_prayer,
    closing_prayer_source: coreDevotion.closing_prayer_source,
    song_title: coreDevotion.song_title,
    psalm: psalm,
    scriptures: mainScriptures,
    readings: processedReadings,
    notes: processedNotes,
    isFavorited: false, // Needs to be determined elsewhere
  };

  return finalDevotional;
}
