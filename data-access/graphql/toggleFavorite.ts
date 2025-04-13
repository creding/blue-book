import { DELETE_FAVORITE, CREATE_FAVORITE, DeleteFavoriteResponse, CreateFavoriteResponse } from "./mutations/toggleFavorite";
import { createApolloClient } from "@/lib/apollo";
import { createClient } from "@/lib/supabaseServerClient";

export async function toggleFavorite(devotionId: number): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user?.id || !devotionId) {
    console.error("Error toggling favorite:", { error });
    return false;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  try {
    // First try to delete
    const { data: deleteData } = await client.mutate<DeleteFavoriteResponse>({
      mutation: DELETE_FAVORITE,
      variables: {
        devotionId,
        userId: user.id,
      },
    });

    // If we deleted something, return false (unfavorited)
    if (deleteData?.deleteFromfavoritesCollection?.affectedCount ?? 0 > 0) {
      return false;
    }

    // If nothing was deleted, try to create
    const { data: createData } = await client.mutate<CreateFavoriteResponse>({
      mutation: CREATE_FAVORITE,
      variables: {
        devotionId,
        userId: user.id,
      },
    });

    return (createData?.insertIntofavoritesCollection?.affectedCount ?? 0) > 0;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
}
