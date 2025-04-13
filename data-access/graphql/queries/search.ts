import { gql } from "graphql-tag";

export const SEARCH_DEVOTIONALS = gql`
  query SearchDevotionals($searchTerm: String!) {
    # Search devotions by title and prayers
    devotionsCollection(
      filter: {
        or: [
          { title: { ilike: $searchTerm } },
          { opening_prayer: { ilike: $searchTerm } },
          { closing_prayer: { ilike: $searchTerm } }
        ]
      }
    ) {
      edges {
        node {
          id
          title
          slug
        }
      }
    }
    # Search readings
    readingsCollection(
      filter: {
        or: [
          { text: { ilike: $searchTerm } },
          { title: { ilike: $searchTerm } }
        ]
      }
    ) {
      edges {
        node {
          devotion_id
          title
          text
        }
      }
    }
    # Search scriptures through devotion_scriptures
    devotion_scripturesCollection {
      edges {
        node {
          devotion_id
          scriptures {
            reference
            text
            id
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
      };
    }>;
  };
  readingsCollection: {
    edges: Array<{
      node: {
        devotion_id: number;
        title: string | null;
        text: string;
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
