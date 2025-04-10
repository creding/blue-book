"use client";

import { useState } from "react";
import {
  Text,
  Title,
  Stack,
  ScrollArea,
  UnstyledButton,
  Group,
  TextInput,
  NavLink,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useDevotional } from "@/providers/devotional-provider";

export function TableOfContents() {
  const { devotionals, setCurrentWeek, setCurrentDay, currentDevotional } =
    useDevotional();
  const [filter, setFilter] = useState("");

  const filteredDevotionals = devotionals.filter((devotional) =>
    devotional.title?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDevotionalSelect = (devotionId: number) => {
    const devotional = devotionals.find((d) => d.devotion_id === devotionId);
    if (devotional) {
      // Extract week from devotional (assuming it's stored in the title or elsewhere)
      // For this example, we'll use the devotion_id as the week
      const week = devotional.devotion_id;
      setCurrentWeek(week);
      setCurrentDay("monday"); // Default to Monday when selecting from TOC
    }
  };

  return (
    <Stack gap="md" h="100%">
      <Title order={4}>Table of Contents</Title>

      <TextInput
        placeholder="Filter devotionals..."
        leftSection={<IconSearch size="0.9rem" />}
        value={filter}
        onChange={(event) => setFilter(event.currentTarget.value)}
        mb="xs"
      />

      <ScrollArea h="calc(100% - 80px)" type="auto" offsetScrollbars>
        <Stack gap="xs">
          {filteredDevotionals.length > 0 ? (
            filteredDevotionals.map((devotional) => (
              <NavLink
                key={devotional.devotion_id}
                onClick={() => handleDevotionalSelect(devotional.devotion_id!)}
                p="xs"
                component="button"
                variant="subtle"
                color="blue"
                label={devotional.title}
              />
            ))
          ) : (
            <Text color="dimmed" size="sm">
              No devotionals found
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
