import { createClient } from "@supabase/supabase-js";
import { Devotional } from "@/types/devotional";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchDevotionals(): Promise<Devotional[]> {
  const { data: devotions, error } = await supabase
    .from('devotions')
    .select('*');

  if (error) {
    console.error('Error fetching devotionals:', error);
    return [];
  }

  const result = [];
  
  for (const devotion of devotions) {
    // Get scriptures for this devotion
    const { data: devotionScriptures } = await supabase
      .from('devotion_scriptures')
      .select('*, scriptures(*)')
      .eq('devotion_id', devotion.id);

    // Get readings for this devotion
    const { data: readings } = await supabase
      .from('readings')
      .select('*')
      .eq('devotion_id', devotion.id);

    const psalm = devotionScriptures?.find(ds => ds.is_psalm)?.scriptures || null;
    const scriptures = devotionScriptures
      ?.filter(ds => !ds.is_psalm)
      ?.map(ds => ({
        id: ds.scriptures.id,
        reference: ds.scriptures.reference,
        text: ds.scriptures.text,
        day: ds.day_of_week
      })) || [];

    result.push({
      devotion_id: devotion.id,
      title: devotion.title,
      opening_prayer: devotion.opening_prayer || '',
      opening_prayer_source: devotion.opening_prayer_source,
      closing_prayer: devotion.closing_prayer || '',
      closing_prayer_source: devotion.closing_prayer_source,
      song_title: devotion.song_title,
      psalm,
      scriptures,
      readings: readings?.map(r => ({
        id: r.id,
        text: r.text,
        source: r.source,
        title: r.title,
        day: 'monday'
      })) || []
    });
  }

  return result;
}

export async function getDevotionalByWeekAndDay(devotionId: number, day: string): Promise<Devotional | null> {
  const { data: devotional, error } = await supabase
    .from('devotions')
    .select('*')
    .eq('id', devotionId)
    .single();

  if (error || !devotional) {
    console.error('Error fetching devotional:', error);
    return null;
  }

  // Get scriptures for this devotion
  const { data: devotionScriptures } = await supabase
    .from('devotion_scriptures')
    .select('*, scriptures(*)')
    .eq('devotion_id', devotional.id);

  // Get readings for this devotion
  const { data: readings } = await supabase
    .from('readings')
    .select('*')
    .eq('devotion_id', devotional.id);

  const psalm = devotionScriptures?.find(ds => ds.is_psalm)?.scriptures || null;
  const scriptures = devotionScriptures
    ?.filter(ds => !ds.is_psalm && ds.day_of_week?.toLowerCase() === day.toLowerCase())
    ?.map(ds => ({
      id: ds.scriptures.id,
      reference: ds.scriptures.reference,
      text: ds.scriptures.text,
      day: ds.day_of_week
    })) || [];

  return {
    devotion_id: devotional.id,
    title: devotional.title,
    opening_prayer: devotional.opening_prayer || '',
    opening_prayer_source: devotional.opening_prayer_source,
    closing_prayer: devotional.closing_prayer || '',
    closing_prayer_source: devotional.closing_prayer_source,
    song_title: devotional.song_title,
    psalm,
    scriptures,
    readings: readings?.map(r => ({
      id: r.id,
      text: r.text,
      source: r.source,
      title: r.title,
      day: day
    })) || []
  };
}