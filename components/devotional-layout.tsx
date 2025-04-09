"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AppShell,
  Burger,
  Group,
  Title,
  Button,
  ActionIcon,
  useMantineColorScheme,
  Transition,
  rem,
  Loader,
  Center,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight, IconSun, IconMoon } from "@tabler/icons-react";
import { TableOfContents } from "./table-of-contents";
import { DevotionalDisplay } from "./devotional-display";
import { SearchSidebar } from "./search-sidebar";
import { useDevotional } from "@/providers/devotional-provider";
import { DaySelector } from "./day-selector";
import { WeekSelector } from "./week-selector";

interface DevotionalLayoutProps {
  initialWeek?: number;
  initialDay?: string;
}

function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="subtle"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {isDark ? <IconSun size="1.1rem" /> : <IconMoon size="1.1rem" />}
    </ActionIcon>
  );
}

export function DevotionalLayout({
  initialWeek,
  initialDay,
}: DevotionalLayoutProps = {}) {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure();
  const [rightOpened, { toggle: toggleRight }] = useDisclosure();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentDevotional,
    currentWeek,
    setCurrentWeek,
    currentDay,
    setCurrentDay,
    nextDevotional,
    previousDevotional,
    isLoading,
  } = useDevotional();

  console.log("currentDevotional", currentDevotional);

  // Set initial week and day from props or URL if provided
  useEffect(() => {
    if (initialWeek) {
      setCurrentWeek(initialWeek);
    }
    if (initialDay) {
      setCurrentDay(initialDay);
    }
  }, [initialWeek, initialDay, setCurrentWeek, setCurrentDay]);

  // Update URL when week or day changes
  useEffect(() => {
    // Only update URL if initialWeek and initialDay were provided
    // or if the user manually navigated (not on first load)
    if (
      currentWeek &&
      currentDay &&
      (initialWeek || initialDay || pathname !== "/") &&
      !pathname.includes(`/week-${currentWeek}/${currentDay}`)
    ) {
      router.push(`/week-${currentWeek}/${currentDay}`);
    }
  }, [currentWeek, currentDay, router, pathname, initialWeek, initialDay]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !leftOpened, desktop: false },
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { mobile: !rightOpened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
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
            {!isMobile && (
              <Group>
                <WeekSelector />
                <DaySelector />
              </Group>
            )}
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
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <TableOfContents />
      </AppShell.Navbar>

      <AppShell.Main>
        {isMobile && (
          <Group mb="md" justify="apart">
            <WeekSelector />
            <DaySelector />
          </Group>
        )}

        <Group justify="apart" mb="md">
          <Button
            leftSection={<IconChevronLeft size={rem(16)} />}
            variant="subtle"
            onClick={previousDevotional}
          >
            Previous
          </Button>
          <Button
            rightSection={<IconChevronRight size={rem(16)} />}
            variant="subtle"
            onClick={nextDevotional}
          >
            Next
          </Button>
        </Group>

        {isLoading ? (
          <Center p="xl">
            <Loader size="md" />
          </Center>
        ) : (
          <Transition
            mounted={!!currentDevotional}
            transition="fade"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <div style={styles}>
                {currentDevotional && (
                  <DevotionalDisplay
                    devotional={currentDevotional}
                    day={currentDay}
                  />
                )}
              </div>
            )}
          </Transition>
        )}
      </AppShell.Main>

      <AppShell.Aside p="md">
        <SearchSidebar />
      </AppShell.Aside>
    </AppShell>
  );
}
