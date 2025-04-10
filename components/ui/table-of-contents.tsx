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
import Link from "next/link";

export function TableOfContents() {
  const { devotionals } = useDevotional();
  const [filter, setFilter] = useState("");

  const filteredDevotionals = devotionals.filter((devotional) =>
    devotional.title?.toLowerCase().includes(filter.toLowerCase())
  );

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
                component={Link}
                href={`/${devotional.devotion_id}/monday`}
                key={devotional.devotion_id}
                p="xs"
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
