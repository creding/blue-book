"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TextInput,
  Title,
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  ScrollArea,
  Checkbox,
  Divider,
  Loader,
  Highlight,
  Box,
  Alert,
  ActionIcon,
} from "@mantine/core";
import {
  IconSearch,
  IconAlertCircle,
  IconChevronRight,
} from "@tabler/icons-react";
import { searchDevotionals } from "@/data-access/graphql/search";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { Devotional } from "@/types/devotional";

// Use the Devotional type directly
type DevotionalSearchResult = Devotional;

// --- SearchSidebar Component ---

interface SearchSidebarProps {
  rightOpened: boolean;
  toggleRight: () => void;
}

export function SearchSidebar({
  rightOpened,
  toggleRight,
}: SearchSidebarProps) {
  // --- State Variables ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 600);
  const [searchResults, setSearchResults] = useState<DevotionalSearchResult[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    title: true,
    prayers: true,
    readings: true,
    scripture: true,
  });
  const router = useRouter();

  // --- Helper: Strip HTML Tags ---
  const stripHtml = (html: string | undefined | null): string => {
    if (!html) return "";
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
      } catch (e) {
        console.error("Error stripping HTML with DOM:", e);
        return html
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
    } else {
      return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  };

  // --- Callbacks ---
  const handleFilterChange = useCallback((field: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const performSearch = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const isAnyFilterActive = Object.values(filters).some((active) => active);
    if (!isAnyFilterActive) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError("Please select at least one filter category.");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchDevotionals(debouncedSearchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching devotionals:", error);
      setSearchResults([]);
      setSearchError("Failed to fetch search results. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, filters]);

  // --- Effects ---
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // --- Helper Functions ---

  // Render text with highlighting (always renders as a span)
  const renderHighlight = (text: string | undefined | null) => {
    if (!text || !debouncedSearchQuery.trim()) return text;
    return (
      <Highlight highlight={debouncedSearchQuery} component="span">
        {text}
      </Highlight>
    );
  };

  // Check if text contains the query (strips HTML if needed)
  const checkMatch = useCallback(
    (text: string | undefined | null, isHtml: boolean = false): boolean => {
      if (!text || !debouncedSearchQuery.trim()) return false;
      const textToSearch = isHtml ? stripHtml(text) : text; // Strip if HTML flag is true
      return textToSearch
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
    },
    [debouncedSearchQuery]
  );

  // --- RENDER SEARCH RESULT ITEM ---
  const renderSingleResult = (result: DevotionalSearchResult) => {
    // Extract psalm and scriptures from devotion_scripturesCollection
    const psalm = result.devotion_scripturesCollection?.edges?.find(
      (e) => e.node.scriptures.is_psalm
    )?.node.scriptures;
    const scriptures =
      result.devotion_scripturesCollection?.edges
        ?.filter((e) => !e.node.scriptures.is_psalm)
        ?.map((e) => ({
          id: e.node.scriptures.id,
          reference: e.node.scriptures.reference,
          text: e.node.scriptures.text,
          day: e.node.day_of_week,
        })) || [];

    // Extract readings from readingsCollection
    const readings =
      result.readingsCollection?.edges?.map((e) => ({
        id: e.node.id,
        text: e.node.text,
        source: e.node.source,
        title: e.node.title,
      })) || [];

    // Skip this result if no part of it matched the search query
    const titleMatches = filters.title && checkMatch(result.title);
    const prayerMatches =
      filters.prayers &&
      (checkMatch(result.opening_prayer) || checkMatch(result.closing_prayer));
    const scriptureMatches =
      filters.scripture &&
      (psalm
        ? checkMatch(psalm.text, true) || checkMatch(psalm.reference)
        : false ||
          scriptures.some(
            (s) => checkMatch(s.text, true) || checkMatch(s.reference)
          ));
    const readingMatches =
      filters.readings &&
      readings.some(
        (r) =>
          checkMatch(r.text, true) ||
          checkMatch(r.title) ||
          checkMatch(r.source)
      );

    if (
      !titleMatches &&
      !prayerMatches &&
      !scriptureMatches &&
      !readingMatches
    ) {
      return null;
    }

    return (
      <Paper key={result.id} shadow="xs" p="md" withBorder component="article">
        <Stack gap="xs">
          {/* Title & Link */}
          <Group justify="space-between" align="flex-start">
            <Box style={{ flex: 1 }}>
              {titleMatches ? (
                <Text fw={500} size="lg" style={{ wordBreak: "break-word" }}>
                  {renderHighlight(result.title)}
                </Text>
              ) : (
                <Text fw={500} size="lg" style={{ wordBreak: "break-word" }}>
                  {result.title}
                </Text>
              )}
            </Box>
            <Badge
              component="a"
              href={`/devotions/${result.slug}`}
              variant="light"
              color="blue"
              style={{ cursor: "pointer", textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/devotions/${result.slug}`);
              }}
            >
              View
            </Badge>
          </Group>

          {/* Prayers */}
          {filters.prayers && (
            <Box>
              {checkMatch(result.opening_prayer) && (
                <Text size="sm" lineClamp={2}>
                  <Text span fw={800} c="dimmed.9">
                    Opening Prayer:{" "}
                  </Text>
                  <Text span size="xs">
                    {renderHighlight(result.opening_prayer)}
                  </Text>
                </Text>
              )}
              {checkMatch(result.closing_prayer) && (
                <Text size="sm" lineClamp={2}>
                  <Text span fw={800} c="dimmed.9">
                    Closing Prayer:{" "}
                  </Text>
                  <Text span size="xs">
                    {renderHighlight(result.closing_prayer)}
                  </Text>
                </Text>
              )}
            </Box>
          )}

          {/* Psalm and Scriptures */}
          {filters.scripture && (
            <Box>
              {/* Psalm matches */}
              {psalm && checkMatch(psalm.text, true) && (
                <Text component="div" size="sm" lineClamp={2}>
                  <Text span fw={800} c="dimmed.9">
                    {psalm.reference}{" "}
                  </Text>
                  <Text span size="xs">
                    {renderHighlight(stripHtml(psalm.text))}
                  </Text>
                </Text>
              )}
              {psalm &&
                !checkMatch(psalm.text, true) &&
                checkMatch(psalm.reference) && (
                  <Text size="sm" lineClamp={1}>
                    <Text span fw={800} c="dimmed.9">
                      {renderHighlight(psalm.reference)}
                    </Text>
                  </Text>
                )}

              {/* Scripture matches */}
              {scriptures.map((scripture, idx) =>
                checkMatch(scripture.text, true) ? (
                  <Text
                    key={`scripture-${idx}`}
                    component="div"
                    size="sm"
                    lineClamp={2}
                  >
                    <Text span fw={800} c="dimmed.9">
                      {scripture.reference}:{" "}
                    </Text>
                    <Text span size="xs">
                      {renderHighlight(stripHtml(scripture.text))}
                    </Text>
                  </Text>
                ) : null
              )}
              {!scriptures.some((s) => checkMatch(s.text, true)) &&
                scriptures.map((scripture, idx) =>
                  checkMatch(scripture.reference) ? (
                    <Text key={`scr-ref-${idx}`} size="sm" lineClamp={1}>
                      <Text span fw={800} c="dimmed.9">
                        {renderHighlight(scripture.reference)}
                      </Text>
                    </Text>
                  ) : null
                )}
            </Box>
          )}

          {/* Readings */}
          {filters.readings && (
            <Box>
              {readings.map((reading, idx) => {
                const textMatches = checkMatch(reading.text, true);
                const sourceMatches = checkMatch(reading.source);
                const titleMatches = checkMatch(reading.title);

                if (textMatches || sourceMatches || titleMatches) {
                  return (
                    <Text
                      key={`reading-${idx}`}
                      component="div"
                      size="sm"
                      lineClamp={2}
                    >
                      {(reading.title || titleMatches) && (
                        <Text span fw={800} c="dimmed.9">
                          {titleMatches
                            ? renderHighlight(reading.title || "")
                            : reading.title}
                          :{" "}
                        </Text>
                      )}
                      {textMatches && (
                        <Text span size="xs">
                          {renderHighlight(stripHtml(reading.text))}
                        </Text>
                      )}
                      {sourceMatches && (
                        <Text span size="xs" c="dimmed.7">
                          {textMatches ? " - " : ""}
                          {renderHighlight(reading.source || "")}
                        </Text>
                      )}
                    </Text>
                  );
                }
                return null;
              })}
            </Box>
          )}
        </Stack>
      </Paper>
    );
  };

  const renderResultsContent = () => {
    // ... (Loading, Error, No Query states logic remains the same) ...
    if (isSearching) {
      return (
        <Group justify="center" p="md">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            Searching...
          </Text>
        </Group>
      );
    }
    if (searchError) {
      return (
        <Alert
          icon={<IconAlertCircle size={22} />}
          title="Error"
          color="red"
          variant="light"
          m="md"
        >
          {searchError}
        </Alert>
      );
    }
    if (!debouncedSearchQuery.trim()) {
      return (
        <Text c="dimmed" ta="center" p="md">
          Enter a search term above.
        </Text>
      );
    }
    if (!Object.values(filters).some((active) => active)) {
      return (
        <Text c="dimmed" ta="center" p="md">
          Please select at least one filter category.
        </Text>
      );
    }

    const displayedResults = searchResults
      .map(renderSingleResult)
      .filter(Boolean);

    if (displayedResults.length > 0) {
      return displayedResults;
    }

    return (
      <Text c="dimmed" ta="center" p="md">
        No matching text found for "{debouncedSearchQuery}".
      </Text>
    );
  };

  // --- Component JSX ---
  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top section */}
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center">
          <Title order={4}>Search</Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={toggleRight}
            aria-label="Toggle search sidebar"
          >
            <IconChevronRight
              style={{
                transform: rightOpened ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 200ms ease",
              }}
            />
          </ActionIcon>
        </Group>
        <TextInput
          placeholder="Enter search term..."
          leftSection={<IconSearch size={22} stroke={1.5} />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          aria-label="Search Devotionals Input"
          disabled={isSearching}
        />
        {/* Filters */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Search within:
          </Text>
          <Group gap="sm">
            <Checkbox
              label="Title"
              checked={filters.title}
              onChange={() => handleFilterChange("title")}
              size="xs"
              disabled={isSearching}
            />
            <Checkbox
              label="Prayers"
              checked={filters.prayers}
              onChange={() => handleFilterChange("prayers")}
              size="xs"
              disabled={isSearching}
            />
            <Checkbox
              label="Readings"
              checked={filters.readings}
              onChange={() => handleFilterChange("readings")}
              size="xs"
              disabled={isSearching}
            />
            <Checkbox
              label="Scripture"
              checked={filters.scripture}
              onChange={() => handleFilterChange("scripture")}
              size="xs"
              disabled={isSearching}
            />
          </Group>
        </Stack>
      </Stack>

      <Divider />

      {/* Scrollable Results Area */}
      <ScrollArea style={{ flexGrow: 1 }} type="auto" offsetScrollbars p="md">
        <Stack gap="md">{renderResultsContent()}</Stack>
      </ScrollArea>
    </Box>
  );
}
