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
  const client = createApolloClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

    // Add devotions found by title/prayers
    data.devotionsCollection?.edges?.forEach(({ node }) => {
      if (
        (filters.title && node.title.toLowerCase().includes(query.toLowerCase())) ||
        (filters.prayers && (
          node.opening_prayer?.toLowerCase().includes(query.toLowerCase()) ||
          node.closing_prayer?.toLowerCase().includes(query.toLowerCase())
        ))
      ) {
        devotionIds.add(node.id);
      }
    });

    // Add devotions found by readings
    if (filters.readings && data.readingsCollection?.edges) {
      data.readingsCollection.edges.forEach(({ node }) => {
        if (node.devotion_id && (
          node.text.toLowerCase().includes(query.toLowerCase()) ||
          (node.source && node.source.toLowerCase().includes(query.toLowerCase()))
        )) {
          devotionIds.add(node.devotion_id);
        }
      });
    }

    // Add devotions found by scriptures if enabled
    if (filters.scripture) {
      // Check direct scriptures collection results
      data.scripturesCollection?.edges?.forEach(({ node: { devotion_scripturesCollection } }) => {
        devotion_scripturesCollection?.edges?.forEach(({ node: dsNode }) => {
          if (dsNode.devotion_id) {
            devotionIds.add(dsNode.devotion_id);
          }
        });
      });

      // Check devotion_scriptures collection
      data.devotion_scripturesCollection?.edges?.forEach(({ node }) => {
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
    const devotions = data.devotionsCollection?.edges
      ?.filter(({ node }) => {
        const hasMatchingTitle = filters.title && node.title.toLowerCase().includes(query.toLowerCase());
        const hasMatchingPrayers = filters.prayers && (
          node.opening_prayer?.toLowerCase().includes(query.toLowerCase()) ||
          node.closing_prayer?.toLowerCase().includes(query.toLowerCase())
        );
        const hasMatchingReadings = filters.readings && node.readingsCollection?.edges?.some(edge =>
          edge.node.text.toLowerCase().includes(query.toLowerCase()) ||
          (edge.node.source && edge.node.source.toLowerCase().includes(query.toLowerCase()))
        );
        const hasMatchingScriptures = filters.scripture && node.devotion_scripturesCollection?.edges?.some(edge =>
          edge.node.scriptures.text.toLowerCase().includes(query.toLowerCase()) ||
          edge.node.scriptures.reference.toLowerCase().includes(query.toLowerCase())
        );
        const isInDevotionIds = devotionIds.has(node.id);

        return hasMatchingTitle || hasMatchingPrayers || hasMatchingReadings || hasMatchingScriptures || isInDevotionIds;
      })
      ?.map(({ node }) => ({
        id: node.id,
        title: node.title,
        slug: node.slug,
        opening_prayer: node.opening_prayer || "",
        opening_prayer_source: node.opening_prayer_source,
        closing_prayer: node.closing_prayer || "",
        closing_prayer_source: node.closing_prayer_source,
        song_title: node.song_title,
        devotion_scripturesCollection: node.devotion_scripturesCollection || { edges: [] },
        readingsCollection: node.readingsCollection || { edges: [] },
        notesCollection: {
          edges: []
        },
        favoritesCollection: {
          edges: []
        }
      })) || [];

    return devotions;
  } catch (error) {
    console.error("Error searching devotionals:", error);
    return [];
  }
}
