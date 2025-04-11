import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotional-content";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { getCurrentWeekAndDay } from "@/lib/date-utils";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";

export default function HomePage() {
  const { week, day } = getCurrentWeekAndDay();

  return (
    <>
      <DevotionalLayout
        week={week}
        day={day}
        toc={<TableOfContents week={week} />}
      >
        <Suspense fallback={<DevotionalSkeleton />}>
          <DevotionalContent week={week} day={day} />
        </Suspense>
      </DevotionalLayout>
    </>
  );
}
