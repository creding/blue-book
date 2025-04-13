import { Note, ReferenceType } from "@/types/note";
import { NotesSection } from "./NotesSection";

interface NotesProps {
  referenceType: ReferenceType;
  referenceId: string;
  notes: Note[];
  closeSidebar: () => void;
}

export function Notes({
  notes,
  referenceType,
  referenceId,
  closeSidebar,
}: NotesProps) {
  return (
    <NotesSection
      closeSidebar={closeSidebar}
      referenceType={referenceType}
      referenceId={referenceId}
      initialNotes={notes}
    />
  );
}
