import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotional-content";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";

export default async function DevotionalPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;

  // Handle invalid week parameter
  const weekNum = Number.parseInt(week, 10);
  if (isNaN(weekNum)) {
    redirect("/");
    return null;
  }

  return (
    <DevotionalLayout toc={<TableOfContents week={weekNum} />}>
      <Suspense fallback={<DevotionalSkeleton />}>
        <DevotionalContent week={weekNum} />
      </Suspense>
    </DevotionalLayout>
  );
}
