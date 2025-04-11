"use client";

import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Box, Paper } from "@mantine/core";

export default function AuthForm({ redirectPath }: { redirectPath: string }) {
  const redirectTo = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/auth/callback?redirect=${encodeURIComponent(redirectPath)}`;

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
