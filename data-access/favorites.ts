import { createClient } from "@/lib/supabaseServerClient";

export async function getFavorites(userId: string) {
  const supabase = await createClient();
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select("devotional_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return favorites.map((f) => f.devotional_id);
}

export async function toggleFavorite(userId: string, devotionalId: number) {
  const supabase = await createClient();
  if (!userId || !devotionalId) {
    console.error("Missing required parameters:", { userId, devotionalId });
    return false;
  }
  console.log("Toggling favorite with:", { userId, devotionalId });
  // First check if the favorite exists
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("devotional_id", devotionalId)
    .single();

  if (existing) {
    // If it exists, delete it
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
    return false; // Return false to indicate it's no longer favorited
  } else {
    // If it doesn't exist, create it
    console.log("Creating new favorite:", { userId, devotionalId });
    // Try to insert the favorite
    const { data, error } = await supabase.from("favorites").insert({
      id: crypto.randomUUID(), // Add explicit UUID for id
      user_id: userId,
      devotional_id: devotionalId,
    });

    if (error) {
      console.error("Error adding favorite:", { error, data });
      return false;
    }
    return true; // Return true to indicate it's now favorited
  }
}
