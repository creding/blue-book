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
import { Devotion } from "@/types/graphql";
import { ReferenceType } from "@/types/note";
import { ScriptureAccordion } from "../ui/scripture-accordion";
import { User } from "@supabase/supabase-js";

export interface DevotionalDisplayProps {
  devotional: Devotion | null;
  user: User | null;
}

export function DevotionalDisplay({
  devotional,
  user,
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
  console.log("favorites", devotional.favoritesCollection.edges);
  // --- Main Devotional Display ---
  return (
    // Use theme's Paper default shadow and radius
    <Paper p="lg" className="devotional-content">
      <Group justify="space-between" align="flex-start" mb="md">
        <Title order={2}>{devotional.title}</Title>
        <Group gap="xs" align="flex-start">
          <FavoriteButton
            devotionalId={devotional.id}
            initialFavorited={devotional.favoritesCollection.edges.length > 0}
            size="sm"
            user={user}
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
        {devotional.opening_prayer &&
          devotional.devotion_scripturesCollection.edges.some(
            (edge) => edge.node.scriptures.is_psalm
          ) && <Divider />}
        {/* Psalm */}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => edge.node.scriptures.is_psalm
        ) && (
          <Stack gap="sm">
            <Group justify="space-between" align="center" mb={4}>
              <Group gap="sm">
                <IconBook size={22} color={theme.colors.gray[7]} />
                <Title order={4}>
                  {devotional.devotion_scripturesCollection.edges.find(
                    (edge) => edge.node.scriptures.is_psalm
                  )?.node.scriptures.reference || "Psalm"}
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
                initialNotes={devotional.devotion_scripturesCollection.edges
                  .filter((edge) => edge.node.scriptures.is_psalm)
                  .flatMap((edge) =>
                    edge.node.scriptures.notesCollection.edges.map(
                      (noteEdge) => ({
                        id: noteEdge.node.id,
                        content: noteEdge.node.content,
                        created_at: noteEdge.node.created_at,
                        updated_at: noteEdge.node.updated_at,
                        user_id: "",
                        reference_type: "scripture" as ReferenceType,
                        reference_id: String(edge.node.scriptures.id),
                        devotion_id: devotional.id,
                        scripture_id: edge.node.scriptures.id,
                        reading_id: null,
                      })
                    )
                  )}
                size="sm"
              />
            </Group>
            <div
              className="scripture-container"
              dangerouslySetInnerHTML={{
                __html:
                  devotional.devotion_scripturesCollection.edges.find(
                    (edge) => edge.node.scriptures.is_psalm
                  )?.node.scriptures.text || "",
              }}
            />
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => edge.node.scriptures.is_psalm
        ) &&
          devotional.devotion_scripturesCollection.edges.some(
            (edge) => !edge.node.scriptures.is_psalm
          ) && <Divider />}
        {/* Daily Scriptures */}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => !edge.node.scriptures.is_psalm
        ) && (
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
                edge.node.scriptures.notesCollection.edges.map((noteEdge) => ({
                  id: noteEdge.node.id,
                  content: noteEdge.node.content,
                  created_at: noteEdge.node.created_at,
                  updated_at: noteEdge.node.updated_at,
                  user_id: "",
                  reference_type: "scripture" as ReferenceType,
                  reference_id: String(edge.node.scriptures.id),
                  devotion_id: devotional.id,
                  scripture_id: edge.node.scriptures.id,
                  reading_id: null,
                }))
              )}
          />
        )}

        {/* Readings / Reflection */}
        {devotional.readingsCollection.edges.length > 0 && (
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
              {devotional.readingsCollection.edges.map(
                ({ node: reading }, index) => {
                  const cite = `${reading.source} ${
                    reading.author ? ` - ${reading.author}` : ""
                  }`;
                  return (
                    <div key={reading.id}>
                      <Blockquote cite={cite} p="md" radius="md">
                        <Group
                          justify="space-between"
                          align="stretch"
                          wrap="nowrap"
                        >
                          <div
                            className="reading-container"
                            dangerouslySetInnerHTML={{
                              __html: reading.text || "",
                            }}
                          />
                          <NotesButton
                            user={user}
                            referenceType="reading"
                            referenceId={String(reading.id)}
                            initialNotes={reading.notesCollection.edges.map(
                              (edge) => ({
                                id: edge.node.id,
                                content: edge.node.content,
                                created_at: edge.node.created_at,
                                updated_at: edge.node.updated_at,
                                user_id: "",
                                reference_type: "reading" as ReferenceType,
                                reference_id: String(reading.id),
                                devotion_id: devotional.id,
                                scripture_id: null,
                                reading_id: reading.id,
                              })
                            )}
                            size="sm"
                          />
                        </Group>
                      </Blockquote>
                    </div>
                  );
                }
              )}
            </Stack>
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.readingsCollection.edges.length > 0 &&
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
