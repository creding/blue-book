import { Container, Group } from "@mantine/core";
import { DevotionalDisplay } from "./devotional-display";
import { DaySelector } from "../ui/day-selector";
import { WeekSelector } from "../ui/week-selector";
import { getDevotionalByWeekAndDay } from "@/data-access/devotion";
import { createClient } from "@/lib/supabaseServerClient";
import { getNotesByReference } from "@/data-access/notes";

export async function DevotionalContent({
  week,
  day,
}: {
  week: number;
  day: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const devotional = await getDevotionalByWeekAndDay(week, day, user?.id);
  const notes = devotional ? await getNotesByReference("devotion", String(devotional.id)) : [];

  return (
    <Container size="md">
      <Group hiddenFrom="sm" mb="md" justify="apart">
        <WeekSelector week={week} day={day} />
        <DaySelector week={week} day={day} />
      </Group>
      <DevotionalDisplay devotional={devotional} day={day} notes={notes} />
    </Container>
  );
}
