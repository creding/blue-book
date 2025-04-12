import { Container } from "@mantine/core";
import { DevotionalDisplay } from "./devotional-display";
import { getDevotionalDetails } from "@/data-access/getDevotionalDetails";

export async function DevotionalContent({ week }: { week: number }) {
  const devotional = await getDevotionalDetails(week);

  return (
    <Container size="md">
      <DevotionalDisplay
        devotional={devotional}
        notes={
          devotional?.notes || {
            devotion: [],
            psalm: [],
            scripture: [],
            readings: [],
          }
        }
      />
    </Container>
  );
}
