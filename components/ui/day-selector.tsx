"use client";

import { SegmentedControl } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";

const DAYS = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export function DaySelector({ week, day }: { week: number; day: string }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;

  return (
    <SegmentedControl
      data={DAYS}
      value={day}
      onChange={(value) => router.push(`/${week}/${value}`)}
      size={isMobile ? "xs" : "sm"}
    />
  );
}
