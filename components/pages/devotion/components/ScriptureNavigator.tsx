import React, { useState, useEffect } from "react";
import {
  Group,
  Stack,
  Text,
  Box,
  Title,
  ActionIcon,
  Blockquote,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Scripture } from "@/types/devotional";
import { Note } from "@/types/note";
import { User } from "@supabase/supabase-js";

interface ScriptureNavigatorProps {
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

export function ScriptureNavigator({
  scriptures,
  notes,
  user,
}: ScriptureNavigatorProps) {
  const scriptureList = scriptures || [];

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

  const [currentScriptureIndex, setCurrentScriptureIndex] = useState<number>(0);

  useEffect(() => {
    if (scriptureList.length === 0) {
      return;
    }

    const jsDayIndex = new Date().getDay();
    const currentDayIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1;
    const currentDayName = dayOrder[currentDayIndex];

    const scriptureForToday = sortedScriptures.find(
      (s) => s.day_of_week === currentDayName
    );

    let defaultIndex = 0;
    if (scriptureForToday) {
      const todayIndex = sortedScriptures.findIndex(
        (s) => s.id === scriptureForToday.id
      );
      if (todayIndex !== -1) {
        defaultIndex = todayIndex;
      }
    }
    setCurrentScriptureIndex(defaultIndex);
  }, [scriptures]);

  if (!sortedScriptures || sortedScriptures.length === 0) {
    return (
      <Text c="neutralGray.6">
        No scriptures available for this devotional.
      </Text>
    );
  }

  const handlePrevScripture = () => {
    setCurrentScriptureIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextScripture = () => {
    setCurrentScriptureIndex((prevIndex) =>
      Math.min(sortedScriptures.length - 1, prevIndex + 1)
    );
  };

  const selectedScripture = sortedScriptures[currentScriptureIndex];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={4} c="coverBlue">
          {selectedScripture.day_of_week} - {selectedScripture.reference}
        </Title>
        {sortedScriptures.length > 1 && (
          <Group justify="flex-end" gap="xs">
            <ActionIcon
              variant="light"
              onClick={handlePrevScripture}
              disabled={currentScriptureIndex === 0}
              aria-label="Previous scripture"
            >
              <IconArrowLeft size={16} />
            </ActionIcon>
            <Text size="sm" c="dimmed" miw={30} ta="center">
              {currentScriptureIndex + 1} / {sortedScriptures.length}
            </Text>
            <ActionIcon
              variant="light"
              onClick={handleNextScripture}
              disabled={currentScriptureIndex === sortedScriptures.length - 1}
              aria-label="Next scripture"
            >
              <IconArrowRight size={16} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      {selectedScripture && (
        <Stack key={selectedScripture.id} gap="xs">
          <Group justify="space-between" wrap="nowrap"></Group>

          <Blockquote
            cite={selectedScripture.reference}
            styles={{
              root: {
                padding: "md",
                border: "1px solid var(--mantine-color-neutralGray-2)",
                background: "var(--mantine-color-neutralGray-0)",
              },
              cite: {
                color: "var(--mantine-color-gray-7)",
                fontSize: "sm",
                marginTop: "xs",
              },
            }}
            radius="sm"
          >
            <Group justify="space-between" wrap="nowrap" align="stretch">
              <Box
                className="scripture-container"
                dangerouslySetInnerHTML={{
                  __html: selectedScripture.text || "No text available.",
                }}
              />
              <NotesButton
                user={user}
                referenceType="scripture"
                referenceId={String(selectedScripture.id)}
                initialNotes={(notes || []).filter(
                  (note) => note.reference_id === String(selectedScripture.id)
                )}
                size="sm"
              />
            </Group>
          </Blockquote>
        </Stack>
      )}
    </Stack>
  );
}
