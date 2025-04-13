import { gql } from "graphql-tag";

export const CREATE_NOTE = gql`
  mutation CreateNote(
    $userId: UUID!, 
    $content: String!, 
    $referenceType: String!, 
    $referenceId: String!, 
    $devotionId: Int, 
    $scriptureId: Int, 
    $readingId: Int
  ) {
    insertIntonotesCollection(
      objects: [{
        user_id: $userId,
        content: $content,
        reference_type: $referenceType,
        reference_id: $referenceId,
        devotion_id: $devotionId,
        scripture_id: $scriptureId,
        reading_id: $readingId
      }]
    ) {
      affectedCount
      records {
        id
        user_id
        reference_type
        reference_id
        content
        created_at
        updated_at
        devotion_id
        scripture_id
        reading_id
      }
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($id: Int!, $userId: UUID!, $content: String!) {
    updatenotesCollection(
      set: { content: $content },
      filter: { 
        and: [
          { id: { eq: $id } },
          { user_id: { eq: $userId } }
        ]
      }
    ) {
      affectedCount
      records {
        id
        user_id
        reference_type
        reference_id
        content
        created_at
        updated_at
        devotion_id
        scripture_id
        reading_id
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: Int!, $userId: UUID!) {
    deleteFromnotesCollection(
      filter: { 
        and: [
          { id: { eq: $id } },
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

export interface NoteRecord {
  id: string;
  user_id: string;
  reference_type: "devotion" | "scripture" | "reading";
  reference_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  devotion_id: number | null;
  scripture_id: number | null;
  reading_id: number | null;
}

export interface CreateNoteResponse {
  insertIntonotesCollection: {
    affectedCount: number;
    records: Array<NoteRecord>;
  };
}

export interface UpdateNoteResponse {
  updatenotesCollection: {
    affectedCount: number;
    records: Array<NoteRecord>;
  };
}

export interface DeleteNoteResponse {
  deleteFromnotesCollection: {
    affectedCount: number;
    records: Array<{
      id: string;
    }>;
  };
}
