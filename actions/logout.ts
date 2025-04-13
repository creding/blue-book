"use server";

import { createClient } from "@/lib/supabaseServerClient";
import { revalidatePath } from "next/cache";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  revalidatePath("/devotionals", "layout");
}
