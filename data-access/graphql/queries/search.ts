import { gql } from "graphql-tag";

export const SEARCH_DEVOTIONALS = gql`
  query SearchDevotionals($searchTerm: String!) {
    # Search devotions by title and prayers
    devotionsCollection(
      first: 50
    ) {
      edges {
        node {
          id
          title
          slug
          opening_prayer
          opening_prayer_source
          closing_prayer
          closing_prayer_source
          song_title
          week
          # Get scriptures for this devotion
          devotion_scripturesCollection {
            edges {
              node {
                scriptures {
                  id
                  reference
                  text
                  is_psalm
                }
                day_of_week
              }
            }
          }
          # Get readings for this devotion
          readingsCollection(
            filter: {
              or: [
                { text: { ilike: $searchTerm } },
                { source: { ilike: $searchTerm } }
              ]
            }
          ) {
            edges {
              node {
                id
                title
                text
                source
              }
            }
          }
        }
      }
    }
    # Search readings
    # Search readings by text and source
    readingsCollection(
      first: 50
      filter: {
        or: [
          { text: { ilike: $searchTerm } },
          { source: { ilike: $searchTerm } }
        ]
      }
    ) {
      edges {
        node {
          devotion_id
          id
          title
          text
          source
        }
      }
    }
    # Search scriptures
    scripturesCollection(
      first: 50
      filter: {
        or: [
          { text: { ilike: $searchTerm } },
          { reference: { ilike: $searchTerm } }
        ]
      }
    ) {
      edges {
        node {
          id
          reference
          text
          devotion_scripturesCollection {
            edges {
              node {
                devotion_id
                is_psalm
                day_of_week
              }
            }
          }
        }
      }
    }
  }
`;

export interface SearchResponse {
  devotionsCollection: {
    edges: Array<{
      node: {
        id: number;
        title: string;
        slug: string;
        opening_prayer: string;
        opening_prayer_source: string | null;
        closing_prayer: string;
        closing_prayer_source: string | null;
        song_title: string | null;
        week: number;
        devotion_scripturesCollection: {
          edges: Array<{
            node: {
              scriptures: {
                id: number;
                reference: string;
                text: string;
                is_psalm: boolean;
                notesCollection: {
                  edges: Array<{
                    node: {
                      id: number;
                      content: string;
                      created_at: string;
                      updated_at: string;
                    };
                  }>;
                };
              };
              day_of_week: string;
            };
          }>;
        };
        readingsCollection: {
          edges: Array<{
            node: {
              id: number;
              title: string | null;
              text: string;
              source: string | null;
              notesCollection: {
                edges: Array<{
                  node: {
                    id: number;
                    content: string;
                    created_at: string;
                    updated_at: string;
                  };
                }>;
              };
            };
          }>;
        };
        notesCollection: {
          edges: Array<{
            node: {
              id: number;
              content: string;
              created_at: string;
              updated_at: string;
            };
          }>;
        };
        favoritesCollection: {
          edges: Array<{
            node: {
              id: string;
            };
          }>;
        };
      };
    }>;
  };
  readingsCollection: {
    edges: Array<{
      node: {
        devotion_id: number;
        title: string | null;
        text: string;
        source: string | null;
      };
    }>;
  };
  scripturesCollection: {
    edges: Array<{
      node: {
        id: number;
        reference: string;
        text: string;
        devotion_scripturesCollection: {
          edges: Array<{
            node: {
              devotion_id: number;
              is_psalm: boolean;
              day_of_week: string | null;
            };
          }>;
        };
      };
    }>;
  };
  devotion_scripturesCollection: {
    edges: Array<{
      node: {
        devotion_id: number;
        scriptures: {
          id: number;
          reference: string;
          text: string;
        };
      };
    }>;
  };
}
