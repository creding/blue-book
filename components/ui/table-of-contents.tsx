import { Text, Title, Stack, ScrollArea, NavLink } from "@mantine/core";
import Link from "next/link";
import { getDevotions } from "@/data-access/graphql/getDevotions";

export async function TableOfContents({ slug }: { slug: string }) {
  const response = await getDevotions();
  const devotionals =
    response?.devotionsCollection?.edges?.map((edge) => edge.node) || [];

  return (
    <Stack gap="md" h="100%">
      <Title order={4}>Table of Contents</Title>

      <ScrollArea h="calc(100% - 80px)" type="auto" offsetScrollbars>
        <Stack gap="xs">
          {devotionals.length > 0 ? (
            devotionals.map((devotional) => (
              <NavLink
                active={devotional.slug === slug}
                component={Link}
                href={`/devotions/${devotional.slug}`}
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
