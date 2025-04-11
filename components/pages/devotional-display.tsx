"use client";

import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  ActionIcon,
  Skeleton, // Keep if you plan to add loading states
  Blockquote,
  Divider, // Import Divider
  Tooltip, // Import Tooltip
  useMantineTheme, // Import theme hook if needed for direct access
} from "@mantine/core";
import {
  IconShare,
  IconPrinter,
  IconHeart,
  IconHeartFilled, // Use filled icon for favorited state
  IconBook, // Icon for Scripture/Psalm
  IconMessageCircleHeart, // Icon for Readings/Reflection
  IconPray, // Icon for Prayer
  IconMusic, // Icon for Song
  IconAlertCircle, // Icon for error state
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Devotional } from "@/types/devotional";
// Assuming fetchEsvAction is used elsewhere to populate text fields

// --- CSS Placeholders (Add these styles to your global CSS or a CSS module) ---
/*
.scripture-container p, .reading-container p {
  margin-bottom: var(--mantine-spacing-sm);
  line-height: var(--mantine-line-height-md); // Use theme line height
}

// Style verse numbers (common in ESV HTML)
.scripture-container sup.versenum {
  font-weight: 500;
  color: var(--mantine-color-dimmed); // Or use a subtle theme color
  margin-right: rem(2);
  font-size: 0.8em; // Slightly smaller
}

// Style potential headings within ESV text
.scripture-container h3, .scripture-container h4 {
  font-family: var(--mantine-font-family-headings); // Use heading font from theme
  font-size: var(--mantine-font-size-lg);        // Use theme font size
  margin-top: var(--mantine-spacing-lg);
  margin-bottom: var(--mantine-spacing-xs);
  color: var(--mantine-color-text); // Use theme text color
}

// Improve line length for readability
.scripture-container, .reading-container {
  max-width: 70ch; // Adjust as needed
}
*/
// --- End CSS Placeholders ---

export interface DevotionalDisplayProps {
  devotional: Devotional | null;
  day: string | null; // Consider formatting day outside this component if possible
}

