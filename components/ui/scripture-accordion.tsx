import { Accordion, Group, Stack, Title } from "@mantine/core";
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
  // Sort scriptures by day order
  const sortedScriptures = [...scriptures].sort((a, b) => {
    if (!a.day || !b.day) return 0;
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });

  return (
    <Accordion>
      {sortedScriptures.map((scripture) => (
        <Accordion.Item
          key={scripture.id}
          value={scripture.day || String(scripture.id)}
        >
          <Accordion.Control>
            <Group align="center">
              <Group gap="sm">
                <IconBook size={22} color="gray.7" />
                <Title order={4}>{scripture.reference}</Title>
              </Group>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <Group justify="space-between" align="stretch" wrap="nowrap">
                <div
                  className="scripture-container"
                  dangerouslySetInnerHTML={{
                    __html: scripture.text,
                  }}
                />
                <NotesButton
                  user={user}
                  referenceType="scripture"
                  referenceId={String(scripture.id)}
                  initialNotes={(notes || []).filter(
                    (note) => note.reference_id === String(scripture.id)
                  )}
                  size="sm"
                />
              </Group>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
