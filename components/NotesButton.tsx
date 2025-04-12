"use client";

import {
  ActionIcon,
  Badge,
  Drawer,
  Indicator,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
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
      <Indicator
        label={initialNotes.length}
        radius="xl"
        size={16}
        variant="filled"
        disabled={initialNotes.length === 0}
        color="red"
      >
        <Tooltip label="Notes">
          <ActionIcon
            size={size}
            variant="subtle"
            onClick={open}
            pos="relative"
            color="blue"
          >
            <IconNotes />
          </ActionIcon>
        </Tooltip>
      </Indicator>

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
