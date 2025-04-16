"use client";

import { ActionIcon, Group, Title, Anchor, ThemeIcon } from "@mantine/core";
import { IconSearch, IconMenu2, IconCross } from "@tabler/icons-react";
import { LoginButton } from "../ui/buttons/LoginButton";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import cross from "@/images/celtic_cross.svg";
interface HeaderProps {
  toggleLeft: () => void;
  toggleRight: () => void;
  user: User | null;
}

export function Header({ toggleLeft, toggleRight, user }: HeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <ActionIcon
          onClick={toggleLeft}
          variant="light"
          size="lg"
          radius="xl"
          hiddenFrom="sm"
          aria-label="Toggle table of contents"
        >
          <IconMenu2 size={16} stroke={1.5} />
        </ActionIcon>

        <Anchor component={Link} href="/">
          <Group gap="xs">
            <ThemeIcon size="lg" variant="light" color="coverBlue" radius="xl">
              <IconCross style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ThemeIcon>
            <Title td="none" order={3}>
              The Blue Book
            </Title>
          </Group>
        </Anchor>
      </Group>
      <Group>
        <Group gap="sm">
          <LoginButton user={user} />
          <ActionIcon
            onClick={toggleRight}
            variant="light"
            size="lg"
            radius="xl"
            aria-label="Toggle search"
          >
            <IconSearch size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Group>
    </Group>
  );
}
