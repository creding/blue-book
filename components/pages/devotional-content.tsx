import { Container } from "@mantine/core";
import { DevotionalDisplay } from "./devotional-display";
import { getDevotionalDetailsGql } from "@/data-access/graphql/getDevotionalDetails";

export async function DevotionalContent({ slug }: { slug: string }) {
  const response = await getDevotionalDetailsGql(slug);
  const devotion = response?.devotionsCollection?.edges?.[0]?.node;

  return (
    <Container size="md">
      <DevotionalDisplay devotional={devotion || null} />
    </Container>
  );
}
