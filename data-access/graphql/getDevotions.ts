import { GET_DEVOTIONS, DevotionsResponse } from "./queries/devotions";
import { createApolloClient } from "@/lib/apollo";
import { createClient } from "@/lib/supabaseServerClient";

export async function getDevotions(): Promise<DevotionsResponse | null> {
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
    const { data } = await client.query<DevotionsResponse>({
      query: GET_DEVOTIONS,
    });

    return data;
  } catch (error) {
    console.error("Error fetching devotions:", error);
    return null;
  }
}
