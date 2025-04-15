import { createTheme, rem, MantineColorsTuple } from "@mantine/core";

// --- NEW --- Define color tuple based on book cover blue (#1a5276 approximation)
const coverBlue: MantineColorsTuple = [
  "#eaf1f8",
  "#d1dde9",
  "#b4c8db",
  "#94b3cf",
  "#789fc4",
  "#5f8cb9",
  "#4b7daf",
  "#21618C",
  "#1a5276",
  "#103e5e",
];

// Define custom color tuples (Existing)
const devotionalBlue: MantineColorsTuple = [
  "#e0f2f7",
  "#b3e0ed",
  "#80cce2",
  "#4db9d7",
  "#2aa8cf",
  "#1398c8",
  "#0d89bf",
  "#0976a9",
  "#056494",
  "#025380",
];

const devotionalGold: MantineColorsTuple = [
  "#fff8e1",
  "#ffecb3",
  "#ffe082",
  "#ffd54f",
  "#ffca28",
  "#ffc107",
  "#ffb300",
  "#ffa000",
  "#ff8f00",
  "#ff6f00",
];

const neutralGray: MantineColorsTuple = [
  "#f8f9fa",
  "#f1f3f5",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#868e96",
  "#495057",
  "#343a40",
  "#212529",
];

// Define dark theme colors (inverting grays, adjusting blues/golds)
const darkColors = {
  body: "#1a1b1e",
  text: "#C1C2C5",
  paper: "#25262b",
  border: "#2C2E33",
  paperHover: "#2C2E33",
};

export const theme = createTheme({
  // --- Core ---
  fontFamily: "Inter, sans-serif",
  primaryColor: "coverBlue",
  primaryShade: { light: 7, dark: 5 },
  defaultRadius: "md",

  // --- Colors ---
  colors: {
    coverBlue,
    devotionalBlue,
    devotionalGold,
    neutralGray,
    // Keep Mantine's default colors if you might use them elsewhere
  },

  white: "#ffffff",
  black: "#000000",

  // --- Typography ---
  fontSizes: {
    xxs: rem(10),
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.6",
    xl: "1.65",
  },
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
    sizes: {
      h1: { fontSize: rem(34), lineHeight: "1.3" },
      h2: { fontSize: rem(28), lineHeight: "1.35" },
      h3: { fontSize: rem(24), lineHeight: "1.4" },
      h4: { fontSize: rem(20), lineHeight: "1.45" },
      h5: { fontSize: rem(18), lineHeight: "1.5" },
      h6: { fontSize: rem(16), lineHeight: "1.5" },
    },
  },

  // --- Spacing ---
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  // --- Radii ---
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(16),
    xl: rem(24),
  },

  // --- Theme Specific Variables (Optional but helpful) ---
  other: {
    bodyBg: {
      light: "#F8F9FA",
      dark: darkColors.body,
    },
    paperBg: {
      light: "#FFFFFF",
      dark: darkColors.paper,
    },
    textColor: {
      light: "#1A1B1E",
      dark: darkColors.text,
    },
    borderColor: {
      light: "#E9ECEF",
      dark: darkColors.border,
    },
    paperHover: {
      light: "#F8F9FA",
      dark: darkColors.paperHover,
    },
  },
});
