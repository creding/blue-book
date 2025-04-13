import { gql } from "graphql-tag";
import { ProfileRecord } from "../queries/profile";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $userId: UUID!,
    $username: String,
    $fullName: String,
    $avatarUrl: String
  ) {
    updateprofilesCollection(
      set: {
        username: $username,
        full_name: $fullName,
        avatar_url: $avatarUrl
      },
      filter: { id: { eq: $userId } }
    ) {
      affectedCount
      records {
        id
        updated_at
        username
        full_name
        avatar_url
      }
    }
  }
`;

export interface UpdateProfileResponse {
  updateprofilesCollection: {
    affectedCount: number;
    records: Array<ProfileRecord>;
  };
}
