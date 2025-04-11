import { Text, Title, Stack, ScrollArea, NavLink } from "@mantine/core";
import Link from "next/link";
import { getDevotionals } from "@/data-access/devotion";

export async function TableOfContents({ week }: { week: number }) {
  const devotionals = await getDevotionals();

  return (
    <Stack gap="md" h="100%">
      <Title order={4}>Table of Contents</Title>

      <ScrollArea h="calc(100% - 80px)" type="auto" offsetScrollbars>
        <Stack gap="xs">
          {devotionals.length > 0 ? (
            devotionals.map((devotional) => (
              <NavLink
                active={devotional.id === week}
                component={Link}
                href={`/${devotional.id}/monday`}
                key={devotional.id}
                p="sm"
                rightSection={
                  <Text span c="dimmed" size="xs">
                    Week {devotional.id}
                  </Text>
                }
                label={devotional.title}
              />
            ))
          ) : (
            <Text c="dimmed" size="sm">
              No devotionals found
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
