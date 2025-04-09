import { createTheme, rem } from "@mantine/core"

export const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  headings: {
    fontFamily: "Inter, sans-serif",
    sizes: {
      h1: { fontSize: rem(32) },
      h2: { fontSize: rem(28) },
      h3: { fontSize: rem(24) },
      h4: { fontSize: rem(20) },
      h5: { fontSize: rem(18) },
      h6: { fontSize: rem(16) },
    },
  },
  colors: {
    blue: [
      "#E6F7FF",
      "#BAE7FF",
      "#91D5FF",
      "#69C0FF",
      "#4A90E2", // Primary blue
      "#1D39C4",
      "#10239E",
      "#061178",
      "#030852",
      "#01012E",
    ],
    gray: [
      "#F5F6F5", // Light gray background
      "#F0F0F0",
      "#D9D9D9",
      "#BFBFBF",
      "#8C8C8C",
      "#595959",
      "#434343",
      "#262626",
      "#1F1F1F",
      "#141414",
    ],
  },
  primaryColor: "blue",
  primaryShade: 4,
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(16),
    xl: rem(24),
  },
  components: {
    Paper: {
      defaultProps: {
        p: "md",
        radius: "md",
      },
    },
  },
})
