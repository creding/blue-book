import {
  Group,
  Stack,
  Text,
  Box,
  Badge,
} from "@mantine/core";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Scripture } from "@/types/devotional";
import { Note } from "@/types/note";
import { User } from "@supabase/supabase-js";

interface ScriptureListProps {
  scriptures: Scripture[];
  notes: Note[];
  user: User | null;
}

// Keep day order for sorting
const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function ScriptureList({
  scriptures,
  notes,
  user,
}: ScriptureListProps) {
  // Sort scriptures by day order (same logic as before)
  const sortedScriptures = [...scriptures].sort((a, b) => {
    const dayA = a.day_of_week || "";
    const dayB = b.day_of_week || "";
    const indexA = dayOrder.indexOf(dayA);
    const indexB = dayOrder.indexOf(dayB);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Handle empty state
  if (!sortedScriptures || sortedScriptures.length === 0) {
    // Use a neutral gray shade for dimmed text
    return (
      <Text c="neutralGray.6">
        No scriptures available for this devotional.
      </Text>
    );
  }

  return (
    // Use a Stack to list scripture blocks
    <Stack gap="lg">
      {sortedScriptures.map((scripture) => (
        // Each scripture is its own Stack
        <Stack key={scripture.id} gap="xs">
          {/* Header Row: Title, Badge, Notes Button */}
          <Group justify="space-between" wrap="nowrap" pr="lg">
            <Group gap="sm" align="center" wrap="nowrap">
              <Text fw={600} c="coverBlue" size="sm">
                {/* Consider using Title order={6} if desired */}
                {scripture.reference}
              </Text>
            </Group>
            {/* Right side: Badge and Notes Button */}
            <Group gap="xs" wrap="nowrap">
              {scripture.day_of_week && (
                <Badge variant="light" size="xs" radius="xl">
                  {scripture.day_of_week}
                </Badge>
              )}
              <NotesButton
                user={user}
                referenceType="scripture"
                referenceId={String(scripture.id)}
                initialNotes={(notes || []).filter(
                  (note) => note.reference_id === String(scripture.id)
                )}
                size="xs"
              />
            </Group>
          </Group>
          {/* Scripture Text - Always visible */}
          <Text component="div" size="sm" lh="lg">
            <Box
              className="scripture-container"
              dangerouslySetInnerHTML={{
                __html: scripture.text || "No text available.",
              }}
            />
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
