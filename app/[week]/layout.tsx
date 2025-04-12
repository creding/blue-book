"use client";

import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme";

export default function WeekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
