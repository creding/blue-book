import {
  Text,
  Title,
  Stack,
  ScrollArea,
  NavLink,
  Center, // For centering states
  Alert, // For error display
  Box, // For layout control
} from "@mantine/core";
import {
  IconListSearch, // Icon for empty state
  IconAlertCircle, // Icon for error state
} from "@tabler/icons-react";
import Link from "next/link";
import { getDevotions } from "@/data-access/graphql/getDevotions";
import { Devotional } from "@/types/devotional"; // Assuming you have this type

// Helper function to safely extract data
function mapDevotionals(response: any): Devotional[] {
  // Add more robust checks based on your actual GraphQL response structure
  if (!response?.devotionsCollection?.edges) {
    console.warn("Unexpected response structure from getDevotions:", response);
    return [];
  }
  return response.devotionsCollection.edges
    .map((edge: any) => edge?.node) // Safely access node
    .filter(
      (node: any): node is Devotional =>
        node != null &&
        node.id != null &&
        node.slug != null &&
        node.title != null
    ); // Basic validation
}

export async function TableOfContents({ slug }: { slug: string }) {
  let devotionals: Devotional[] = [];
  let fetchError: string | null = null;

  try {
    const response = await getDevotions();
    devotionals = mapDevotionals(response);
  } catch (error) {
    console.error("Failed to fetch devotionals for Table of Contents:", error);
    fetchError = "Failed to load devotionals. Please try again later.";
  }

  // --- Render Error State ---
  if (fetchError) {
    return (
      <Stack gap="md" h="100%" p="md">
        <Title order={4}>Table of Contents</Title>
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Error"
          color="red"
          variant="light"
          radius="md"
        >
          {fetchError}
        </Alert>
      </Stack>
    );
  }

  // --- Render Content ---
  return (
    // Use Flexbox for layout: Stack fills height, ScrollArea grows
    <Stack gap="md" h="100%">
      <Title order={4} px="md" pt="md">
        {" "}
        {/* Add padding around title */}
        Table of Contents
      </Title>

      {/* ScrollArea takes remaining space */}
      <Box style={{ flexGrow: 1, overflow: "hidden" }}>
        <ScrollArea h="100%" type="auto" offsetScrollbars>
          {/* Add padding inside ScrollArea */}
          <Stack gap={4} px="md" pb="md">
            {" "}
            {/* Reduced gap for tighter NavLinks */}
            {devotionals.length > 0 ? (
              devotionals.map((devotional) => (
                <NavLink
                  key={devotional.id}
                  active={devotional.slug === slug}
                  variant="light" // Makes active state more prominent
                  component={Link}
                  href={`/devotions/${devotional.slug}`}
                  label={devotional.title || "Untitled"} // Fallback title
                  p="sm" // Adjust padding for desired density
                  fz="sm" // Adjust font size if needed
                  rightSection={
                    <Text span c="dimmed" size="xs">
                      {/* Ensure 'id' is user-friendly here, or use another field like week_number */}
                      Week {devotional.id}
                    </Text>
                  }
                />
              ))
            ) : (
              // Improved Empty State
              <Center h={150}>
                <Stack align="center" gap="xs" c="dimmed">
                  <IconListSearch size={40} stroke={1.5} />
                  <Text size="sm">No devotionals found.</Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </ScrollArea>
      </Box>
    </Stack>
  );
}
