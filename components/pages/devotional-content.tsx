import { Container, Group } from "@mantine/core";
import { DevotionalDisplay } from "./devotional-display";
import { DaySelector } from "../ui/day-selector";
import { WeekSelector } from "../ui/week-selector";
import { getDevotionalDetails } from "@/data-access/getDevotionalDetails";
import { createClient } from "@/lib/supabaseServerClient";

export async function DevotionalContent({
  week,
  day,
}: {
  week: number;
  day: string;
}) {
  // --- Step 1: Get the devotion ID based on week and day ---

  // --- Step 2: Get devotional details using the ID ---
  // Note: userId is now handled *inside* getDevotionalDetails
  const devotional = await getDevotionalDetails(week);
  console.log(devotional);
  return (
    <Container size="md">
      <DevotionalDisplay
        devotional={devotional}
        day={day}
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
