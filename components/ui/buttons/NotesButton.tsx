"use client";

import { ActionIcon, Drawer, Indicator, Tooltip } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { NotesSection } from "../notes/NotesSection";
import { Note, ReferenceType } from "@/types/note";
import { usePathname, useRouter } from "next/navigation";
import { getURL } from "@/utils/getUrl";
import { User } from "@supabase/supabase-js";

type NotesButtonProps = {
  referenceType: ReferenceType;
  referenceId: string;
  initialNotes: Note[];
  size?: string;
  user: User | null;
};

export function NotesButton({
  referenceType,
  referenceId,
  initialNotes,
  size = "md",
  user,
}: NotesButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = () => {
    if (!user) {
      const url = getURL();
      const currentPath = `${url}${pathname}`;
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
        size={14}
        offset={2}
        variant="filled"
        disabled={initialNotes.length === 0}
        zIndex={50}
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
