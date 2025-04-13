import { ActionIcon, Burger, Group, Title, Anchor } from "@mantine/core";
import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconSearch,
  IconMenu2,
} from "@tabler/icons-react";
import { WeekSelector } from "../ui/week-selector";
import { DaySelector } from "../ui/day-selector";
import { LoginButton } from "../auth/login-button";
import Link from "next/link";

function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="light"
      size="lg"
      radius="xl"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === "dark" ? (
        <IconSun size={16} stroke={1.5} />
      ) : (
        <IconMoonStars size={16} stroke={1.5} />
      )}
    </ActionIcon>
  );
}

interface DevotionalHeaderProps {
  leftOpened: boolean;
  rightOpened: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
}

export function DevotionalHeader({
  leftOpened,
  rightOpened,
  toggleLeft,
  toggleRight,
}: DevotionalHeaderProps) {
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
          <Title td="none" order={3}>
            The Blue Book
          </Title>
        </Anchor>
      </Group>
      <Group>
        <Group gap="sm">
          <LoginButton />
          <ActionIcon
            onClick={toggleRight}
            variant="light"
            size="lg"
            radius="xl"
            aria-label="Toggle search"
          >
            <IconSearch size={16} stroke={1.5} />
          </ActionIcon>
          <ColorSchemeToggle />
        </Group>
      </Group>
    </Group>
  );
}
