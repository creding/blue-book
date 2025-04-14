"use client";

import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Blockquote,
  Divider,
  ThemeIcon, // Import ThemeIcon
  Box, // Import Box for styling Blockquote border
  rem, // Import rem for styling
} from "@mantine/core";
import {
  IconBook,
  IconMessageCircleHeart,
  IconMusic,
  IconAlertCircle,
  IconSalt,
  IconBible, // Added for Psalm section
} from "@tabler/icons-react";
import FavoriteButton from "@/components/ui/buttons/FavoriteButton"; // Assuming path is correct
import ShareButton from "@/components/ui/buttons/ShareButton"; // Assuming path is correct
import PrintButton from "@/components/ui/buttons/PrintButton"; // Assuming path is correct
import { NotesButton } from "@/components/ui/buttons/NotesButton"; // Assuming path is correct
import { Devotion } from "@/types/graphql"; // Assuming path is correct
import { ReferenceType } from "@/types/note"; // Assuming path is correct
import { ScriptureAccordion } from "@/components/ui/scripture-accordion"; // Assuming path is correct
import { User } from "@supabase/supabase-js";

export interface DevotionalDisplayProps {
  devotional: Devotion | null;
  user: User | null;
}

// NOTE: Add styles for these classes in your global CSS or a relevant CSS module
// .scripture-container p, .reading-container p { margin-bottom: 0.5em; }
// .scripture-container sup { font-size: 0.75em; vertical-align: super; }
// etc.

