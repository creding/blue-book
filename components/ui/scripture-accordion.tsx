import {
  Accordion,
  Group,
  Stack,
  Text,
  Box,
  // Removed useMantineTheme
  Divider, // Optional divider
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
          {/* Control Section: Scripture Reference & Day */}
          <Accordion.Control>
            <Group justify="space-between" wrap="nowrap">
              {/* Left side: Icon and Reference */}
              <Group gap="sm" align="center" wrap="nowrap">
                {/* Use a neutral gray for the icon */}
                <IconBook
                  size={20}
                  color="var(--mantine-color-neutralGray-6)"
                />
                {/* Text for Reference - fw/size props don't need theme */}
                <Text fw={600} size="sm">
                  {scripture.reference}
                </Text>
              </Group>
              {/* Right side: Day (optional) */}
              {scripture.day && (
                // Use a neutral gray shade for dimmed text
                <Text size="xs" c="neutralGray.6">
                  {scripture.day}
                </Text>
              )}
            </Group>
          </Accordion.Control>

          {/* Panel Section: Scripture Text & Notes */}
          <Accordion.Panel>
            {/* Use theme spacing keys */}
            <Stack gap="md" p="xs">
              {/* Wrap scripture text in Text component for easier styling */}
              <Text component="div" size="sm" lh="lg">
                {" "}
                {/* Use size/lh keys */}
                <Box
                  className="scripture-container"
                  // Inline styles removed, handled by Text props or CSS for .scripture-container
                  dangerouslySetInnerHTML={{
                    __html: scripture.text || "No text available.",
                  }}
                />
              </Text>

              {/* Optional Divider */}
              {/* <Divider my="sm" /> */}

              {/* Notes Button - Align to the right */}
              <Group justify="flex-end">
                <NotesButton
                  user={user}
                  referenceType="scripture"
                  referenceId={String(scripture.id)}
                  initialNotes={(notes || []).filter(
                    (note) => note.reference_id === String(scripture.id)
                  )}
                  size="xs" // Use theme size key
                />
              </Group>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
