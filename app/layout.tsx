import type React from "react";
import "@mantine/core/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata = {
  title: "Daily Devotional",
  description: "A modern devotional website with daily content",
  generator: "v0.dev",
};

import AuthProvider from '@/providers/AuthProvider'

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
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
