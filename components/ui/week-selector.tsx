"use client";

import { Select } from "@mantine/core";
import { useRouter } from "next/navigation";

export function WeekSelector({ week, day }: { week: number; day: string }) {
  const router = useRouter();

  // Generate options for all 52 weeks
  const weekOptions = Array.from({ length: 52 }, (_, i) => ({
    value: String(i + 1),
    label: `Week ${i + 1}`,
  }));

  return (
    <Select
      placeholder="Select week"
      data={weekOptions}
      value={week.toString()}
      onChange={(value) => {
        if (value) {
          router.push(`/${value}/${day}`);
        }
      }}
      size="sm"
      w={120}
    />
  );
}
