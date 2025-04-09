import { DevotionalLayout } from "@/components/devotional-layout"
import { Title, Text, Container, Paper, Stack } from "@mantine/core"

export default function HomePage() {
  return (
    <>
      <DevotionalLayout />
      <Container size="sm" py="xl" style={{ display: "none" }} className="welcome-message">
        <Paper p="xl" withBorder>
          <Stack spacing="md">
            <Title order={2}>Welcome to Daily Devotional</Title>
            <Text>
              Please select a week and day from the navigation controls above, or browse devotionals from the sidebar.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </>
  )
}
