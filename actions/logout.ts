"use server";

import { createClient } from "@/lib/supabaseServerClient";
import { resetApolloCache } from "@/lib/apollo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
}
