import { DevotionalLayout } from "@/components/devotional-layout"
import { getDevotionalByWeekAndDay } from "@/lib/devotional-service"
import { redirect } from "next/navigation"

export async function generateMetadata({ params }: { params: { week: string; day: string } }) {
  const weekNum = Number.parseInt(params.week, 10)
  const devotional = await getDevotionalByWeekAndDay(weekNum, params.day)

  if (!devotional) {
    return {
      title: "Daily Devotional",
      description: "A modern devotional website with daily content",
    }
  }

  return {
    title: `${devotional.title} | Week ${weekNum}, ${params.day.charAt(0).toUpperCase() + params.day.slice(1)}`,
    description: `Daily devotional for Week ${weekNum}, ${params.day}`,
  }
}

export default async function DevotionalPage({
  params,
}: {
  params: { week: string; day: string }
}) {
  const weekNum = Number.parseInt(params.week, 10)
  const devotional = await getDevotionalByWeekAndDay(weekNum, params.day)

  if (!devotional) {
    redirect("/")
  }

  return <DevotionalLayout initialWeek={weekNum} initialDay={params.day} />
}
