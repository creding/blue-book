"use client";

import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  ActionIcon,
  Skeleton,
  Container,
} from "@mantine/core";
import {
  IconStar,
  IconShare,
  IconPrinter,
  IconBug,
  IconHeart,
  IconHeartCheck,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useBibleVersion } from "@/providers/bible-version-provider";
import { Devotional } from "@/types/devotional";
import { getDayContent } from "@/lib/devotional-utils";
import { fetchEsvAction } from "@/actions/esv";

export interface DevotionalDisplayProps {
  devotional: Devotional;
  day: string | null;
}

export function DevotionalDisplay({ devotional, day }: DevotionalDisplayProps) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [psalm, setPsalm] = useState<string | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const { bibleVersion } = useBibleVersion();

  useEffect(() => {
    async function fetchVerses() {
      if (devotional) {
        if (devotional.psalm?.reference) {
          const psalmText = await fetchEsvAction(devotional.psalm.reference);
          setPsalm(psalmText);
        }
        if (devotional.scriptures[0].reference) {
          const verseText = await fetchEsvAction(
            devotional.scriptures[0].reference
          );
          setVerse(verseText);
        }
      }
    }
    fetchVerses();
  }, [devotional, bibleVersion]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (devotional && favorites.includes(devotional.devotion_id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [devotional, favorites]);

  const toggleFavorite = () => {
    if (!devotional) return;

    const devotionId = devotional.devotion_id;
    let newFavorites: number[];

    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== devotionId);
    } else {
      newFavorites = [...favorites, devotionId];
    }

    setFavorites(newFavorites);
  };

  const handleShare = () => {
    if (navigator.share && devotional) {
      navigator
        .share({
          title: devotional.title || "Daily Devotional",
          text: `Check out this devotional: ${devotional.title}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      console.log("Web Share API not supported");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!devotional) {
    return (
      <Paper p="md" withBorder>
        <Stack gap="md">
          <Title order={2}>No Devotional Available</Title>
          <Text>
            Sorry, we couldn't find a devotional for this day. Please try
            another day.
          </Text>
        </Stack>
      </Paper>
    );
  }

  const { scripture, reflection } = getDayContent(devotional, day);

  // Format psalm if it exists
  const psalmContent = devotional.psalm
    ? `${devotional.psalm.reference}\n\n${devotional.psalm.text}`
    : null;

  return (
    <Paper p="lg" withBorder className="devotional-content">
      <Stack gap="lg">
        <Group justify="space-between" mb="md">
          <Title order={2}>{devotional.title}</Title>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              color={isFavorite ? "red" : "blue"}
              onClick={toggleFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <IconHeartCheck /> : <IconHeart />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              onClick={handleShare}
              title="Share devotional"
            >
              <IconShare />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              onClick={handlePrint}
              title="Print devotional"
            >
              <IconPrinter />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              onClick={() => setShowDebug(!showDebug)}
              title="Toggle debug info"
            >
              <IconBug />
            </ActionIcon>
          </Group>
        </Group>

        {/* Opening Prayer */}
        {devotional.opening_prayer && (
          <Stack gap="xs">
            <Title order={3}>Opening Prayer</Title>
            <Text>{devotional.opening_prayer}</Text>
            <Text c="dimmed" size="sm" fs="italic">
              -- {devotional.opening_prayer_source}
            </Text>
          </Stack>
        )}

        {/* Psalm */}
        {devotional?.psalm?.reference && (
          <Stack gap="xs">
            <Title order={3}>{devotional?.psalm?.reference}</Title>
            <div className="scripture-container">
              {psalm ? (
                <div dangerouslySetInnerHTML={{ __html: psalm }} />
              ) : (
                <Stack gap="md">
                  <Skeleton height={16} radius="xl" />
                  <Skeleton height={16} radius="xl" width="90%" />
                  <Skeleton height={16} radius="xl" width="95%" />
                  <Skeleton height={16} radius="xl" width="85%" />
                </Stack>
              )}
            </div>
          </Stack>
        )}

        {/* Scripture */}
        {verse ? (
          <Stack gap="xs">
            <Title order={3}>
              Scripture for{" "}
              {day
                ? day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
                : ""}
              {" - "}
              {devotional?.scriptures[0]?.reference}
            </Title>
            <div className="scripture-container">
              <div dangerouslySetInnerHTML={{ __html: verse }} />
            </div>
          </Stack>
        ) : (
          <></>
        )}

        {/* Readings */}
        {devotional.readings && devotional.readings.length > 0 && (
          <Stack gap="xs">
            <Title order={3}>For Reflection</Title>
            <Stack gap="lg">
              {devotional.readings.map((reading) => (
                <Stack key={reading.id} gap="xs">
                  {reading.title && <Text fw={500}>{reading.title}</Text>}
                  <Text>{reading.text}</Text>
                  {reading.source && (
                    <Text size="sm" fs="italic" c="dimmed">
                      — {reading.source}
                    </Text>
                  )}
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

        {/* Closing Prayer */}
        {devotional.closing_prayer && (
          <Stack gap="xs">
            <Title order={3}>Closing Prayer</Title>
            <Text>{devotional.closing_prayer}</Text>
            <Text size="sm" fs="italic" c="dimmed">
              -- {devotional.closing_prayer_source}
            </Text>
          </Stack>
        )}

        {/* Song */}
        {devotional.song_title && (
          <Stack gap="xs">
            <Title order={3}>Song</Title>
            <Text>{devotional.song_title}</Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
