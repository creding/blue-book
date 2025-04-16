import React, { useState, useMemo, useEffect } from "react";
import {
  Stack,
  Group,
  Text,
  Title,
  Box,
  Blockquote,
  ActionIcon,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconQuote } from "@tabler/icons-react";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { User } from "@supabase/supabase-js";
import { Reading } from "@/types/graphql";
import { Note } from "@/types/note";

interface ReadingNavigatorProps {
  readings: Reading[];
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

export function ReadingNavigator({
  readings,
  notes,
  user,
}: ReadingNavigatorProps) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const allReadings = readings || [];

  const readingsByDay = useMemo(() => {
    const grouped: { [key: string]: Reading[] } = {};
    const totalReadings = allReadings.length;
    const readingsPerDayBase = Math.floor(totalReadings / 7);
    const extraDays = totalReadings % 7;

    let currentIndex = 0;
    dayOrder.forEach((day, index) => {
      const count = readingsPerDayBase + (index < extraDays ? 1 : 0);
      grouped[day] = allReadings.slice(currentIndex, currentIndex + count);
      currentIndex += count;
    });
    return grouped;
  }, [allReadings]);

  useEffect(() => {
    const jsDayIndex = new Date().getDay();
    const todayIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1;
    setCurrentDayIndex(todayIndex);
  }, []);

  const currentDay = dayOrder[currentDayIndex];
  const currentReadings = readingsByDay[currentDay] || [];

  const handlePreviousDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex === 0 ? 6 : prevIndex - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex === 6 ? 0 : prevIndex + 1));
  };

  if (allReadings.length === 0) {
    return <Text c="neutralGray.6">No daily readings available.</Text>;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="sm">
          <Title order={4} c="coverBlue">
            Daily Readings - {currentDay}
          </Title>
        </Group>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            onClick={handlePreviousDay}
            variant="light"
            disabled={currentDayIndex === 0}
            aria-label="Previous day's readings"
          >
            <IconArrowLeft size={16} />
          </ActionIcon>
          <Text size="sm" c="dimmed" miw={30} ta="center">
            {currentDayIndex + 1} / 7
          </Text>
          <ActionIcon
            onClick={handleNextDay}
            variant="light"
            disabled={currentDayIndex === 6}
            aria-label="Next day's readings"
          >
            <IconArrowRight size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {currentReadings.length > 0 ? (
        currentReadings.map((reading) => {
          const readingNotes = notes.filter(
            (note) =>
              note.reference_type === "reading" &&
              String(note.reference_id) === String(reading.id)
          );

          return (
            <Blockquote
              key={reading.id}
              cite={`${reading.source} ${
                reading.author ? ` - ${reading.author}` : ""
              }`}
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
                  className="reading-container"
                  dangerouslySetInnerHTML={{
                    __html:
                      reading.text || "<p>Reading text not available.</p>",
                  }}
                  style={{
                    flexGrow: 1,
                    marginRight: "var(--mantine-spacing-md)",
                  }}
                  lh={1.6}
                />
                <NotesButton
                  user={user}
                  referenceType="reading"
                  referenceId={String(reading.id)}
                  initialNotes={readingNotes}
                  size="sm"
                />
              </Group>
            </Blockquote>
          );
        })
      ) : (
        <Text c="neutralGray.6" ta="center" my="md">
          No readings assigned for {currentDay}.
        </Text>
      )}
    </Stack>
  );
}
