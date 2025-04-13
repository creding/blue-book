"use client";

import { AppShell } from "@mantine/core";
import { DevotionalHeader } from "./devotional-header";
import { SearchSidebar } from "../ui/search-sidebar";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";

interface DevotionalLayoutProps {
  children: React.ReactNode;
  toc: React.ReactNode;
  user: User | null;
}

export function DevotionalLayout({
  children,
  toc,
  user,
}: DevotionalLayoutProps) {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure();
  const [rightOpened, { toggle: toggleRight }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !leftOpened, desktop: false },
      }}
      aside={{
        width: 600,
        breakpoint: "md",
        collapsed: { mobile: !rightOpened, desktop: !rightOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <DevotionalHeader
          leftOpened={leftOpened}
          rightOpened={rightOpened}
          toggleLeft={toggleLeft}
          toggleRight={toggleRight}
          user={user}
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">{toc}</AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Aside>
        <SearchSidebar rightOpened={rightOpened} toggleRight={toggleRight} />
      </AppShell.Aside>
    </AppShell>
  );
}
