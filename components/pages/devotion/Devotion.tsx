import { Container } from "@mantine/core";
import { DevotionalDisplay } from "./components/DevotionDisplay";
import { getDevotionalDetailsGql } from "@/data-access/graphql/getDevotionalDetails";
import { User } from "@supabase/supabase-js";

export async function DevotionalContent({
  slug,
  user,
}: {
  slug: string;
  user: User | null;
}) {
  const response = await getDevotionalDetailsGql(slug);
  const devotion = response?.devotionsCollection?.edges?.[0]?.node;

  return (
    <Container size="lg" p={{ base: "xs", xl: "xl" }}>
      <DevotionalDisplay devotional={devotion || null} user={user} />
    </Container>
  );
}
