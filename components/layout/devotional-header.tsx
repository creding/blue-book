import { ActionIcon, Burger, Group, Title } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { WeekSelector } from "../ui/week-selector";
import { DaySelector } from "../ui/day-selector";

interface BibleVersion {
  id: string;
  name: string;
}

function ColorSchemeToggle() {
  const colorScheme = useColorScheme();
  return (
    <ActionIcon variant="light" size="sm" aria-label="Toggle color scheme">
      {colorScheme === "dark" ? (
        <IconSun size="1rem" />
      ) : (
        <IconMoonStars size="1rem" />
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
        <Title order={3}>The Blue Book - Jim Branch</Title>
      </Group>
      <Group>
        <Group visibleFrom="sm">
          <WeekSelector week={week} day={day} />
          <DaySelector week={week} day={day} />
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
