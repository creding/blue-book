import { gql } from "graphql-tag";

export const GET_PROFILE = gql`
  query GetProfile($userId: UUID!) {
    profilesCollection(
      filter: { id: { eq: $userId } }
    ) {
      edges {
        node {
          id
          updated_at
          username
          full_name
          avatar_url
        }
      }
    }
  }
`;

export interface ProfileRecord {
  id: string;
  updated_at: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export interface GetProfileResponse {
  profilesCollection: {
    edges: Array<{
      node: ProfileRecord;
    }>;
  };
}
