"use server";

import { createNote, updateNote, deleteNote } from "@/data-access/graphql/notes";
import { revalidatePath } from "next/cache";

export async function createNoteAction(devotionId: number, content: string) {
  const note = await createNote(devotionId, content);
  if (note) {
    revalidatePath(`/${devotionId}`);
  }
  return note;
}

export async function updateNoteAction(id: string, content: string) {
  const note = await updateNote(id, content);
  if (note) {
    // We don't know the devotionId here, so revalidate all pages
    revalidatePath('/');
  }
  return note;
}

export async function deleteNoteAction(id: string) {

  const success = await deleteNote(id);
  if (success) {
    // We don't know the devotionId here, so revalidate all pages
    revalidatePath('/');
  }
  return success;
}
