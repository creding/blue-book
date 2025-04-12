import { gql } from "graphql-tag";

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
