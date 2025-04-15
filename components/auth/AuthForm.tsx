"use client";

import { useState } from "react";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Divider,
  Group,
  Alert, // Import Alert for success message
} from "@mantine/core";
import { IconBrandGoogle, IconInfoCircle } from "@tabler/icons-react"; // Import IconInfoCircle
import { getURL } from "@/utils/getUrl";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { GoogleLoginButton } from "../ui/buttons/google/GoogleLoginButton";

export default function AuthForm({ redirectPath }: { redirectPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  // --- NEW --- State for signup success message
  const [signupMessage, setSignupMessage] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const url = getURL();
  const redirectTo = `${url}/auth/callback?redirect=${encodeURIComponent(
    redirectPath
  )}`;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSignupMessage(""); // Clear previous messages

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.refresh(); // Refresh server data
        router.push(redirectPath); // Redirect on successful sign-in
      } else {
        // Sign up mode
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
        // --- NEW --- Show success message instead of redirecting
        setSignupMessage(
          "Check your email for the confirmation link to complete sign up."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    setSignupMessage(""); // Clear previous messages

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      // No router.push needed here, Supabase handles redirect via Google
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset messages when mode changes
  const handleModeChange = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setSignupMessage("");
  };

  return (
    <Paper p="xl" withBorder>
      <form onSubmit={handleEmailAuth}>
        <Stack gap="md">
          <Title order={4} c="coverBlue" ta="center">
            {mode === "signin"
              ? "Sign in to your account"
              : "Create an account"}
          </Title>

          {/* Display Error Message */}
          {error && (
            <Alert
              variant="light"
              color="red"
              title="Authentication Error"
              icon={<IconInfoCircle />} // Use an appropriate icon
              withCloseButton
              onClose={() => setError("")} // Allow closing
            >
              {error}
            </Alert>
          )}

          {/* Display Signup Success Message */}
          {signupMessage && (
            <Alert
              variant="light"
              color="teal" // Use a success color
              title="Sign Up Successful"
              icon={<IconInfoCircle />}
              withCloseButton
              onClose={() => setSignupMessage("")}
            >
              {signupMessage}
            </Alert>
          )}

          {/* Hide form fields if sign up was successful */}
          {!signupMessage && (
            <>
              <TextInput
                required
                label="Email address"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                // Suggestion: Add description for password requirements if any
                // description="Password must be at least 6 characters long"
              />

              <Button
                type="submit"
                loading={loading}
                fullWidth // Consider fullWidth for main action
              >
                {mode === "signin" ? "Sign in" : "Sign up"}
              </Button>

              <Divider
                label="Or continue with"
                labelPosition="center"
                my="sm"
              />

              <GoogleLoginButton
                onClick={handleGoogleAuth}
                disabled={loading}
                fullWidth
                variant="outline"
              />
            </>
          )}

          {/* Mode Toggle - Conditionally render or adjust text */}
          {!signupMessage && ( // Hide toggle if showing success message
            <Group justify="center" gap={5} mt="sm">
              <Text size="sm" c="neutralGray.6">
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </Text>
              <Anchor
                size="sm"
                component="button"
                type="button"
                onClick={handleModeChange} // Use updated handler
                disabled={loading}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </Anchor>
            </Group>
          )}
        </Stack>
      </form>
    </Paper>
  );
}
