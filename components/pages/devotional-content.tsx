import { Container, Group } from "@mantine/core";
import { DevotionalDisplay } from "./devotional-display";
import { DaySelector } from "../ui/day-selector";
import { WeekSelector } from "../ui/week-selector";
import { getDevotionalByWeekAndDay } from "@/data-access/devotion";

export async function DevotionalContent({
  week,
  day,
}: {
  week: number;
  day: string;
}) {
  const devotional = await getDevotionalByWeekAndDay(week, day);

  return (
    <Container size="md">
      <Group hiddenFrom="sm" mb="md" justify="apart">
        <WeekSelector week={week} day={day} />
        <DaySelector week={week} day={day} />
      </Group>
      <DevotionalDisplay devotional={devotional} day={day} />
    </Container>
  );
}
