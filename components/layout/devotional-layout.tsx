"use client";

import { AppShell } from "@mantine/core";

import { TableOfContents } from "../ui/table-of-contents";
import { DevotionalHeader } from "./devotional-header";
import { SearchSidebar } from "../ui/search-sidebar";
import { useDisclosure } from "@mantine/hooks";

interface DevotionalLayoutProps {
  children: React.ReactNode;
  toc: React.ReactNode;
}

export function DevotionalLayout({ children, toc }: DevotionalLayoutProps) {
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
