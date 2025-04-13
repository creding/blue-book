import { GET_DEVOTIONAL_DETAILS } from "./queries/devotions";
import { createApolloClient } from "@/lib/apollo";
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

  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
  );

  try {
    const { data } = await client.query<DevotionResponse>({
      query: GET_DEVOTIONAL_DETAILS,
      variables: {
        slug,
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching devotional details:", error);
    return null;
  }
}
