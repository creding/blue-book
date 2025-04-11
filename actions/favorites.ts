"use server";

import { toggleFavorite } from "@/data-access/favorites";
import { createClient } from "@/lib/supabaseServerClient";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(devotionalId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const isFavorite = await toggleFavorite(user.id, devotionalId);
  revalidatePath("/");
  return isFavorite;
}
