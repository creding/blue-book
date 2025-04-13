"use client";

import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Paper } from "@mantine/core";
import { getURL } from "@/utils/getUrl";

export default function AuthForm({ redirectPath }: { redirectPath: string }) {
  const url = getURL();
  const redirectTo = `${url}/auth/callback?redirect=${encodeURIComponent(
    redirectPath
  )}`;
  console.log("URL:", url);
  console.log("Redirecting to:", redirectTo);
  const supabase = createClientComponentClient();

  return (
    <Paper p="md" withBorder>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#228be6",
                brandAccent: "#1c7ed6",
              },
            },
          },
        }}
        providers={["google"]}
        redirectTo={redirectTo}
        theme="default"
      />
    </Paper>
  );
}
