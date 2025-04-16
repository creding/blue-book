"use client";

import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Divider,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconBook,
  IconQuote,
  IconMessageCircleHeart,
  IconMusic,
  IconAlertCircle,
  IconBible,
} from "@tabler/icons-react";
import FavoriteButton from "@/components/ui/buttons/FavoriteButton";
import ShareButton from "@/components/ui/buttons/ShareButton";
import PrintButton from "@/components/ui/buttons/PrintButton";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Devotion } from "@/types/graphql";
import { ReferenceType } from "@/types/note";
import { ScriptureAccordion } from "@/components/ui/ScriptureAccordion";
import { User } from "@supabase/supabase-js";
import { useMediaQuery } from "@mantine/hooks";
import { ReadingNavigator } from "./ReadingNavigator";
import React from "react";

export interface DevotionalDisplayProps {
  devotional: Devotion | null;
  user: User | null;
}

export function DevotionalDisplay({
  devotional,
  user,
}: DevotionalDisplayProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  if (!devotional) {
    return (
      <Paper p="xl" withBorder radius="md">
        <Stack align="center" gap="md">
          <ThemeIcon size={48} color="red" radius="xl">
            <IconAlertCircle style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={3} ta="center" c="red.8">
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

  const getScriptureNotes = (
    scriptureId: string | number,
    isPsalm: boolean
  ) => {
    const scriptureEdges =
      devotional.devotion_scripturesCollection.edges.filter(
        (edge) =>
          edge.node.scriptures.is_psalm === isPsalm &&
          String(edge.node.scriptures.id) === String(scriptureId)
      );

    return scriptureEdges.flatMap((edge) =>
      edge.node.scriptures.notesCollection.edges.map((noteEdge) => ({
        id: noteEdge.node.id,
        content: noteEdge.node.content,
        created_at: noteEdge.node.created_at,
        updated_at: noteEdge.node.updated_at,
        user_id: "",
        reference_type: "scripture" as ReferenceType,
        reference_id: String(scriptureId),
        devotion_id: devotional.id,
        scripture_id: Number(scriptureId),
        reading_id: null,
      }))
    );
  };

  const getReadingNotes = (readingId: string | number) => {
    const readingEdges = devotional.readingsCollection.edges.filter(
      (edge) => String(edge.node.id) === String(readingId)
    );
    return readingEdges.flatMap((edge) =>
      edge.node.notesCollection.edges.map((noteEdge) => ({
        id: noteEdge.node.id,
        content: noteEdge.node.content,
        created_at: noteEdge.node.created_at,
        updated_at: noteEdge.node.updated_at,
        user_id: "",
        reference_type: "reading" as ReferenceType,
        reference_id: String(readingId),
        devotion_id: devotional.id,
        scripture_id: null,
        reading_id: Number(readingId),
      }))
    );
  };

  return (
    <Paper
      shadow={isMobile ? undefined : "sm"}
      p={{ base: "md", sm: "lg", xl: "xl" }}
      radius="md"
      withBorder={!isMobile}
    >
      <Stack gap="xl">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={3} c="coverBlue" lh={1.2}>
              {devotional.title}
            </Title>
            <Group align="flex-start" gap="xs" wrap="nowrap">
              <FavoriteButton
                user={user}
                devotionalId={devotional.id}
                initialFavorited={
                  devotional.favoritesCollection.edges.length > 0
                }
                size="sm"
              />
              <ShareButton onClick={handleShare} size="sm" />
              <PrintButton onClick={handlePrint} size="sm" />
              <NotesButton
                user={user}
                referenceType="devotion"
                referenceId={String(devotional.id)}
                initialNotes={devotional.notesCollection.edges.map((edge) => ({
                  id: edge.node.id,
                  content: edge.node.content,
                  created_at: edge.node.created_at,
                  updated_at: edge.node.updated_at,
                  user_id: "",
                  reference_type: "devotion" as ReferenceType,
                  reference_id: String(devotional.id),
                  devotion_id: devotional.id,
                  scripture_id: null,
                  reading_id: null,
                }))}
                size="sm"
              />
            </Group>
          </Group>
          <Text size="md" c="dimmed" fs="italic">
            Week {devotional.week}
          </Text>
        </Stack>
        <Divider />
        {devotional.opening_prayer && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="xl"
              >
                <IconBook style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                Opening Prayer
              </Title>
            </Group>
            <Text lh={1.6}>{devotional.opening_prayer}</Text>
            {devotional.opening_prayer_source && (
              <Text size="sm" c="dimmed" fs="italic" mt="xs">
                — {devotional.opening_prayer_source}
              </Text>
            )}
          </Stack>
        )}
        {devotional.opening_prayer && <Divider my="sm" />}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => edge.node.scriptures.is_psalm
        ) && (
          <Stack gap="md">
            <Group
              justify="space-between"
              align="stretch"
              wrap="nowrap"
              gap="sm"
            >
              <Group gap="sm" mb="xs">
                <ThemeIcon
                  size="lg"
                  variant="light"
                  color="coverBlue"
                  radius="xl"
                >
                  <IconBible style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
                <Title order={4} c="coverBlue">
                  Psalm for the Week
                </Title>
              </Group>
              <NotesButton
                user={user}
                referenceType="scripture"
                referenceId={String(
                  devotional.devotion_scripturesCollection.edges.find(
                    (edge) => edge.node.scriptures.is_psalm
                  )?.node.scriptures.id
                )}
                initialNotes={getScriptureNotes(
                  String(
                    devotional.devotion_scripturesCollection.edges.find(
                      (edge) => edge.node.scriptures.is_psalm
                    )?.node.scriptures.id || ""
                  ),
                  true
                )}
                size="sm"
              />
            </Group>
            <Group
              justify="space-between"
              align="stretch"
              wrap="nowrap"
              gap="sm"
            >
              <Box className="scripture-container" lh={1.6}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      devotional.devotion_scripturesCollection.edges.find(
                        (edge) => edge.node.scriptures.is_psalm
                      )?.node.scriptures.text ||
                      "<p>Psalm text not available.</p>",
                  }}
                />
              </Box>
            </Group>
          </Stack>
        )}
        <Divider my="sm" />
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => !edge.node.scriptures.is_psalm
        ) && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="xl"
              >
                <IconBook style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                Scripture Reading
              </Title>
            </Group>
            <ScriptureAccordion
              scriptures={devotional.devotion_scripturesCollection.edges
                .filter((edge) => !edge.node.scriptures.is_psalm)
                .map((edge) => ({
                  id: edge.node.scriptures.id,
                  reference: edge.node.scriptures.reference,
                  text: edge.node.scriptures.text,
                  is_psalm: edge.node.scriptures.is_psalm,
                  notesCollection: edge.node.scriptures.notesCollection,
                  day_of_week: edge.node.day_of_week,
                }))}
              notes={devotional.devotion_scripturesCollection.edges
                .filter((edge) => !edge.node.scriptures.is_psalm)
                .flatMap((edge) =>
                  getScriptureNotes(edge.node.scriptures.id, false)
                )}
              user={user}
            />
          </Stack>
        )}
        <Divider my="sm" />
        {devotional?.readingsCollection?.edges &&
          devotional.readingsCollection.edges.length > 0 && (
            <ReadingNavigator
              readings={devotional.readingsCollection.edges}
              user={user}
            />
          )}
        <Divider my="sm" />
        {devotional.closing_prayer && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="xl"
              >
                <IconBook style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                Closing Prayer
              </Title>
            </Group>
            <Text lh={1.6}>{devotional.closing_prayer}</Text>
            {devotional.closing_prayer_source && (
              <Text size="sm" c="dimmed" fs="italic" mt="xs">
                — {devotional.closing_prayer_source}
              </Text>
            )}
          </Stack>
        )}
        {devotional.closing_prayer && devotional.song_title && (
          <Divider my="sm" />
        )}
        {devotional.song_title && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="xl"
              >
                <IconMusic style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                Suggested Song
              </Title>
            </Group>
            <Text lh={1.6}>{devotional.song_title}</Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
