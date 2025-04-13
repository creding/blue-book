import { SEARCH_DEVOTIONALS, SearchResponse } from "./queries/search";
import { createApolloClient } from "@/lib/apollo";
import { createClient } from "@/lib/supabaseServerClient";
import { Devotional } from "@/types/devotional";

interface SearchFilters {
  title?: boolean;
  prayers?: boolean;
  readings?: boolean;
  scripture?: boolean;
}

export async function searchDevotionals(
  query: string,
  filters: SearchFilters = {
    title: true,
    prayers: true,
    readings: true,
    scripture: true,
  }
): Promise<Devotional[]> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    session!.access_token
  );

  const searchTerm = `%${query}%`;

  try {
    const { data } = await client.query<SearchResponse>({
      query: SEARCH_DEVOTIONALS,
      variables: {
        searchTerm,
      },
    });

    // Start with devotions found by title/prayers
    const devotionIds = new Set<number>();
    
    // Add devotions found by title/prayers if enabled
    if (filters.title || filters.prayers) {
      data.devotionsCollection.edges.forEach(({ node }) => {
        devotionIds.add(node.id);
      });
    }

    // Add devotions found by readings if enabled
    if (filters.readings) {
      data.readingsCollection.edges.forEach(({ node }) => {
        if (node.devotion_id) {
          devotionIds.add(node.devotion_id);
        }
      });
    }

    // Add devotions found by scriptures if enabled
    if (filters.scripture) {
      data.devotion_scripturesCollection.edges.forEach(({ node }) => {
        if (
          node.devotion_id &&
          node.scriptures &&
          (node.scriptures.text.toLowerCase().includes(query.toLowerCase()) ||
           node.scriptures.reference.toLowerCase().includes(query.toLowerCase()))
        ) {
          devotionIds.add(node.devotion_id);
        }
      });
    }

    // Get full devotion details for all matching IDs
    const devotions = data.devotionsCollection.edges
      .filter(({ node }) => devotionIds.has(node.id))
      .map(({ node }) => ({
        id: node.id,
        title: node.title,
        slug: node.slug,
      }));

    return devotions;
  } catch (error) {
    console.error("Error searching devotionals:", error);
    return [];
  }
}
