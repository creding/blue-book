export type ReferenceType = "devotion" | "scripture" | "reading";

export interface Note {
  id: string;
  user_id: string;
  reference_type: ReferenceType;
  reference_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteParams {
  reference_type: ReferenceType;
  reference_id: string;
  content: string;
}

export interface UpdateNoteParams {
  content: string;
}
