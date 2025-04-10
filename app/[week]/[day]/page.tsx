import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { getDevotionalByWeekAndDay, fetchDevotionals } from "@/data-access/devotion";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string; day: string }>;
}) {
  const { week, day } = await params;

  // Handle invalid week parameter
  const weekNum = Number.parseInt(week, 10);
  if (isNaN(weekNum)) {
    return {
      title: "Daily Devotional",
      description: "A modern devotional website with daily content",
    };
  }

  const devotional = await getDevotionalByWeekAndDay(weekNum, day);

  if (!devotional) {
    return {
      title: "Daily Devotional",
      description: "A modern devotional website with daily content",
    };
  }

  return {
    title: `${devotional.title} | Week ${weekNum}, ${
      day.charAt(0).toUpperCase() + day.slice(1)
    }`,
    description: `Daily devotional for Week ${weekNum}, ${day}`,
  };
}

export default async function DevotionalPage({
  params,
}: {
  params: Promise<{ week: string; day: string }>;
}) {
  const { week, day } = await params;

  // Handle invalid week parameter
  const weekNum = Number.parseInt(week, 10);
  if (isNaN(weekNum)) {
    redirect("/");
    return null;
  }

  const devotional = await getDevotionalByWeekAndDay(weekNum, day);

  if (!devotional) {
    redirect("/");
    return null;
  }

  return <DevotionalLayout initialWeek={weekNum} initialDay={day} />;
}
