"use server";

import {
  createNote,
  updateNote,
  deleteNote,
} from "@/data-access/graphql/notes";
import { revalidatePath } from "next/cache";

export async function createNoteAction(
  referenceType: "devotion" | "scripture" | "reading",
  referenceId: string,
  content: string,
  devotionId?: number,
  scriptureId?: number,
  readingId?: number
) {
  const note = await createNote(
    referenceType,
    referenceId,
    content,
    devotionId,
    scriptureId,
    readingId
  );
  if (note) {
    revalidatePath(`/`);
  }
  return note;
}

export async function updateNoteAction(id: string, content: string) {
  const note = await updateNote(id, content);
  if (note) {
    // We don't know the devotionId here, so revalidate all pages
    revalidatePath("/");
  }
  return note;
}

export async function deleteNoteAction(id: string) {
  const success = await deleteNote(id);
  if (success) {
    // We don't know the devotionId here, so revalidate all pages
    revalidatePath("/");
  }
  return success;
}
