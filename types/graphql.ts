export interface Edge<T> {
  node: T;
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Scripture {
  id: number;
  reference: string;
  text: string;
  is_psalm: boolean;
  notesCollection: {
    edges: Edge<Note>[];
  };
  day_of_week: string;
}

export interface Reading {
  id: number;
  title: string | null;
  text: string;
  source: string | null;
  notesCollection: {
    edges: Edge<Note>[];
  };
}

export interface Devotion {
  id: number;
  title: string;
  slug: string;
  opening_prayer: string;
  opening_prayer_source: string | null;
  closing_prayer: string;
  closing_prayer_source: string | null;
  song_title: string | null;
  devotion_scripturesCollection: {
    edges: Edge<{
      scriptures: Scripture;
      day_of_week: string;
    }>[];
  };
  readingsCollection: {
    edges: Edge<Reading>[];
  };
  notesCollection: {
    edges: Edge<Note>[];
  };
  favoritesCollection: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

export interface DevotionResponse {
  devotionsCollection: {
    edges: Edge<Devotion>[];
  };
}
