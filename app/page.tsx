import LandingPage from "@/components/pages/landing/LandingPage";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme";

export default function HomePage() {
  return (
    <MantineProvider theme={theme}>
      <LandingPage />
    </MantineProvider>
  );
}
