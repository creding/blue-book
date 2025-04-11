import { ActionIcon, Burger, Group, Title, Anchor } from "@mantine/core";
import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
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
  week: number;
  day: string;
}

export function DevotionalHeader({
  leftOpened,
  rightOpened,
  toggleLeft,
  toggleRight,
  week,
  day,
}: DevotionalHeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger
          opened={leftOpened}
          onClick={toggleLeft}
          hiddenFrom="sm"
          size="sm"
        />
        <Anchor component={Link} href="/">
          <Title td="none" c="gray.8" order={3}>
            The Blue Book - Jim Branch
          </Title>
        </Anchor>
      </Group>
      <Group>
        <Group visibleFrom="sm">
          <WeekSelector week={week} day={day} />
          <DaySelector week={week} day={day} />
          <LoginButton />
        </Group>
        <Group gap="xs">
          <Burger
            opened={rightOpened}
            onClick={toggleRight}
            hiddenFrom="md"
            size="sm"
          />
          <ColorSchemeToggle />
        </Group>
      </Group>
    </Group>
  );
}
