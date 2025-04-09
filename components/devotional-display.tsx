"use client";

import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  ActionIcon,
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
import { Devotional } from "@/types/devotional";
import { getDayContent } from "@/lib/devotional-utils";
import { fetchVersesAction } from "@/actions/fetchVersesAction";

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
  const [bibleVersion, setBibleVersion] = useState<string>();

  useEffect(() => {
    async function fetchVerses() {
      if (devotional) {
        if (devotional.psalm?.reference) {
          const psalmText = await fetchVersesAction(devotional.psalm.reference);
          setPsalm(psalmText);
        }
        if (devotional.scriptures[0].reference) {
          const verseText = await fetchVersesAction(
            devotional.scriptures[0].reference
          );
          setVerse(verseText);
        }
      }
    }
    fetchVerses();
  }, [devotional]);

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
    <Paper p="md" withBorder className="devotional-content">
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
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {devotional.opening_prayer}
            </Text>
          </Stack>
        )}

        {/* Psalm */}
        {psalm && (
          <Stack gap="xs">
            <Title order={3}>{devotional?.psalm?.reference}</Title>
            <div className="scripture-container">
              <div dangerouslySetInnerHTML={{ __html: psalm }} />
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
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {devotional.closing_prayer}
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

        {/* Debug Info */}
        {showDebug && (
          <Stack gap="xs">
            <Title order={3}>Debug Info</Title>
            <Text component="pre" style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(
                {
                  devotional,
                  day,
                },
                null,
                2
              )}
            </Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
