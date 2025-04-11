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
import { searchDevotionals } from "@/data-access/devotion";
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
    // ... (search logic remains the same) ...
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
    return (
      <Paper
        key={`search-result-${result.id}`}
        p="md"
        withBorder
        style={{ cursor: "pointer" }}
        onClick={() => router.push(`/devotional/${result.id}`)}
        radius="md"
        className="search-result-hover"
      >
        <Stack gap="xs">
          {/* 1. Title */}
          <Text fw={600} size="lg" lineClamp={2}>
            {renderHighlight(result.title)}
          </Text>

          {/* 2. Badges */}
          <Group gap="xs">
            <Badge size="sm" variant="light" color="gray">
              Week {result.devotion_id}
            </Badge>
            {result.opening_prayer && (
              <Badge size="sm" variant="outline" color="blue">
                Prayer
              </Badge>
            )}
            {result.readings && result.readings.length > 0 && (
              <Badge size="sm" variant="outline" color="green">
                Reading
              </Badge>
            )}
            {(result.psalm ||
              (result.scriptures && result.scriptures.length > 0)) && (
              <Badge size="sm" variant="outline" color="violet">
                Scripture
              </Badge>
            )}
          </Group>

          {/* --- 3. Conditional Snippets --- */}
          <Box mt="xs">
            <Stack gap="xs">
              {/* Prayers (Plain Text) */}
              {filters.prayers && checkMatch(result.opening_prayer) && (
                <Text component="div" size="sm" lineClamp={2}>
                  <Text span fw={800} c="dimmed.9">
                    Opening Prayer:{" "}
                  </Text>
                  <Text span size="xs">
                    {renderHighlight(result.opening_prayer)}
                  </Text>
                </Text>
              )}
              {filters.prayers && checkMatch(result.closing_prayer) && (
                <Text component="div" size="sm" lineClamp={2}>
                  {!checkMatch(result.opening_prayer) && (
                    <Text span fw={800} c="dimmed.9">
                      Closing Prayer:{" "}
                    </Text>
                  )}
                  <Text span size="xs">
                    {renderHighlight(result.closing_prayer)}
                  </Text>
                </Text>
              )}

              {/* Psalm (Handles HTML Text) */}
              {filters.scripture && checkMatch(result.psalm?.text, true) && (
                <Text component="div" size="sm" lineClamp={2}>
                  <Text span fw={800} c="dimmed.9">
                    {result.psalm?.reference}{" "}
                  </Text>
                  <Text span size="xs">
                    {renderHighlight(stripHtml(result.psalm?.text))}
                  </Text>
                </Text>
              )}
              {filters.scripture &&
                !checkMatch(result.psalm?.text, true) &&
                checkMatch(result.psalm?.reference) && (
                  <Text size="sm" lineClamp={1}>
                    <Text span fw={800} c="dimmed.9">
                      {result.psalm?.reference}:{" "}
                    </Text>
                  </Text>
                )}

              {/* Scriptures (Handles HTML Text) */}
              {filters.scripture &&
                result.scriptures?.map((scripture, idx) =>
                  checkMatch(scripture.text, true) ? (
                    <Text key={`scripture-${idx}`} component="span" size="sm" lineClamp={2}>
                      <Text span fw={800} c="dimmed.9">
                        {scripture.reference}:{" "}
                      </Text>
                      <Text span size="xs">
                        {renderHighlight(stripHtml(scripture.text))}
                      </Text>
                    </Text>
                  ) : null
                )}
              {filters.scripture &&
                !result.scriptures?.some((s) => checkMatch(s.text, true)) &&
                result.scriptures?.map((scripture, idx) =>
                  checkMatch(scripture.reference) ? (
                    <Text key={`scr-ref-${idx}`} size="sm" lineClamp={1}>
                      {!(
                        !checkMatch(result.psalm?.text, true) &&
                        checkMatch(result.psalm?.reference)
                      ) && (
                        <Text span fw={500} c="dimmed.9">
                          Scripture:{" "}
                        </Text>
                      )}
                      {renderHighlight(scripture.reference)}
                    </Text>
                  ) : null
                )}

              {/* Readings (Handles HTML Text, uses Source as identifier) */}
              {filters.readings &&
                result.readings?.map((reading, idx) => {
                  // Removed check for reading.title
                  const sourceMatch = checkMatch(reading.source);
                  const textMatch = checkMatch(reading.text, true); // Check stripped text

                  // Render snippet if source or the *stripped text* matches
                  if (sourceMatch || textMatch) {
                    const strippedText = stripHtml(reading.text); // Strip for display

                    return (
                      <Box key={`read-${idx}`}>
                        {/* Show Source info - Highlight if it matched */}
                        {reading.source && ( // Check if source exists
                          <Text size="sm" lineClamp={1}>
                            {/* Use source in the label */}
                            <Text span fw={800} c="dimmed.9">
                              {renderHighlight(reading.source)}:{" "}
                            </Text>
                          </Text>
                        )}

                        {/* Show stripped text if it exists AND (source matched OR text matched) */}
                        {strippedText && (sourceMatch || textMatch) && (
                          <Text
                            key={`reading-text-${idx}`}
                            size="xs"
                            lineClamp={2}
                            c="dimmed.2"
                            // Add margin only if source label was also displayed above
                            mt={reading.source ? "xxs" : 0}
                          >
                            {/* Apply highlighting to the plain, stripped text */}
                            {renderHighlight(strippedText)}
                          </Text>
                        )}
                      </Box>
                    );
                  }
                  return null; // Don't render this reading if no part of it matched
                })}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    );
  };

  // --- Determine overall content for the results area ---
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
