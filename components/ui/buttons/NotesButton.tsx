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
import { NotesSection } from "../notes/NotesSection";
import { Note, ReferenceType } from "@/types/note";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

type NotesButtonProps = {
  referenceType: ReferenceType;
  referenceId: string;
  initialNotes: Note[];
  size?: string;
};

export function NotesButton({
  referenceType,
  referenceId,
  initialNotes,
  size = "md",
}: NotesButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    open();
  };

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
            onClick={handleClick}
            pos="relative"
            color="blue"
          >
            <IconNotes size="80%" />
          </ActionIcon>
        </Tooltip>
      </Indicator>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="md"
        title=""
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
