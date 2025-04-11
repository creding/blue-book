import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotional-content";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import {
  getDevotionalByWeekAndDay,
  getDevotionals,
} from "@/data-access/devotion";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";

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

  return (
    <DevotionalLayout week={weekNum} day={day} toc={<TableOfContents />}>
      <Suspense fallback={<DevotionalSkeleton />}>
        <DevotionalContent week={weekNum} day={day} />
      </Suspense>
    </DevotionalLayout>
  );
}
