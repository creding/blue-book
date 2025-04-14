import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalContent } from "@/components/pages/devotion/Devotion";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { Suspense } from "react";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { createClient } from "@/lib/supabaseServerClient";
import LandingPage from "@/components/pages/LandingPage";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <LandingPage />;
}
