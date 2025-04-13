import { gql } from "graphql-tag";

export const GET_DEVOTIONAL_DETAILS = gql`
  query GetDevotionDetails($devotionId: Int!) {
    devotionsCollection(filter: { id: { eq: $devotionId } }) {
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
          # Get related scriptures through devotion_scriptures
          devotion_scripturesCollection {
            edges {
              node {
                scriptures {
                  id
                  reference
                  text
                  is_psalm
                  # Get notes for this scripture
                  notesCollection {
                    edges {
                      node {
                        id
                        content
                        created_at
                        updated_at
                      }
                    }
                  }
                }
                day_of_week
              }
            }
          }
          # Get readings
          readingsCollection {
            edges {
              node {
                id
                title
                text
                source
                # Get notes for this reading
                notesCollection {
                  edges {
                    node {
                      id
                      content
                      created_at
                      updated_at
                    }
                  }
                }
              }
            }
          }
          # Get notes for the devotion itself
          notesCollection {
            edges {
              node {
                id
                content
                created_at
                updated_at
              }
            }
          }
          # Check if favorited
          favoritesCollection {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export interface DevotionalDetailsResponse {
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
        song_title: string;
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
}

export const GET_DEVOTIONS = gql`
  query GetDevotions {
    devotionsCollection {
      edges {
        node {
          id
          title
          slug
        }
      }
    }
  }
`;

export interface DevotionsResponse {
  devotionsCollection: {
    edges: Array<{
      node: {
        id: number;
        title: string;
        slug: string;
      };
    }>;
  };
}
