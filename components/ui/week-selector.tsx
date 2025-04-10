"use client";

import { Select } from "@mantine/core";
import { useDevotional } from "@/providers/devotional-provider";

export function WeekSelector() {
  const { currentWeek, setCurrentWeek } = useDevotional();

  // Generate options for all 52 weeks
  const weekOptions = Array.from({ length: 52 }, (_, i) => ({
    value: String(i + 1),
    label: `Week ${i + 1}`,
  }));

  return (
    <Select
      placeholder="Select week"
      data={weekOptions}
      value={currentWeek?.toString()}
      onChange={(value) => setCurrentWeek(Number.parseInt(value!, 10))}
      style={{ width: 120 }}
    />
  );
}
