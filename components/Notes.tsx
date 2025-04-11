import { Note, ReferenceType } from "@/types/note";
import { NotesSection } from "./NotesSection";

interface NotesProps {
  referenceType: ReferenceType;
  referenceId: string;
  notes: Note[];
}

export function Notes({ notes, referenceType, referenceId }: NotesProps) {
  return (
    <NotesSection
      referenceType={referenceType}
      referenceId={referenceId}
      initialNotes={notes}
    />
  );
}
