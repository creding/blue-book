"use client";

import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  ActionIcon,
  Skeleton,
  Blockquote,
  Divider,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconShare,
  IconPrinter,
  IconBook,
  IconMessageCircleHeart,
  IconPray,
  IconMusic,
  IconAlertCircle,
  IconHeartFilled,
  IconHeart,
} from "@tabler/icons-react";
import FavoriteButton from "@/components/FavoriteButton";

import { Devotional } from "@/types/devotional";

export interface DevotionalDisplayProps {
  devotional: Devotional | null;
  day: string | null;
}

export function DevotionalDisplay({ devotional, day }: DevotionalDisplayProps) {
  const theme = useMantineTheme();

  const handleShare = () => {
    if (devotional) {
      navigator
        .share({
          title: devotional.title,
          text: `Check out this devotional: ${devotional.title}`,
          url: window.location.href,
        })
        .catch(console.error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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
      <Group justify="space-between" align="flex-start" mb="md">
        <Title order={2}>{devotional.title}</Title>
        <Group gap="xs">
          <FavoriteButton
            devotionalId={devotional.id}
            initialFavorited={devotional.isFavorited}
          />
          <Tooltip label="Share">
            <ActionIcon variant="subtle" onClick={handleShare}>
              <IconShare style={{ width: "70%", height: "70%" }} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Print">
            <ActionIcon variant="subtle" onClick={handlePrint}>
              <IconPrinter style={{ width: "70%", height: "70%" }} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Stack gap="xl">
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
