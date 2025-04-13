"use server";

import { toggleFavorite } from "@/data-access/graphql/toggleFavorite";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(devotionalId: number) {
  const isFavorite = await toggleFavorite(devotionalId);
  // Revalidate both the home page and the specific devotional page
  revalidatePath("/");
  revalidatePath(`/${devotionalId}`);
  return isFavorite;
}
