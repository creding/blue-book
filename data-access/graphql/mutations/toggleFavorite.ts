import { gql } from "graphql-tag";

export const DELETE_FAVORITE = gql`
  mutation DeleteFavorite($devotionId: Int!, $userId: UUID!) {
    deleteFromfavoritesCollection(
      atMost: 1,
      filter: { 
        and: [
          { devotion_id: { eq: $devotionId } },
          { user_id: { eq: $userId } }
        ]
      }
    ) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export const CREATE_FAVORITE = gql`
  mutation CreateFavorite($devotionId: Int!, $userId: UUID!) {
    insertIntofavoritesCollection(
      objects: [{
        devotion_id: $devotionId,
        user_id: $userId
      }]
    ) {
      affectedCount
      records {
        id
      }
    }
  }
`;

export interface DeleteFavoriteResponse {
  deleteFromfavoritesCollection: {
    affectedCount: number;
    records: Array<{
      id: string;
    }>;
  };
}

export interface CreateFavoriteResponse {
  insertIntofavoritesCollection: {
    affectedCount: number;
    records: Array<{
      id: string;
    }>;
  };
}
