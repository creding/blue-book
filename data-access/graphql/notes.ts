import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE, CreateNoteResponse, UpdateNoteResponse, DeleteNoteResponse, NoteRecord } from "./mutations/notes";
import { createClient } from "@/lib/supabaseServerClient";

export async function createNote(
  referenceType: "devotion" | "scripture" | "reading",
  referenceId: string,
  content: string,
  devotionId?: number,
  scriptureId?: number,
  readingId?: number
): Promise<NoteRecord | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user?.id || !content) {
    console.error("Error creating note:", { error });
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: accessToken
            ? `Bearer ${accessToken}`
            : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "X-Client-Info": "supabase-js/2.21.0",
        },
        body: JSON.stringify({
          query: CREATE_NOTE.loc?.source.body,
          variables: {
            userId: user.id,
            content,
            referenceType,
            referenceId,
            devotionId: devotionId || null,
            scriptureId: scriptureId || null,
            readingId: readingId || null,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data?.insertIntonotesCollection.records[0] ?? null;
  } catch (error) {
    console.error("Error creating note:", error);
    return null;
  }
}

export async function updateNote(id: string, content: string): Promise<NoteRecord | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user?.id || !id || !content) {
    console.error("Error updating note:", { error });
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: accessToken
            ? `Bearer ${accessToken}`
            : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "X-Client-Info": "supabase-js/2.21.0",
        },
        body: JSON.stringify({
          query: UPDATE_NOTE.loc?.source.body,
          variables: {
            id: parseInt(id),
            userId: user.id,
            content,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data?.updatenotesCollection.records[0] ?? null;
  } catch (error) {
    console.error("Error updating note:", error);
    return null;
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user?.id || !id) {
    console.error("Error deleting note:", { error });
    return false;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: accessToken
            ? `Bearer ${accessToken}`
            : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "X-Client-Info": "supabase-js/2.21.0",
        },
        body: JSON.stringify({
          query: DELETE_NOTE.loc?.source.body,
          variables: {
            id: parseInt(id),
            userId: user.id,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return (data?.deleteFromnotesCollection.affectedCount ?? 0) > 0;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
}
