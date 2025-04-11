import { supabase } from "@/lib/supabase";
import { Note, CreateNoteParams, UpdateNoteParams } from "@/types/note";

/**
 * Get all notes for the current user
 */
export async function getNotes() {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return [];
    }

    return data as Note[];
  } catch (error) {
    console.error("Error in getNotes:", error);
    return [];
  }
}

/**
 * Get notes for a specific reference (devotion, scripture, or reading)
 */
export async function getNotesByReference(referenceType: Note["reference_type"], referenceId: string) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("reference_type", referenceType)
      .eq("reference_id", referenceId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes by reference:", error);
      return [];
    }

    return data as Note[];
  } catch (error) {
    console.error("Error in getNotesByReference:", error);
    return [];
  }
}

/**
 * Create a new note
 */
export async function createNote(params: CreateNoteParams) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .insert([params])
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      return null;
    }

    return data as Note;
  } catch (error) {
    console.error("Error in createNote:", error);
    return null;
  }
}

/**
 * Update an existing note
 */
export async function updateNote(id: string, params: UpdateNoteParams) {
  try {
    const { data, error } = await supabase
      .from("notes")
      .update(params)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating note:", error);
      return null;
    }

    return data as Note;
  } catch (error) {
    console.error("Error in updateNote:", error);
    return null;
  }
}

/**
 * Delete a note
 */
export async function deleteNote(id: string) {
  try {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteNote:", error);
    return false;
  }
}
