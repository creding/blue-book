import { createTheme, rem, MantineColorsTuple } from "@mantine/core";

// Define custom color tuples
// Softer Blue (slightly muted, calming)
const devotionalBlue: MantineColorsTuple = [
  "#e0f2f7", // Lightest
  "#b3e0ed",
  "#80cce2",
  "#4db9d7",
  "#2aa8cf",
  "#1398c8", // Primary Shade (Light Mode Index 6)
  "#0d89bf", // Primary Shade (Dark Mode Index 5)
  "#0976a9",
  "#056494",
  "#025380", // Darkest
];

// Warm Gold Accent (gentle, hopeful)
const devotionalGold: MantineColorsTuple = [
  "#fff8e1", // Lightest
  "#ffecb3",
  "#ffe082",
  "#ffd54f",
  "#ffca28", // Good accent shade
  "#ffc107",
  "#ffb300",
  "#ffa000",
  "#ff8f00",
  "#ff6f00", // Darkest
];

// Neutral Gray
const neutralGray: MantineColorsTuple = [
  "#f8f9fa", // Very light gray (Body Background - Light)
  "#f1f3f5", // Paper Background - Light
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#868e96", // Muted text / borders
  "#495057", // Body Text - Light
  "#343a40", // Headings / Strong Text - Light
  "#212529", // Darkest
];

// Define dark theme colors (inverting grays, adjusting blues/golds)
const darkColors = {
  body: "#1a1b1e", // Dark background
  text: "#C1C2C5", // Light text on dark background
  paper: "#25262b", // Slightly lighter dark for cards/paper
  border: "#2C2E33", // Subtle border for dark mode
  paperHover: "#2C2E33", // Slightly lighter for hover states
};

export const theme = createTheme({
  // --- Core ---
  fontFamily: "Inter, sans-serif",
  primaryColor: "devotionalBlue", // Use the custom key
  primaryShade: { light: 6, dark: 4 }, // Lighter shade in dark mode for better contrast
  defaultRadius: "md", // Consistent radius (can be 'sm', 'md', 'lg' etc.)

  // --- Colors ---
  colors: {
    devotionalBlue, // Register custom blue
    devotionalGold, // Register custom gold
    neutralGray, // Register custom gray
    // You can add more custom colors here if needed
    // Keep Mantine's default colors if you might use them elsewhere
    // blue: [...], etc.
  },

  // Add white and black explicitly
  white: "#ffffff",
  black: "#000000",

  // --- Typography ---
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16), // Base size for body text
    lg: rem(18),
    xl: rem(20),
  },
  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55", // Good readability for body
    lg: "1.6",
    xl: "1.65",
  },
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "600", // Slightly bolder headings
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
    md: rem(8), // Default radius
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
      light: "#FFFFFF", // Pure white for paper in light mode
      dark: darkColors.paper,
    },
    textColor: {
      light: "#1A1B1E", // Near black for light mode
      dark: darkColors.text, // Light gray for dark mode
    },
    borderColor: {
      light: "#E9ECEF", // Subtle border for light mode
      dark: darkColors.border,
    },
    paperHover: {
      light: "#F8F9FA", // Slight gray for hover in light mode
      dark: darkColors.paperHover,
    },
  },

  // --- Component Overrides ---
  components: {
    Paper: {
      defaultProps: (theme: any) => ({
        p: "md",
        radius: theme.defaultRadius,
        // Use theme variables for background
        // Mantine v7 handles dark mode bg mostly automatically based on theme,
        // but explicit setting can be useful if needed.
        // style: (theme) => ({
        //   backgroundColor: theme.colorScheme === 'dark' ? theme.other.paperBg.dark : theme.other.paperBg.light,
        // }),
      }),
    },
    AppShell: {
      styles: (theme: any) => ({
        root: {
          backgroundColor: theme.other.bodyBg[theme.colorScheme],
        },
        main: {
          backgroundColor: theme.other.bodyBg[theme.colorScheme],
        },
        header: {
          backgroundColor: theme.other.paperBg[theme.colorScheme],
        },
        navbar: {
          backgroundColor: theme.other.paperBg[theme.colorScheme],
          dataHover: {
            backgroundColor: theme.other.paperHover[theme.colorScheme],
          },
        },
        aside: {
          backgroundColor: theme.other.paperBg[theme.colorScheme],
        },
      }),
    },
    Button: {
      // Example: Ensure primary buttons look good
      styles: (theme: any, props: any) => ({
        root: {
          transition: "all 0.2s ease",
          ...(props.variant === "filled" && {
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow:
                theme.colorScheme === "dark"
                  ? `0 4px 8px rgba(0, 0, 0, 0.5)`
                  : `0 4px 8px rgba(0, 0, 0, 0.1)`,
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "none",
            },
          }),
        },
      }),
      defaultProps: {
        radius: "xl", // Example: softer, pill-shaped buttons
      },
    },
    Anchor: {
      // Style links
      styles: (theme: any) => ({
        root: {
          color:
            theme.colors.devotionalBlue[theme.colorScheme === "dark" ? 3 : 7],
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": {
            color:
              theme.colors.devotionalBlue[theme.colorScheme === "dark" ? 4 : 6],
            textDecoration: "none",
          },
        },
      }),
    },
    // Add overrides for other components as needed (e.g., Text, Input, Card)
  },
});
