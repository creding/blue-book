import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE, CreateNoteResponse, UpdateNoteResponse, DeleteNoteResponse, NoteRecord } from "./mutations/notes";
import { createApolloClient } from "@/lib/apollo";
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
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  try {
    const { data } = await client.mutate<CreateNoteResponse>({
      mutation: CREATE_NOTE,
      variables: {
        userId: user.id,
        content,
        referenceType,
        referenceId,
        devotionId: devotionId || null,
        scriptureId: scriptureId || null,
        readingId: readingId || null,
      },
    });

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
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  try {
    const { data } = await client.mutate<UpdateNoteResponse>({
      mutation: UPDATE_NOTE,
      variables: {
        id: parseInt(id),
        userId: user.id,
        content,
      },
    });

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
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  try {
    const { data } = await client.mutate<DeleteNoteResponse>({
      mutation: DELETE_NOTE,
      variables: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    return (data?.deleteFromnotesCollection.affectedCount ?? 0) > 0;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
}
