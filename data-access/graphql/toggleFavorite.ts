import { DELETE_FAVORITE, CREATE_FAVORITE, DeleteFavoriteResponse, CreateFavoriteResponse } from "./mutations/toggleFavorite";
import { createClient } from "@/lib/supabaseServerClient";

export async function toggleFavorite(devotionId: number): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user?.id || !devotionId) {
    console.error("Error toggling favorite:", { error });
    return false;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  try {
    // First try to delete
    const deleteResponse = await fetch(
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
          query: DELETE_FAVORITE.loc?.source.body,
          variables: {
            devotionId,
            userId: user.id,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!deleteResponse.ok) {
      throw new Error(`HTTP error! status: ${deleteResponse.status}`);
    }

    const { data: deleteData } = await deleteResponse.json();

    // If we deleted something, return false (unfavorited)
    if (deleteData?.deleteFromfavoritesCollection?.affectedCount ?? 0 > 0) {
      return false;
    }

    // If nothing was deleted, try to create
    const createResponse = await fetch(
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
          query: CREATE_FAVORITE.loc?.source.body,
          variables: {
            devotionId,
            userId: user.id,
          },
        }),
        next: {
          revalidate: 0,
        },
      }
    );

    if (!createResponse.ok) {
      throw new Error(`HTTP error! status: ${createResponse.status}`);
    }

    const { data: createData } = await createResponse.json();
    return (createData?.insertIntofavoritesCollection?.affectedCount ?? 0) > 0;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
}
