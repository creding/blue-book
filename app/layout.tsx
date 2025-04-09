import type React from "react"
import "@mantine/core/styles.css"
import { MantineProvider, ColorSchemeScript } from "@mantine/core"
import { theme } from "@/theme"
import { DevotionalProvider } from "@/providers/devotional-provider"

export const metadata = {
  title: "Daily Devotional",
  description: "A modern devotional website with daily content",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=yes" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <DevotionalProvider>{children}</DevotionalProvider>
        </MantineProvider>
      </body>
    </html>
  )
}


import './globals.css'