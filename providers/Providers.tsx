"use client";

import { MantineProvider } from "@mantine/core";
import { ColorSchemeScript } from "@mantine/core";
import { theme } from "@/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </>
  );
}
