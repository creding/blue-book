import React from "react";
import { Stack, Group, Title, Box, Blockquote } from "@mantine/core";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { User } from "@supabase/supabase-js";
import { Scripture } from "@/types/graphql"; 
import { Note } from "@/types/note";

interface PsalmDisplayProps {
  psalm: Scripture; 
  notes: Note[]; 
  user: User | null;
}

export function PsalmDisplay({ psalm, notes, user }: PsalmDisplayProps) {
  if (!psalm) {
    return null; 
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
        <Title order={4} c="coverBlue"> 
          Psalm for the Week
        </Title>
      </Group>
      <Blockquote
        cite={psalm.reference} 
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
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Box pr="md" style={{ flexGrow: 1 }} lh={1.6}> 
            <div
              dangerouslySetInnerHTML={{
                __html: psalm.text || "<p>Psalm text not available.</p>",
              }}
            />
          </Box>
          <NotesButton
            user={user}
            referenceType="scripture"
            referenceId={String(psalm.id)}
            initialNotes={notes}
            size="sm"
          />
        </Group>
      </Blockquote>
    </Stack>
  );
}
