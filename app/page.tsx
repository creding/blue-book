import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotional-content";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { createClient } from "@/lib/supabaseServerClient";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <DevotionalLayout toc={<TableOfContents slug={""} />} user={user}>
        <Suspense fallback={<DevotionalSkeleton />}>
          <DevotionalContent slug={""} user={user} />
        </Suspense>
      </DevotionalLayout>
    </>
  );
}
