"use client";

import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Divider,
  ThemeIcon,
  Blockquote,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import FavoriteButton from "@/components/ui/buttons/FavoriteButton";
import ShareButton from "@/components/ui/buttons/ShareButton";
import PrintButton from "@/components/ui/buttons/PrintButton";
import { NotesButton } from "@/components/ui/buttons/NotesButton";
import { Devotion } from "@/types/graphql";
import { ReferenceType } from "@/types/note";
import { ScriptureNavigator } from "@/components/pages/devotion/components/ScriptureNavigator";
import { User } from "@supabase/supabase-js";
import { useMediaQuery } from "@mantine/hooks";
import { ReadingNavigator } from "./ReadingNavigator";
import { PsalmDisplay } from "./PsalmDisplay";
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

  const getScriptureNotes = (scriptureId: string | number | undefined) => {
    if (!scriptureId) return [];
    const scriptureEdge = devotional.devotion_scripturesCollection.edges.find(
      (edge) => String(edge.node.scriptures.id) === String(scriptureId)
    );
    return (
      scriptureEdge?.node.scriptures.notesCollection.edges.map((noteEdge) => ({
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
      })) || []
    );
  };

  const notes = devotional.readingsCollection.edges.flatMap((edge) =>
    edge.node.notesCollection.edges.map((noteEdge) => ({
      id: noteEdge.node.id,
      content: noteEdge.node.content,
      created_at: noteEdge.node.created_at,
      updated_at: noteEdge.node.updated_at,
      user_id: "",
      reference_type: "reading" as ReferenceType,
      reference_id: String(edge.node.id),
      devotion_id: devotional.id,
      scripture_id: null,
      reading_id: Number(edge.node.id),
    }))
  );

  const psalmEdge = devotional.devotion_scripturesCollection.edges.find(
    (edge) => edge.node.scriptures.is_psalm
  );
  const psalmScripture = psalmEdge?.node.scriptures;

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
              <Title order={4} c="coverBlue">
                Opening Prayer
              </Title>
            </Group>
            <Blockquote
              cite={devotional.opening_prayer_source}
              styles={{
                root: {
                  padding: "md",
                  border: "1px solid var(--mantine-color-neutralGray-2)",
                  background: "var(--mantine-color-neutralGray-0)",
                },
                cite: {
                  color: "var(--mantine-color-gray-7)",
                  fontSize: "sm",
                  marginTop: "xs",
                },
              }}
              radius="sm"
            >
              <Text className="prayer-container" lh={1.6}>
                {devotional.opening_prayer}
              </Text>
            </Blockquote>
          </Stack>
        )}
        {devotional.opening_prayer && <Divider my="sm" />}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => edge.node.scriptures.is_psalm
        ) &&
          psalmScripture && (
            <PsalmDisplay
              psalm={psalmScripture}
              notes={getScriptureNotes(psalmScripture.id)}
              user={user}
            />
          )}
        <Divider my="sm" />
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => !edge.node.scriptures.is_psalm
        ) && (
          <ScriptureNavigator
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
              .flatMap((edge) => getScriptureNotes(edge.node.scriptures.id))}
            user={user}
          />
        )}
        <Divider my="sm" />
        {devotional?.readingsCollection?.edges &&
          devotional.readingsCollection.edges.length > 0 && (
            <ReadingNavigator
              readings={devotional.readingsCollection.edges.map(
                (edge) => edge.node
              )}
              notes={notes}
              user={user}
            />
          )}
        <Divider my="sm" />
        {devotional.closing_prayer && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
              <Title order={4} c="coverBlue">
                Closing Prayer
              </Title>
            </Group>
            <Blockquote
              cite={devotional.closing_prayer_source}
              styles={{
                root: {
                  padding: "md",
                  border: "1px solid var(--mantine-color-neutralGray-2)",
                  background: "var(--mantine-color-neutralGray-0)",
                },
                cite: {
                  color: "var(--mantine-color-gray-7)",
                  fontSize: "sm",
                  marginTop: "xs",
                },
              }}
              radius="sm"
            >
              <Text className="prayer-container" lh={1.6}>
                {devotional.closing_prayer}
              </Text>
            </Blockquote>
          </Stack>
        )}
        {devotional.closing_prayer && devotional.song_title && (
          <Divider my="sm" />
        )}
        {devotional.song_title && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
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
