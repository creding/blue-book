import { supabase } from "@/lib/supabase";

type DevotionalListItem = {
  id: number;
  title: string;
  week: number;
};

export async function getDevotionals(): Promise<DevotionalListItem[]> {
  const { data, error } = await supabase
    .from("devotions")
    .select("id, title, week")
    .order("week", { ascending: true });

  if (error) {
    console.error("Error fetching devotionals:", error);
    return [];
  }

  return data || [];
}
