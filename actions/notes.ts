"use server";

import { createNote, updateNote, deleteNote } from "@/data-access/notes";
import { createClient } from "@/lib/supabaseServerClient";
import { revalidatePath } from "next/cache";
import { CreateNoteParams, UpdateNoteParams } from "@/types/note";

export async function createNoteAction(params: CreateNoteParams) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const note = await createNote(params);
  revalidatePath("/");
  return note;
}

export async function updateNoteAction(id: string, params: UpdateNoteParams) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const note = await updateNote(id, params);
  revalidatePath("/");
  return note;
}

export async function deleteNoteAction(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const success = await deleteNote(id);
  revalidatePath("/");
  return success;
}
