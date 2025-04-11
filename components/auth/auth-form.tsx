"use client";

import { Auth } from "@supabase/auth-ui-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Box, Paper } from "@mantine/core";
import { useSearchParams } from "next/navigation";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const redirectTo = `${
    window.location.origin
  }/auth/callback?redirect=${encodeURIComponent(redirectPath)}`;

  const supabase = createClientComponentClient();

  return (
    <Box maw={400} mx="auto" mt="xl">
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
    </Box>
  );
}
