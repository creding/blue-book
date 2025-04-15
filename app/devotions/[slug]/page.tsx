import { CustomLayout } from "@/components/layout/CustomLayout";
import { DevotionalContent } from "@/components/pages/devotion/Devotion";
import { DevotionalSkeleton } from "@/components/skeletons/DevotionalSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { createClient } from "@/lib/supabaseServerClient";
export const dynamic = "force-dynamic";
export default async function DevotionalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Handle invalid slug parameter
  if (!slug) {
    redirect("/");
  }

  return (
    <CustomLayout toc={<TableOfContents slug={slug} />} user={user}>
      <Suspense fallback={<DevotionalSkeleton />}>
        <DevotionalContent slug={slug} user={user} />
      </Suspense>
    </CustomLayout>
  );
}