export function DevotionalDisplay({
  devotional,
  user,
}: DevotionalDisplayProps) {
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
      <Paper p="xl" withBorder radius="md">
        {" "}
        {/* Use theme default radius/shadow */}
        <Stack align="center" gap="md">
          <ThemeIcon size={48} color="red" radius="xl">
            {" "}
            {/* Use ThemeIcon */}
            <IconAlertCircle style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={3} ta="center" c="red.8">
            {" "}
            {/* Use theme red */}
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

  // console.log("favorites", devotional.favoritesCollection.edges);

  // Function to get initial notes for scripture (avoids repetition)
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
        user_id: "", // Should ideally come from user object or context
        reference_type: "scripture" as ReferenceType,
        reference_id: String(scriptureId),
        devotion_id: devotional.id,
        scripture_id: Number(scriptureId), // Ensure ID types match
        reading_id: null,
      }))
    );
  };

  // Function to get initial notes for readings (avoids repetition)
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
        user_id: "", // Should ideally come from user object or context
        reference_type: "reading" as ReferenceType,
        reference_id: String(readingId),
        devotion_id: devotional.id,
        scripture_id: null,
        reading_id: Number(readingId), // Ensure ID types match
      }))
    );
  };

  // --- Main Devotional Display ---
  return (
    // Use theme's Paper default shadow and radius, increase padding
    <Paper
      p={{ base: "xs", xl: "xl" }}
      withBorder
      className="devotional-content"
    >
      <Group justify="space-between" align="flex-start" mb="lg">
        {" "}
        {/* Increased bottom margin */}
        {/* Apply primary theme color to main title */}
        <Title order={2} c="coverBlue">
          {devotional.title}
        </Title>
        {/* Keep action buttons grouped */}
        <Group gap="xs" align="flex-start" wrap="nowrap">
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

      {/* Use consistent large gap for main sections */}
      <Stack gap="xl">
        {/* Opening Prayer */}
        {devotional.opening_prayer && (
          <Stack gap="sm">
            <Group gap="sm" mb="xs">
              {" "}
              {/* Consistent icon/title group */}
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="md"
              >
                <IconBook style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                Opening Prayer
              </Title>
            </Group>
            <Text lh={1.6}>{devotional.opening_prayer}</Text>{" "}
            {/* Improved line height */}
            {devotional.opening_prayer_source && (
              <Text size="sm" c="dimmed" fs="italic" mt="xs">
                {" "}
                {/* Adjusted size/margin */}— {devotional.opening_prayer_source}
              </Text>
            )}
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.opening_prayer &&
          devotional.devotion_scripturesCollection.edges.some(
            (edge) => edge.node.scriptures.is_psalm
          ) && <Divider my="sm" />}{" "}
        {/* Added margin */}
        {/* Psalm */}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => edge.node.scriptures.is_psalm
        ) && (
          <Stack gap="sm">
            <Group justify="space-between" align="center" mb="xs">
              <Group gap="sm">
                <ThemeIcon
                  size="lg"
                  variant="light"
                  color="coverBlue"
                  radius="md"
                >
                  <IconBible style={{ width: "70%", height: "70%" }} />{" "}
                  {/* Specific Icon */}
                </ThemeIcon>
                <Title order={4} c="coverBlue">
                  {devotional.devotion_scripturesCollection.edges.find(
                    (edge) => edge.node.scriptures.is_psalm
                  )?.node.scriptures.reference || "Psalm"}
                </Title>
              </Group>
              {/* Notes button specific to this scripture */}
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
            {/* Ensure scripture-container class is styled */}
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
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => edge.node.scriptures.is_psalm
        ) &&
          devotional.devotion_scripturesCollection.edges.some(
            (edge) => !edge.node.scriptures.is_psalm
          ) && <Divider my="sm" />}
        {/* Daily Scriptures */}
        {devotional.devotion_scripturesCollection.edges.some(
          (edge) => !edge.node.scriptures.is_psalm
        ) && (
          <Stack gap="sm">
            {/* Optional Title for this section */}
            {/*
              <Group gap="sm" mb="xs">
                  <ThemeIcon size="lg" variant="light" color="coverBlue" radius="md">
                     <IconBook style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                  <Title order={4} c="coverBlue">Daily Scripture Readings</Title>
              </Group>
              */}
            <ScriptureAccordion
              scriptures={devotional.devotion_scripturesCollection.edges
                .filter((edge) => !edge.node.scriptures.is_psalm)
                .map((edge) => ({
                  // Map to expected structure for ScriptureAccordion
                  id: edge.node.scriptures.id,
                  reference: edge.node.scriptures.reference,
                  text: edge.node.scriptures.text,
                  is_psalm: edge.node.scriptures.is_psalm,
                  notesCollection: edge.node.scriptures.notesCollection, // Pass notes collection if needed by accordion
                  day_of_week: edge.node.day_of_week, // Ensure day_of_week is available if needed
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
        {/* Optional Divider */}
        {devotional.devotion_scripturesCollection.edges.length > 0 &&
          devotional.readingsCollection.edges.length > 0 && <Divider my="sm" />}
        {/* Readings / Reflection */}
        {devotional.readingsCollection.edges.length > 0 && (
          <Stack gap="md">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="md"
              >
                <IconMessageCircleHeart
                  style={{ width: "70%", height: "70%" }}
                />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                For Reflection
              </Title>
            </Group>
            {/* Gap between multiple reading blockquotes */}
            <Stack gap="lg">
              {devotional.readingsCollection.edges.map(
                ({ node: reading }, index) => {
                  const cite = `${reading.source || "Source"} ${
                    // Add fallback
                    reading.author ? ` - ${reading.author}` : ""
                  }`;
                  return (
                    <Blockquote
                      key={reading.id}
                      cite={cite}
                      // Style Blockquote with theme colors
                      styles={{
                        root: {
                          padding: "md",
                          marginLeft: "md", // Indent slightly
                          background: "coverBlue.9", // Subtle background
                        },
                        cite: {
                          color: "gray.7",
                          fontSize: "sm",
                          marginTop: "xs",
                        },
                      }}
                      radius="sm"
                    >
                      {/* Ensure reading-container class is styled */}
                      <Group
                        justify="space-between"
                        align="flex-start"
                        wrap="nowrap"
                        gap="sm"
                      >
                        <Box className="reading-container" lh={1.6}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                reading.text ||
                                "<p>Reading text not available.</p>",
                            }}
                          />
                        </Box>
                        <NotesButton
                          user={user}
                          referenceType="reading"
                          referenceId={String(reading.id)}
                          initialNotes={getReadingNotes(reading.id)}
                          size="sm"
                        />
                      </Group>
                    </Blockquote>
                  );
                }
              )}
            </Stack>
          </Stack>
        )}
        {/* Optional Divider */}
        {devotional.readingsCollection.edges.length > 0 &&
          devotional.closing_prayer && <Divider my="sm" />}
        {/* Closing Prayer */}
        {devotional.closing_prayer && (
          <Stack gap="sm">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="md"
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
        {/* Optional Divider */}
        {devotional.closing_prayer && devotional.song_title && (
          <Divider my="sm" />
        )}
        {/* Song */}
        {devotional.song_title && (
          <Stack gap="sm">
            <Group gap="sm" mb="xs">
              <ThemeIcon
                size="lg"
                variant="light"
                color="coverBlue"
                radius="md"
              >
                <IconMusic style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
              <Title order={4} c="coverBlue">
                Suggested Song
              </Title>
            </Group>
            <Text lh={1.6}>{devotional.song_title}</Text>
            {/* Optionally add artist/source if available */}
            {/* {devotional.song_artist && <Text size="sm" c="dimmed">{devotional.song_artist}</Text>} */}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
