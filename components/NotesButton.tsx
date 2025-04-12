"use client";

import { ActionIcon, Badge, Drawer, useMantineTheme } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { NotesSection } from "./NotesSection";
import { Note, ReferenceType } from "@/types/note";

interface NotesButtonProps {
  referenceType: ReferenceType;
  referenceId: string;
  initialNotes: Note[];
  size?: "sm" | "md" | "lg";
}

export function NotesButton({
  referenceType,
  referenceId,
  initialNotes,
  size = "md",
}: NotesButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  return (
    <>
      <ActionIcon
        variant="subtle"
        onClick={open}
        pos="relative"
        size={size}
        color="blue"
      >
        <IconNotes style={{ width: "70%", height: "70%" }} />
        {initialNotes?.length > 0 && (
          <Badge
            size="sm"
            variant="filled"
            pos="absolute"
            top={-6}
            right={-6}
            radius="xl"
            p={4}
            h={16}
            style={{
              pointerEvents: "none",
            }}
          >
            {initialNotes.length}
          </Badge>
        )}
      </ActionIcon>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="md"
        title="Notes"
      >
        <NotesSection
          referenceType={referenceType}
          referenceId={referenceId}
          initialNotes={initialNotes}
        />
      </Drawer>
    </>
  );
}
