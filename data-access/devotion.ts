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

export async function getDevotionIdByWeekAndDay(
  week: number,
  day: string
): Promise<number | null> {
  // First, get the devotion by week
  const { data: devotion, error: devotionError } = await supabase
    .from("devotions")
    .select("id")
    .eq("week", week)
    .maybeSingle();

  if (devotionError) {
    console.error("Error fetching devotion by week:", devotionError);
    return null;
  }

  if (!devotion) {
    console.log(`No devotion found for week ${week}`);
    return null;
  }

  // Then verify it has a scripture for the given day
  const { data: scripture, error: scriptureError } = await supabase
    .from("devotion_scriptures")
    .select("devotion_id")
    .eq("devotion_id", devotion.id)
    .eq("day_of_week", day.toLowerCase()) // Ensure consistent case
    .maybeSingle();

  if (scriptureError) {
    console.error("Error verifying scripture for day:", scriptureError);
    return null;
  }

  // Only return the devotion ID if we found a matching scripture for the day
  return scripture ? devotion.id : null;
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
  const { data: devotionals, error } = await supabase
    .from("devotions")
    .select("*")
    .returns<Devotional[]>();

  if (error) {
    console.error("Error searching devotionals:", error);
    return [];
  }

  const result = [];

  for (const devotion of devotionals || []) {
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
      isFavorited: false,
      notes: {
        devotion: [],
        psalm: [],
        scripture: [],
        readings: [],
      },
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

import { createClient } from "@/lib/supabaseServerClient";

import { Note } from "@/types/note";

type DevotionNote = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  reference_type: string;
  reference_id: string;
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
  notes: Array<DevotionNote>;
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
    };
    notes: Array<{
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
    notes: Array<{
      id: string;
      content: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
};
