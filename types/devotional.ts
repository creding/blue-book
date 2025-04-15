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
  notesCollection: {
    edges: Array<{
      node: {
        id: number;
        content: string;
        created_at: string;
        updated_at: string;
      };
    }>;
  };
  title: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Application interfaces
export interface Scripture {
  id: number;
  reference: string;
  text: string;
  day_of_week?: string;
}

export interface Reading {
  id: number;
  text: string;
  source?: string;
  author?: string;
  title?: string;
  day?: string;
}

import { Note } from "./note";

export interface Devotional {
  id: number;
  title: string;
  slug: string;
  opening_prayer: string;
  opening_prayer_source: string | null;
  closing_prayer: string;
  closing_prayer_source: string | null;
  song_title: string | null;
  week: number;
  devotion_scripturesCollection: {
    edges: Array<{
      node: {
        scriptures: {
          id: number;
          reference: string;
          text: string;
          is_psalm: boolean;
          notesCollection: {
            edges: Array<{
              node: {
                id: number;
                content: string;
                created_at: string;
                updated_at: string;
              };
            }>;
          };
        };
        day_of_week: string;
      };
    }>;
  };
  readingsCollection: {
    edges: Array<{
      node: {
        id: number;
        title: string | null;
        text: string;
        source: string | null;
        notesCollection: {
          edges: Array<{
            node: {
              id: number;
              content: string;
              created_at: string;
              updated_at: string;
            };
          }>;
        };
      };
    }>;
  };
  notesCollection: {
    edges: Array<{
      node: {
        id: number;
        content: string;
        created_at: string;
        updated_at: string;
      };
    }>;
  };
  favoritesCollection: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

export interface DayContent {
  scripture: string | null;
  reflection: string | null;
}
