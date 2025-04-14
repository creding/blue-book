import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotion/Devotion";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { createClient } from "@/lib/supabaseServerClient";
import { PrefaceIntroPage } from "@/components/pages/PrefaceIntroPage";
export const dynamic = "force-dynamic";
export default async function DevotionalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DevotionalLayout toc={<TableOfContents slug={""} />} user={user}>
      <Suspense fallback={<DevotionalSkeleton />}>
        <PrefaceIntroPage />
      </Suspense>
    </DevotionalLayout>
  );
}
