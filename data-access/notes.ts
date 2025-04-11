import { createClient } from "@/lib/supabaseServerClient";
import { Note, CreateNoteParams, UpdateNoteParams } from "@/types/note";

/**
 * Get all notes for the current user
 */
export async function getNotes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return data as Note[];
}

/**
 * Get notes for a specific reference (devotion, scripture, or reading)
 */
export async function getNotesByReference(
  referenceType: Note["reference_type"],
  referenceId: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .eq("reference_type", referenceType)
    .eq("reference_id", referenceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes by reference:", error);
    return [];
  }

  return data as Note[];
}

/**
 * Create a new note
 */
export async function createNote(params: CreateNoteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("notes")
    .insert({
      id: crypto.randomUUID(),
      user_id: user.id,
      ...params,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    return null;
  }

  return data as Note;
}

/**
 * Update an existing note
 */
export async function updateNote(id: string, params: UpdateNoteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("notes")
    .update(params)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    return null;
  }

  return data as Note;
}

/**
 * Delete a note
 */
export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting note:", error);
    return false;
  }

  return true;
}
