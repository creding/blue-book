import { GET_DEVOTIONAL_DETAILS } from "./queries/devotions";
import { createClient } from "@/lib/supabaseServerClient";
import { DevotionResponse } from "@/types/graphql";

export async function getDevotionalDetailsGql(
  slug: string
): Promise<DevotionResponse | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
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
          query: GET_DEVOTIONAL_DETAILS.loc?.source.body,
          variables: { slug },
        }),
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching devotional details:", error);
    return null;
  }
}
