import { supabase } from "@/lib/supabase";
import { Devotional } from "@/types/devotional";
import { generateSlug } from "@/lib/slug-utils";

export async function getDevotionals(): Promise<Devotional[]> {
  const { data, error } = await supabase
    .from("devotions")
    .select()
    .order("week", { ascending: true });

  if (error) {
    console.error("Error fetching devotionals:", error);
    return [];
  }

  return data || [];
}

interface SearchFilters {
  title?: boolean;
  prayers?: boolean;
  readings?: boolean;
  scripture?: boolean;
}

export async function searchDevotionals(
  query: string,
  filters: SearchFilters = {
    title: true,
    prayers: true,
    readings: true,
    scripture: true,
  }
): Promise<Devotional[]> {
  // Start with an empty set of devotion IDs
  const devotionIds = new Set<number>();

  const searchTerm = `%${query}%`;

  // Search in devotions table (title and prayers)
  if (filters.title || filters.prayers) {
    const conditions = [];
    if (filters.title) {
      conditions.push(`title.ilike.%${query}%`);
    }
    if (filters.prayers) {
      conditions.push(`opening_prayer.ilike.%${query}%`);
      conditions.push(`closing_prayer.ilike.%${query}%`);
    }

    const { data: titleMatches, error: titleError } = await supabase
      .from("devotions")
      .select("id")
      .or(conditions.join(","));

    if (titleError) console.error("Title/prayer search error:", titleError);
    titleMatches?.forEach((d) => devotionIds.add(d.id));
  }

  // Search in readings
  if (filters.readings) {
    const { data: readingMatches, error: readingError } = await supabase
      .from("readings")
      .select("devotion_id")
      .or(
        `text.ilike.%${query}%,source.ilike.%${query}%,title.ilike.%${query}%`
      );

    if (readingError) console.error("Reading search error:", readingError);
    readingMatches?.forEach((r) => devotionIds.add(r.devotion_id));
  }

  // Search in scriptures
  if (filters.scripture) {
    const { data: scriptureMatches, error: scriptureError } = await supabase
      .from("devotion_scriptures")
      .select("devotion_id, scriptures(*)")
      .textSearch("scriptures.text", query);

    if (scriptureError)
      console.error("Scripture search error:", scriptureError);
    scriptureMatches?.forEach((s) => devotionIds.add(s.devotion_id));
  }

  // If no matches or no filters selected, return empty array
  if (devotionIds.size === 0) {
    return [];
  }

  // Fetch full devotion data for all matches
  const { data: devotions, error } = await supabase
    .from("devotions")
    .select("*")
    .in("id", Array.from(devotionIds));

  if (error) {
    console.error("Error searching devotionals:", error);
    return [];
  }

  const result = [];

  for (const devotion of devotions || []) {
    // Get scriptures for this devotion
    const { data: devotionScriptures } = await supabase
      .from("devotion_scriptures")
      .select("*, scriptures(*)")
      .eq("devotion_id", devotion.id);

    // Get readings for this devotion
    const { data: readings } = await supabase
      .from("readings")
      .select("*")
      .eq("devotion_id", devotion.id);

    const psalm =
      devotionScriptures?.find((ds) => ds.is_psalm)?.scriptures || null;
    const scriptures =
      devotionScriptures
        ?.filter((ds) => !ds.is_psalm)
        ?.map((ds) => ({
          id: ds.scriptures.id,
          reference: ds.scriptures.reference,
          text: ds.scriptures.text,
          day: ds.day_of_week,
        })) || [];

    result.push({
      id: devotion.id,
      devotion_id: devotion.id,
      title: devotion.title,
      slug: devotion.slug,
      opening_prayer: devotion.opening_prayer || "",
      opening_prayer_source: devotion.opening_prayer_source,
      closing_prayer: devotion.closing_prayer || "",
      closing_prayer_source: devotion.closing_prayer_source,
      song_title: devotion.song_title,
      psalm,
      scriptures,
      readings:
        readings?.map((r) => ({
          id: r.id,
          text: r.text,
          source: r.source,
          title: r.title,
          day: "monday",
        })) || [],
    });
  }

  return result;
}

export async function updateDevotionalSlug(
  devotionId: number,
  title: string
): Promise<void> {
  const slug = generateSlug(title);
  const { error } = await supabase
    .from("devotions")
    .update({ slug })
    .eq("id", devotionId);

  if (error) {
    console.error("Error updating devotional slug:", error);
    throw error;
  }
}

export async function getDevotionalByWeekAndDay(
  week: number,
  day: string,
  userId?: string
): Promise<Devotional | null> {
  // Get the devotional
  const { data: devotional, error: devotionalError } = await supabase
    .from("devotions")
    .select("*")
    .eq("id", week)
    .single();

  if (devotionalError || !devotional) {
    console.error("Error fetching devotional:", devotionalError);
    return null;
  }

  // Get scriptures for this devotion
  const { data: devotionScriptures } = await supabase
    .from("devotion_scriptures")
    .select("*, scriptures(*)")
    .eq("devotion_id", devotional.id);

  // Get readings for this devotion
  const { data: readings } = await supabase
    .from("readings")
    .select("*")
    .eq("devotion_id", devotional.id);

  const psalm =
    devotionScriptures?.find((ds) => ds.is_psalm)?.scriptures || null;
  const scriptures =
    devotionScriptures
      ?.filter(
        (ds) =>
          !ds.is_psalm && ds.day_of_week?.toLowerCase() === day.toLowerCase()
      )
      ?.map((ds) => ({
        id: ds.scriptures.id,
        reference: ds.scriptures.reference,
        text: ds.scriptures.text,
        day: ds.day_of_week,
      })) || [];

  let isFavorited = false;
  if (userId) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("devotional_id", devotional.id)
      .single();
    isFavorited = !!favorite;
  }

  return {
    id: devotional.id,
    devotion_id: devotional.id,
    title: devotional.title,
    slug: devotional.slug,
    opening_prayer: devotional.opening_prayer || "",
    opening_prayer_source: devotional.opening_prayer_source,
    closing_prayer: devotional.closing_prayer || "",
    closing_prayer_source: devotional.closing_prayer_source,
    song_title: devotional.song_title,
    psalm,
    scriptures,
    readings:
      readings?.map((r) => ({
        id: r.id,
        text: r.text,
        source: r.source,
        title: r.title,
        day: day,
      })) || [],
    isFavorited,
  };
}
