import type React from "react";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "./globals.css";

export const metadata = {
  title: "The Blue Book - A Devotional Guide by Jim Branch",
  description:
    "Discover The Blue Book, a devotional guide by Jim Branch to deepen your journey with Jesus through scriptures, prayers, and reflections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light" theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
