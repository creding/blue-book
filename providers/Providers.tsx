"use client";

import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="light">{children}</MantineProvider>
    </>
  );
}
