import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotional-content";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";

export default async function DevotionalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Handle invalid slug parameter
  if (!slug) {
    redirect("/");
  }

  return (
    <DevotionalLayout toc={<TableOfContents slug={slug} />}>
      <Suspense fallback={<DevotionalSkeleton />}>
        <DevotionalContent slug={slug} />
      </Suspense>
    </DevotionalLayout>
  );
}
