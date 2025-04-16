import React, { useState } from "react";
import {
  Stack,
  Group,
  ThemeIcon,
  Title,
  Blockquote,
  Box,
  ActionIcon,
  Text,
} from "@mantine/core";
import {
  IconMessageCircleHeart,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Reading, Edge, Note } from "@/types/graphql"; // Assuming types are here
import { ReferenceType } from "@/types/note"; // Assuming type is here
import { User } from "@supabase/supabase-js";

interface ReadingNavigatorProps {
  readings: Edge<Reading>[];
  user: User | null;
}

export const ReadingNavigator = ({ readings, user }: ReadingNavigatorProps) => {
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);

  const handlePrevReading = () => {
    setCurrentReadingIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextReading = () => {
    setCurrentReadingIndex((prevIndex) =>
      Math.min(readings.length - 1, prevIndex + 1)
    );
  };

  // Helper to get notes for the current reading
  const getReadingNotes = (readingId: string | number) => {
    const readingEdge = readings.find(
      (edge) => String(edge.node.id) === String(readingId)
    );
    return (
      readingEdge?.node.notesCollection.edges.map((noteEdge) => ({
        id: noteEdge.node.id,
        content: noteEdge.node.content,
        created_at: noteEdge.node.created_at,
        updated_at: noteEdge.node.updated_at,
        user_id: "", // This should ideally be populated if needed downstream
        reference_type: "reading" as ReferenceType,
        reference_id: String(readingId),
        devotion_id: null, // Assuming devotion ID isn't needed here
        scripture_id: null,
        reading_id: Number(readingId),
      })) || []
    );
  };

  if (!readings || readings.length === 0) {
    return null; // Don't render anything if there are no readings
  }

  const { node: currentReading } = readings[currentReadingIndex];
  const cite = `${currentReading.source || "Source"} ${
    currentReading.author ? ` - ${currentReading.author}` : ""
  }`;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        {/* Title Group */}
        <Group gap="sm">
          <ThemeIcon size="lg" variant="light" color="coverBlue" radius="xl">
            <IconMessageCircleHeart style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={4} c="coverBlue">
            Readings for Reflection
          </Title>
        </Group>

        {/* Navigation Controls - Only show if more than one reading */} 
        {readings.length > 1 && (
          <Group justify="flex-end" gap="xs">
            <ActionIcon
              variant="light"
              onClick={handlePrevReading}
              disabled={currentReadingIndex === 0}
              aria-label="Previous reading"
            >
              <IconArrowLeft size={18} />
            </ActionIcon>
            <Text size="sm" c="dimmed" miw={30} ta="center">
              {currentReadingIndex + 1} / {readings.length}
            </Text>
            <ActionIcon
              variant="light"
              onClick={handleNextReading}
              disabled={currentReadingIndex === readings.length - 1}
              aria-label="Next reading"
            >
              <IconArrowRight size={18} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      {/* Display only the current reading */}
      <Blockquote
        key={currentReading.id}
        cite={cite}
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
        <Group justify="space-between" align="stretch" wrap="nowrap" gap="sm">
          <Box className="reading-container" lh={1.6}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  currentReading.text ||
                  "<p>Reading text not available.</p>",
              }}
            />
          </Box>
          <NotesButton
            user={user}
            referenceType="reading"
            referenceId={String(currentReading.id)}
            initialNotes={getReadingNotes(currentReading.id)}
            size="sm"
          />
        </Group>
      </Blockquote>
    </Stack>
  );
};
