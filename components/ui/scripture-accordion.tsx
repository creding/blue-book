import {
  Accordion,
  Group,
  Stack,
  Text,
  Box,
  // Removed useMantineTheme
  Divider,
  ThemeIcon, // Optional divider
} from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Scripture } from "@/types/devotional";
import { Note } from "@/types/note";
import { User } from "@supabase/supabase-js";

interface ScriptureAccordionProps {
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

export function ScriptureAccordion({
  scriptures,
  notes,
  user,
}: ScriptureAccordionProps) {
  // Removed theme = useMantineTheme();

  // Sort scriptures by day order (same logic as before)
  const sortedScriptures = [...scriptures].sort((a, b) => {
    const dayA = a.day || "";
    const dayB = b.day || "";
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
    <Accordion
      variant="separated"
      radius="md" // Uses defaultRadius from theme if not specified, 'md' is explicit
    >
      {sortedScriptures.map((scripture) => (
        <Accordion.Item
          key={scripture.id}
          value={scripture.day || String(scripture.id)}
        >
          <Accordion.Control>
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" align="center" wrap="nowrap">
                <ThemeIcon
                  size="sm"
                  variant="light"
                  color="coverBlue"
                  radius="md"
                >
                  <IconBook style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Text fw={600} c="coverBlue" size="sm">
                  {scripture.reference}
                </Text>
              </Group>
              {scripture.day && (
                <Text size="xs" c="neutralGray.6">
                  {scripture.day}
                </Text>
              )}
            </Group>
          </Accordion.Control>

          {/* Panel Section: Scripture Text & Notes */}
          <Accordion.Panel>
            <Stack gap="md" p="xs">
              <Group justify="space-between" align="stretch" wrap="nowrap">
                <Text component="div" size="sm" lh="lg">
                  <Box
                    className="scripture-container"
                    dangerouslySetInnerHTML={{
                      __html: scripture.text || "No text available.",
                    }}
                  />
                </Text>
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
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
