import { CustomLayout } from "@/components/layout/CustomLayout";
import { DevotionalSkeleton } from "@/components/skeletons/DevotionalSkeleton";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { createClient } from "@/lib/supabaseServerClient";
import { PrefaceIntroPage } from "@/components/pages/PrefaceIntroPage";

export const dynamic = "force-dynamic";
export default async function DevotionalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <CustomLayout toc={<TableOfContents slug={""} />} user={user}>
      <Suspense fallback={<DevotionalSkeleton />}>
        <PrefaceIntroPage />
      </Suspense>
    </CustomLayout>
  );
}