export function DevotionalDisplay({ devotional, day }: DevotionalDisplayProps) {
  // --- State ---
  // TODO: Implement favorite logic properly
  // - Load initial favorites (e.g., from localStorage or user data)
  // - Update state and persistent storage on click
  const [isFavorite, setIsFavorite] = useState(false);

  const theme = useMantineTheme(); // Access theme for potential direct use

  // --- Handlers ---
  const handleShare = () => {
    /* ... (same as before) ... */
  };
  const handlePrint = () => {
    window.print();
  };
  const handleToggleFavorite = () => {
    // Placeholder: Implement actual logic to save/remove favorite
    setIsFavorite((prev) => !prev);
    console.log("Toggling favorite for devotional ID:", devotional?.id);
  };

  // --- Loading State (Example - uncomment and adapt if needed) ---
  // if (devotional === undefined) { // Check for undefined if loading isn't handled by parent
  //   return (
  //     <Paper p="lg" withBorder>
  //       <Stack>
  //         <Skeleton height={30} width="70%" radius="sm" />
  //         <Skeleton height={15} width="30%" radius="sm" mb="md" />
  //         <Skeleton height={150} radius="sm" />
  //         <Divider my="lg" />
  //         <Skeleton height={200} radius="sm" />
  //       </Stack>
  //     </Paper>
  //   );
  // }

  // --- Error State: No Devotional Found ---
  if (!devotional) {
    return (
      <Paper p="xl" withBorder radius="md" shadow="xs">
        <Stack align="center" gap="md">
          <IconAlertCircle size={48} color={theme.colors.gray[6]} />
          <Title order={3} ta="center">
            No Devotional Available
          </Title>
          <Text ta="center" c="dimmed">
            We couldn't find a devotional entry for the selected day. Please
            select another date or check back later.
          </Text>
        </Stack>
      </Paper>
    );
  }

  // --- Main Devotional Display ---
  return (
    // Use theme's Paper default shadow and radius
    <Paper p="lg" className="devotional-content">
      <Stack gap="xl">
        {" "}
        {/* Increased main gap for better section separation */}
        {/* Header: Title & Actions */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title order={2} style={{ flexGrow: 1 }}>
            {devotional.title}
          </Title>
          <Group gap="xs" wrap="nowrap">
            <Tooltip
              label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <ActionIcon
                variant="light" // Use light variant for better theme integration
                color={isFavorite ? "red" : theme.primaryColor} // Use theme primary color
                size="lg"
                onClick={handleToggleFavorite}
              >
                {isFavorite ? (
                  <IconHeartFilled size="1.2rem" />
                ) : (
                  <IconHeart size="1.2rem" />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Share devotional">
              <ActionIcon variant="light" size="lg" onClick={handleShare}>
                <IconShare size="1.2rem" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Print devotional">
              <ActionIcon variant="light" size="lg" onClick={handlePrint}>
                <IconPrinter size="1.2rem" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        {/* Opening Prayer */}
        {devotional.opening_prayer && (
          <Stack gap="sm">
            <Group gap="xs" mb={4}>
              <IconBook size="1.1rem" color={theme.colors.gray[7]} />
              <Title order={4}>Opening Prayer</Title>
            </Group>
            <Text lh="md">{devotional.opening_prayer}</Text>
            {devotional.opening_prayer_source && (
              <Text size="xs" c="dimmed" fs="italic" mt={2}>
                — {devotional.opening_prayer_source}
              </Text>
            )}
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.opening_prayer && devotional.psalm?.text && <Divider />}
        {/* Psalm */}
        {devotional.psalm?.text && (
          <Stack gap="sm">
            <Group gap="xs" mb={4}>
              <IconBook size="1.1rem" color={theme.colors.gray[7]} />
              <Title order={4}>{devotional.psalm.reference || "Psalm"}</Title>
            </Group>
            <div
              className="scripture-container"
              dangerouslySetInnerHTML={{ __html: devotional.psalm.text }}
            />
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.psalm?.text && devotional.scriptures[0]?.text && (
          <Divider />
        )}
        {/* Main Scripture */}
        {devotional.scriptures?.[0]?.text && (
          <Stack gap="sm">
            <Group gap="xs" mb={4}>
              <IconBook size="1.1rem" color={theme.colors.gray[7]} />
              <Title order={4}>
                {/* Consider formatting day outside component */}
                Scripture Reading: {devotional.scriptures[0].reference}
              </Title>
            </Group>
            <div
              className="scripture-container"
              dangerouslySetInnerHTML={{
                __html: devotional.scriptures[0].text,
              }}
            />
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.scriptures?.[0]?.text &&
          devotional.readings &&
          devotional.readings.length > 0 && <Divider />}
        {/* Readings / Reflection */}
        {devotional.readings && devotional.readings.length > 0 && (
          <Stack gap="md">
            <Group gap="xs" mb={4}>
              <IconMessageCircleHeart
                size="1.1rem"
                color={theme.colors.gray[7]}
              />
              <Title order={4}>For Reflection</Title>
            </Group>
            <Stack gap="lg">
              {" "}
              {/* Gap between multiple reading blockquotes */}
              {devotional.readings.map((reading) => (
                <Blockquote
                  key={reading.id}
                  cite={`— ${reading.source}`}
                  // Removed hardcoded color, use theme's default styling (gold border)
                  // Mantine v7 Blockquote doesn't need explicit color prop for theme border
                  p="md" // Adjusted padding slightly if needed
                  radius="md" // Inherits default radius
                  // icon={<IconQuote size="1.2rem"/>} // Optional: add quote icon
                >
                  <div
                    className="reading-container" // Use specific class if needed
                    dangerouslySetInnerHTML={{ __html: reading.text || "" }}
                  />
                </Blockquote>
              ))}
            </Stack>
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.readings &&
          devotional.readings.length > 0 &&
          devotional.closing_prayer && <Divider />}
        {/* Closing Prayer */}
        {devotional.closing_prayer && (
          <Stack gap="sm">
            <Group gap="xs" mb={4}>
              <IconBook size="1.1rem" color={theme.colors.gray[7]} />
              <Title order={4}>Closing Prayer</Title>
            </Group>
            <Text lh="md">{devotional.closing_prayer}</Text>
            {devotional.closing_prayer_source && (
              <Text size="xs" c="dimmed" fs="italic" mt={2}>
                — {devotional.closing_prayer_source}
              </Text>
            )}
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.closing_prayer && devotional.song_title && <Divider />}
        {/* Song */}
        {devotional.song_title && (
          <Stack gap="sm">
            <Group gap="xs" mb={4}>
              <IconMusic size="1.1rem" color={theme.colors.gray[7]} />
              <Title order={4}>Suggested Song</Title>
            </Group>
            <Text>{devotional.song_title}</Text>
            {/* Optionally add artist/source if available */}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
