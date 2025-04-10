import type React from "react";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { DevotionalProvider } from "@/providers/devotional-provider";
import { BibleVersionProvider } from "@/providers/bible-version-provider";
import { theme } from "@/theme";

export const metadata = {
  title: "Daily Devotional",
  description: "A modern devotional website with daily content",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=yes"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <DevotionalProvider
            initialDevotionals={[]}
            initialDay="monday"
          >
            <BibleVersionProvider>{children}</BibleVersionProvider>
          </DevotionalProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

import "./globals.css";
