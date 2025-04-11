// Database table interfaces
export interface DbDevotion {
  id: number;
  title: string;
  opening_prayer: string | null;
  opening_prayer_source: string | null;
  closing_prayer: string | null;
  closing_prayer_source: string | null;
  psalm_id: number | null;
  song_title: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface DbScripture {
  id: number;
  reference: string;
  text: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DbDevotionScripture {
  id: number;
  devotion_id: number | null;
  scripture_id: number | null;
  day_of_week: string | null;
  created_at?: Date;
  updated_at?: Date;
  is_psalm: boolean;
}

export interface DbReading {
  id: number;
  devotion_id: number | null;
  text: string;
  source: string | null;
  title: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Application interfaces
export interface Scripture {
  id: number;
  reference: string;
  text: string;
  day?: string;
}

export interface Reading {
  id: number;
  text: string;
  source?: string;
  title?: string;
  day: string;
}

export interface Devotional {
  id: number;
  devotion_id: number;
  title: string;
  psalm: Scripture | null;
  opening_prayer: string;
  opening_prayer_source?: string;
  closing_prayer: string;
  closing_prayer_source?: string;
  song_title?: string;
  scriptures: Scripture[];
  readings: Reading[];
}

export interface DayContent {
  scripture: string | null;
  reflection: string | null;
}
