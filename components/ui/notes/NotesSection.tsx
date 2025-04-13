import { useState } from "react";
import {
  Paper,
  Title,
  Stack,
  Button,
  Text,
  Card,
  Group,
  ActionIcon,
  Textarea,
  LoadingOverlay,
} from "@mantine/core";
import { IconTrash, IconPencil, IconCheck, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Note, ReferenceType } from "@/types/note";
import {
  createNoteAction,
  updateNoteAction,
  deleteNoteAction,
} from "@/actions/notes";

interface NotesSectionProps {
  referenceType: ReferenceType;
  referenceId: string;
  initialNotes?: Note[];
}

export function NotesSection({
  referenceType,
  referenceId,
  initialNotes = [],
}: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [isAddingNote, { open: openAddNote, close: closeAddNote }] =
    useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    setLoading(true);
    const note = await createNoteAction(
      parseInt(referenceId),
      newNoteContent.trim()
    );
    if (note) {
      const convertedNote: Note = {
        ...note,
        id: parseInt(note.id)
      };
      setNotes((prev) => [convertedNote, ...prev]);
      setNewNoteContent("");
      closeAddNote();
    }
    setLoading(false);
  };

  const handleUpdateNote = async (id: number) => {
    if (!editingNote || !editingNote.content.trim()) return;

    setLoading(true);
    const updated = await updateNoteAction(
      String(id),
      editingNote.content.trim()
    );

    if (updated) {
      const convertedNote: Note = {
        ...updated,
        id: parseInt(updated.id)
      };
      setNotes((prev) => prev.map((note) => (note.id === id ? convertedNote : note)));
      setEditingNote(null);
    }
    setLoading(false);
  };

  const handleDeleteNote = async (id: number) => {
    setLoading(true);
    const success = await deleteNoteAction(String(id));

    if (success) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
    setLoading(false);
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Notes</Title>
          {!isAddingNote && (
            <Button variant="light" onClick={openAddNote}>
              Add Note
            </Button>
          )}
        </Group>

        {isAddingNote && (
          <Stack gap="lg">
            <Textarea
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.currentTarget.value)}
              minRows={3}
              autosize
              maxRows={10}
            />
            <Group justify="flex-end" gap="xs">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setNewNoteContent("");
                  closeAddNote();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateNote}>Save Note</Button>
            </Group>
          </Stack>
        )}

        <Stack gap="md">
          {notes.length === 0 ? (
            <Text c="dimmed" ta="center">
              No notes yet. Add one to get started!
            </Text>
          ) : (
            notes.map((note) => (
              <Card key={note.id} withBorder>
                {editingNote?.id === note.id ? (
                  <Stack gap="sm">
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) =>
                        setEditingNote({
                          ...editingNote,
                          content: e.currentTarget.value,
                        })
                      }
                      minRows={3}
                      autosize
                      maxRows={10}
                    />
                    <Group justify="flex-end" gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => setEditingNote(null)}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleUpdateNote(note.id)}
                      >
                        <IconCheck size={16} />
                      </ActionIcon>
                    </Group>
                  </Stack>
                ) : (
                  <Group wrap="nowrap" gap="sm">
                    <Text style={{ flex: 1 }}>{note.content}</Text>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() =>
                          setEditingNote({
                            id: note.id,
                            content: note.content,
                          })
                        }
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                )}
              </Card>
            ))
          )}
        </Stack>
      </Stack>
    </>
  );
}
