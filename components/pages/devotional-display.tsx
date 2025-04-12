"use client";

import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Blockquote,
  Divider,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBook,
  IconMessageCircleHeart,
  IconMusic,
  IconAlertCircle,
} from "@tabler/icons-react";
import FavoriteButton from "@/components/ui/buttons/FavoriteButton";
import ShareButton from "@/components/ui/buttons/ShareButton";
import PrintButton from "@/components/ui/buttons/PrintButton";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Devotional } from "@/types/devotional";
import { Note } from "@/types/note";
import { ScriptureAccordion } from "../ui/scripture-accordion";

export interface DevotionalDisplayProps {
  devotional: Devotional | null;
  notes: {
    devotion: Note[];
    psalm: Note[];
    scripture: Note[];
    readings: Note[][];
  };
}

export function DevotionalDisplay({
  devotional,
  notes = {
    devotion: [],
    psalm: [],
    scripture: [],
    readings: [],
  },
}: DevotionalDisplayProps) {
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
        <Group gap="xs" align="flex-start">
          <FavoriteButton
            devotionalId={devotional.id}
            initialFavorited={devotional.isFavorited}
            size="sm"
          />
          <ShareButton onClick={handleShare} size="sm" />
          <PrintButton onClick={handlePrint} size="sm" />
          <NotesButton
            referenceType="devotion"
            referenceId={String(devotional.id)}
            initialNotes={devotional.notes.devotion || []}
            size="sm"
          />
        </Group>
      </Group>
      <Stack gap="xl">
        {/* Opening Prayer */}
        {devotional.opening_prayer && (
          <Stack gap="sm">
            <Group gap="sm" mb={4}>
              <IconBook size={22} color={theme.colors.gray[7]} />
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
            <Group justify="space-between" align="center" mb={4}>
              <Group gap="sm">
                <IconBook size={22} color={theme.colors.gray[7]} />
                <Title order={4}>{devotional.psalm.reference || "Psalm"}</Title>
              </Group>
              <NotesButton
                referenceType="scripture"
                referenceId={String(devotional.psalm?.id)}
                initialNotes={notes.psalm || []}
                size="sm"
              />
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
        {/* Daily Scriptures */}
        {devotional.scriptures?.length > 0 && (
          <ScriptureAccordion
            scriptures={devotional.scriptures}
            notes={devotional.notes.scripture || []}
          />
        )}

        {/* Readings / Reflection */}
        {devotional.readings && devotional.readings.length > 0 && (
          <Stack gap="md">
            <Group justify="space-between" align="center" mb={4}>
              <Group gap="sm">
                <IconMessageCircleHeart
                  size={22}
                  color={theme.colors.gray[7]}
                />
                <Title order={4}>For Reflection</Title>
              </Group>
            </Group>
            <Stack gap="lg">
              {/* Gap between multiple reading blockquotes */}
              {devotional.readings.map((reading, index) => (
                <div key={reading.id}>
                  <Blockquote cite={reading.source} p="md" radius="md">
                    <Group
                      justify="space-between"
                      align="stretch"
                      wrap="nowrap"
                    >
                      <div
                        className="reading-container"
                        dangerouslySetInnerHTML={{ __html: reading.text || "" }}
                      />
                      <NotesButton
                        referenceType="reading"
                        referenceId={String(reading.id)}
                        initialNotes={devotional.notes.readings[index] || []}
                        size="sm"
                      />
                    </Group>
                  </Blockquote>
                </div>
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
              <IconBook size={24} color={theme.colors.gray[7]} />
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
              <IconMusic size={24} color={theme.colors.gray[7]} />
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
