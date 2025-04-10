"use client"

import { SegmentedControl } from "@mantine/core"
import { useDevotional } from "@/providers/devotional-provider"
import { useMediaQuery } from "@mantine/hooks"

const DAYS = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
]

export function DaySelector() {
  const { currentDay, setCurrentDay } = useDevotional()
  const isMobile = useMediaQuery("(max-width: 768px)")

  return <SegmentedControl data={DAYS} value={currentDay} onChange={setCurrentDay} size={isMobile ? "xs" : "sm"} />
}
