import { createClient } from "@/lib/supabaseServerClient";
import { Devotional } from "@/types/devotional";

import { Note } from "@/types/note";

type DevotionNote = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  scripture_id: number;
  reading_id: number;
  devotion_id: number;
  reference_id: number;
};

type DevotionWithNotes = {
  id: number;
  title: string;
  week: number;
  opening_prayer: string;
  opening_prayer_source: string;
  closing_prayer: string;
  closing_prayer_source: string;
  song_title: string;
  devotion_notes: Array<DevotionNote>;
  devotion_scriptures: Array<{
    id: number;
    devotion_id: number;
    scripture_id: number;
    day_of_week?: string;
    is_psalm: boolean;
    scriptures: {
      id: number;
      reference: string;
      text: string;
      scripture_notes: Array<{
        id: string;
        content: string;
        created_at: string;
        updated_at: string;
      }>;
    };
    scripture_notes: Array<{
      id: string;
      content: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  readings: Array<{
    id: number;
    devotion_id: number;
    text: string;
    source?: string;
    title?: string;
    day: string;
    reading_notes: Array<{
      id: string;
      content: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
};

export async function getDevotionWithNotes(
  devotionId: number,
  userId?: string
): Promise<Devotional | null> {
  const supabase = await createClient();

  // Get the devotional with all related data
  const { data: devotional, error: devotionalError } = await supabase
    .from("devotions")
    .select(
      `
      *,
      notes(id::text::int as id, content, created_at, updated_at, user_id, devotion_id),
      devotion_scriptures!inner(*, 
        scriptures!inner(*),
        notes(id::text::int as id, content, created_at, updated_at, user_id, scripture_id)
      ),
      readings!inner(*, 
        notes(id::text::int as id, content, created_at, updated_at, user_id, reading_id)
      )
    `
    )
    .eq("id", devotionId)
    .eq("notes.user_id", userId || "")
    .eq("devotion_scriptures.notes.user_id", userId || "")
    .eq("readings.notes.user_id", userId || "")
    .single<DevotionWithNotes>();

  if (devotionalError || !devotional) {
    console.error("Error fetching devotional:", devotionalError);
    return null;
  }

  // Process scriptures
  const mainScriptures =
    devotional.devotion_scriptures
      .filter((ds) => !ds.is_psalm)
      .map((ds) => ({
        id: ds.scriptures.id,
        reference: ds.scriptures.reference,
        text: ds.scriptures.text,
        day: ds.day_of_week || "",
      })) || [];

  const psalm = devotional.devotion_scriptures.find((ds) => ds.is_psalm);

  // Process readings
  const processedReadings =
    devotional.readings.map((r) => ({
      id: r.id,
      text: r.text,
      source: r.source || "",
      title: r.title || "",
      day: r.day,
    })) || [];

  return {
    id: devotional.id,
    devotion_id: devotional.id,
    title: devotional.title,
    slug: "", // This will be set by the calling function
    opening_prayer: devotional.opening_prayer || "",
    opening_prayer_source: devotional.opening_prayer_source || "",
    closing_prayer: devotional.closing_prayer || "",
    closing_prayer_source: devotional.closing_prayer_source || "",
    song_title: devotional.song_title || "",
    psalm: psalm
      ? {
          id: psalm.scriptures.id,
          reference: psalm.scriptures.reference,
          text: psalm.scriptures.text,
        }
      : null,
    scriptures: mainScriptures,
    readings: processedReadings,
    notes: {
      devotion:
        devotional.devotion_notes?.map((note) => ({
          ...note,
          id: Number(note.id),
          reference_type: "devotion" as const,
          reference_id: String(devotional.id),
          user_id: userId || "",
        })) || [],
      psalm:
        psalm?.scripture_notes?.map((note) => ({
          ...note,
          id: Number(note.id),
          reference_type: "scripture" as const,
          reference_id: String(psalm.scriptures.id),
          user_id: userId || "",
        })) || [],
      scripture:
        devotional.devotion_scriptures
          .filter((ds) => !ds.is_psalm)
          .map(
            (ds) =>
              ds.scripture_notes?.map((note) => ({
                ...note,
                id: Number(note.id),
                reference_type: "scripture" as const,
                reference_id: String(ds.scriptures.id),
                user_id: userId || "",
              })) || []
          )[0] || [],
      readings: devotional.readings.map(
        (r) =>
          r.reading_notes?.map((note) => ({
            ...note,
            id: Number(note.id),
            reference_type: "reading" as const,
            reference_id: String(r.id),
            user_id: userId || "",
          })) || []
      ),
    },
    isFavorited: false, // This will be set by the calling function
  };
}

export async function getDevotionalByWeekAndDay(
  week: number,
  day: string,
  userId?: string
): Promise<Devotional | null> {
  const supabase = await createClient();

  // First get the devotional ID
  const { data: devotional, error: devotionalError } = await supabase
    .from("devotions")
    .select("id")
    .eq("id", week)
    .single();

  if (devotionalError || !devotional) {
    console.error("Error fetching devotional:", devotionalError);
    return null;
  }

  // Get the full devotional with notes
  const devotionalWithNotes = await getDevotionWithNotes(devotional.id, userId);

  if (!devotionalWithNotes) {
    return null;
  }

  // Filter scriptures for the current day
  const mainScriptures = devotionalWithNotes.scriptures.filter(
    (s) => s.day?.toLowerCase() === day.toLowerCase()
  );

  // Filter readings for the current day
  const readings = devotionalWithNotes.readings.filter(
    (r) => r.day.toLowerCase() === day.toLowerCase()
  );

  // Check if this is favorited
  let isFavorited = false;
  if (userId) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("devotion_id", devotional.id)
      .eq("user_id", userId)
      .maybeSingle();

    isFavorited = !!favorite;
  }

  return {
    ...devotionalWithNotes,
    scriptures: mainScriptures,
    readings,
    isFavorited,
  };
}
