import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabaseServerClient";
import { revalidatePath } from "next/cache";
import { createApolloClient, resetApolloCache } from "@/lib/apollo";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/";
  // Revalidate all paths that might contain user-specific data
  revalidatePath("/");
  revalidatePath("/devotions");
  revalidatePath("/devotions/[slug]", "layout");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    // Reset Apollo cache to force refetch with new auth state
    resetApolloCache();
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${redirect}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirect}`);
      } else {
        return NextResponse.redirect(`${origin}${redirect}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
