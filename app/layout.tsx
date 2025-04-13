import type React from "react";
import "@mantine/core/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
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
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}

import "./globals.css";
