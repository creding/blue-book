export type ReferenceType = "devotion" | "scripture" | "reading";

export interface Note {
  id: number;
  user_id: string;
  reference_type: ReferenceType;
  reference_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  devotion_id: number | null;
  scripture_id: number | null;
  reading_id: number | null;
}

export interface CreateNoteParams {
  reference_type: ReferenceType;
  reference_id: string;
  content: string;
}

export interface UpdateNoteParams {
  content: string;
}
