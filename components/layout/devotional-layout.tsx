"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Devotional } from "@/types/devotional";
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
  Select,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { TableOfContents } from "../ui/table-of-contents";
import { DevotionalDisplay } from "../pages/devotional-display";
import { SearchSidebar } from "../ui/search-sidebar";
import { useDevotional } from "@/providers/devotional-provider";
import { bible_versions } from "@/lib/bibles";
import { useBibleVersion } from "@/providers/bible-version-provider";
import { DaySelector } from "../ui/day-selector";
import { WeekSelector } from "../ui/week-selector";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

interface DevotionalLayoutProps {
  initialWeek?: number;
  initialDay?: string;
}

function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

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
  const { bibleVersion, setBibleVersion } = useBibleVersion();
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentDevotional,
    currentWeek,
    setCurrentWeek,
    currentDay,
    setCurrentDay,
    isLoading,
    devotionals,
    nextDevotional,
    previousDevotional,
  } = useDevotional();

  console.log("currentDevotional", currentDevotional);

  // Set initial week and day from props or use current values
  useEffect(() => {
    if (initialWeek && initialDay) {
      // If we have URL params, use those
      setCurrentWeek(initialWeek);
      setCurrentDay(initialDay);
    } else if (!isLoading && currentWeek === null && devotionals.length > 0) {
      // If no URL params and devotionals are loaded, use first devotional
      setCurrentWeek(devotionals[0].devotion_id);
      setCurrentDay("monday");
    }
  }, [devotionals, initialWeek, initialDay, currentWeek, isLoading, setCurrentWeek, setCurrentDay]); // Run when devotionals are loaded or props change

  // Update URL when week or day changes
  useEffect(() => {
    if (
      !isLoading && 
      currentWeek && 
      currentDay && 
      !pathname.includes(`/${currentWeek}/${currentDay}`)
    ) {
      router.push(`/${currentWeek}/${currentDay}`);
    }
  }, [currentWeek, currentDay, router, pathname, isLoading]);

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
                <Select
                  size="sm"
                  placeholder="Select Bible version"
                  data={bible_versions.map((bible) => ({
                    value: bible.id,
                    label: bible.name,
                  }))}
                  value={bibleVersion}
                  onChange={(value) =>
                    setBibleVersion(value || "de4e12af7f28f599-02")
                  }
                  searchable
                />
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
