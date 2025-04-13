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
  Chip, // Use Chip instead of Checkbox
  Divider,
  Loader,
  Highlight,
  Box,
  Alert,
  ActionIcon,
  Center, // For centering states
  Skeleton, // For loading state
  CloseButton, // For clearing input
  useMantineTheme,
  Button, // To access theme colors/spacing
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IconSearch,
  IconAlertCircle,
  IconChevronRight,
  IconMoodSad, // Icon for no results
  IconInfoCircle, // Icon for initial state
  IconPray, // Example icons for snippets
  IconBook,
  IconBible,
} from "@tabler/icons-react";
import { searchDevotionals } from "@/data-access/graphql/search";
import { useRouter } from "next/navigation";
import { Devotional } from "@/types/devotional";

type DevotionalSearchResult = Devotional;
type FilterKeys = "title" | "prayers" | "readings" | "scripture";

// --- Helper: Strip HTML --- (Keep this utility, maybe move outside component if used elsewhere)
const stripHtml = (html: string | undefined | null): string => {
  if (!html) return "";
  // Basic regex fallback for server or if DOM fails
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// --- Result Snippet Component --- (Refactored for clarity)
interface SnippetProps {
  label: string;
  text: string | null | undefined;
  query: string;
  isHtml?: boolean;
  icon?: React.ReactNode; // Optional icon
}

function ResultSnippet({
  label,
  text,
  query,
  isHtml = false,
  icon,
}: SnippetProps) {
  if (!text || !query.trim()) return null;

  const cleanedText = isHtml ? stripHtml(text) : text;
  const textLower = cleanedText.toLowerCase();
  const queryLower = query.toLowerCase();

  if (!textLower.includes(queryLower)) {
    return null; // Don't render if query isn't in the cleaned text
  }

  return (
    <Group gap="xs" wrap="nowrap" align="flex-start">
      {icon && <Box pt={4}>{icon}</Box>}
      <Text size="xs" lineClamp={2}>
        <Text span fw={600} c="dimmed.9">
          {label}:{" "}
        </Text>
        <Highlight highlight={query} component="span">
          {cleanedText}
        </Highlight>
      </Text>
    </Group>
  );
}

// --- Search Result Item Component --- (Refactored Card)
interface SearchResultItemProps {
  result: DevotionalSearchResult;
  query: string;
  filters: Record<FilterKeys, boolean>;
  onView: (slug: string) => void; // Callback for navigation
}

function SearchResultItem({
  result,
  query,
  filters,
  onView,
}: SearchResultItemProps) {
  const theme = useMantineTheme();

  // Extract data (simplified)
  const psalm = result.devotion_scripturesCollection?.edges?.find(
    (e) => e.node.scriptures.is_psalm
  )?.node.scriptures;
  const scriptures =
    result.devotion_scripturesCollection?.edges
      ?.filter((e) => !e.node.scriptures.is_psalm)
      ?.map((e) => e.node.scriptures) || [];
  const readings = result.readingsCollection?.edges?.map((e) => e.node) || [];

  return (
    <Paper shadow="xs" p="sm" withBorder radius="md">
      <Stack gap="sm">
        {/* Header: Title & View Button */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={500} size="md" truncate="end">
              {" "}
              {/* Use truncate */}
              <Highlight highlight={query}>
                {result.title || "Untitled Devotional"}
              </Highlight>
            </Text>
          </Box>
          <Button
            variant="light"
            color="blue"
            size="xs"
            radius="xl"
            onClick={() => onView(result.slug)}
            aria-label={`View devotional: ${result.title}`}
            rightSection={<IconChevronRight size={14} />}
          >
            View
          </Button>
        </Group>

        {/* Snippets Area */}
        <Stack gap="xs">
          {/* Prayers */}
          {filters.prayers && (
            <>
              <ResultSnippet
                label="Opening Prayer"
                text={result.opening_prayer}
                query={query}
                icon={<IconPray size={16} color={theme.colors.gray[6]} />}
              />
              <ResultSnippet
                label="Closing Prayer"
                text={result.closing_prayer}
                query={query}
                icon={<IconPray size={16} color={theme.colors.gray[6]} />}
              />
            </>
          )}
          {/* Scripture */}
          {filters.scripture && (
            <>
              {psalm && (
                <ResultSnippet
                  label={psalm.reference || "Psalm"}
                  text={psalm.text}
                  query={query}
                  isHtml
                  icon={<IconBible size={16} color={theme.colors.gray[6]} />}
                />
              )}
              {scriptures.map((s) => (
                <ResultSnippet
                  key={s.id}
                  label={s.reference || "Scripture"}
                  text={s.text}
                  query={query}
                  isHtml
                  icon={<IconBible size={16} color={theme.colors.gray[6]} />}
                />
              ))}
            </>
          )}
          {/* Readings */}
          {filters.readings &&
            readings.map((r) => (
              <ResultSnippet
                key={r.id}
                label={r.title || r.source || "Reading"}
                text={r.text}
                query={query}
                isHtml
                icon={<IconBook size={16} color={theme.colors.gray[6]} />}
              />
            ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

// --- SearchSidebar Component ---
interface SearchSidebarProps {
  rightOpened: boolean;
  toggleRight: () => void;
}

export function SearchSidebar({
  rightOpened,
  toggleRight,
}: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500); // Slightly faster debounce
  const [searchResults, setSearchResults] = useState<DevotionalSearchResult[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<FilterKeys, boolean>>({
    title: true,
    prayers: true,
    readings: true,
    scripture: true,
  });
  const router = useRouter();
  const theme = useMantineTheme();

  const handleFilterChange = useCallback((field: FilterKeys) => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleViewClick = useCallback(
    (slug: string) => {
      router.push(`/devotions/${slug}`);
      // Optionally close the sidebar on navigation
      // if (rightOpened) {
      //   toggleRight();
      // }
    },
    [router]
  ); // Add dependencies if toggleRight/rightOpened are used

  const performSearch = useCallback(async () => {
    const query = debouncedSearchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const isAnyFilterActive = Object.values(filters).some((active) => active);
    if (!isAnyFilterActive) {
      setSearchResults([]);
      setIsSearching(false);
      // Don't set an error, just show a specific message
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // *** Assumption: searchDevotionals API filters based on the 'filters' object ***
      // *** and only returns devotionals where query matches AT LEAST ONE active filter field ***
      const results = await searchDevotionals(query, filters);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching devotionals:", error);
      setSearchResults([]);
      setSearchError("Failed to fetch search results. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, filters]); // Removed performSearch from its own deps

  useEffect(() => {
    performSearch();
  }, [debouncedSearchQuery, filters, performSearch]); // Include performSearch if its definition might change (though unlikely here)

  // --- RENDER STATES ---
  const renderResultsContent = () => {
    const query = debouncedSearchQuery.trim();
    const isAnyFilterActive = Object.values(filters).some((f) => f);

    if (isSearching) {
      // Option 1: Centered Loader
      return (
        <Center h={200}>
          <Loader />
        </Center>
      );
      // Option 2: Skeleton Loaders (more UX work but better feel)
      // return (
      //   <Stack gap="md">
      //     <Skeleton height={80} radius="md" />
      //     <Skeleton height={80} radius="md" />
      //     <Skeleton height={80} radius="md" />
      //   </Stack>
      // );
    }

    if (searchError) {
      return (
        <Center h={200} px="md">
          <Alert
            icon={<IconAlertCircle size={22} />}
            title="Search Error"
            color="red"
            variant="light"
            radius="md"
          >
            {searchError}
          </Alert>
        </Center>
      );
    }

    if (!query) {
      return (
        <Center h={200}>
          <Stack align="center" gap="xs" c="dimmed">
            <IconSearch size={40} stroke={1.5} />
            <Text size="sm">Enter a term above to search devotionals.</Text>
          </Stack>
        </Center>
      );
    }

    if (!isAnyFilterActive) {
      return (
        <Center h={200}>
          <Stack align="center" gap="xs" c="dimmed">
            <IconInfoCircle size={40} stroke={1.5} />
            <Text size="sm">
              Please select at least one category to search within.
            </Text>
          </Stack>
        </Center>
      );
    }

    if (searchResults.length > 0) {
      return searchResults.map((result) => (
        <SearchResultItem
          key={result.id}
          result={result}
          query={query}
          filters={filters}
          onView={handleViewClick}
        />
      ));
    }

    // No results found state
    return (
      <Center h={200}>
        <Stack align="center" gap="xs" c="dimmed">
          <IconMoodSad size={40} stroke={1.5} />
          <Text size="sm">No results found for "{query}".</Text>
          <Text size="xs">Try broadening your search or checking filters.</Text>
        </Stack>
      </Center>
    );
  };

  // --- Component JSX ---
  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top section - Search Input and Filters */}
      <Stack gap="md" p="md">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Title order={4}>Search Devotionals</Title>
          <ActionIcon
            variant="subtle" // Consider "light" or "filled" for more visibility
            color="gray"
            size="lg" // Slightly larger for easier click target
            onClick={toggleRight}
            aria-label={
              rightOpened ? "Close search sidebar" : "Open search sidebar"
            }
          >
            {/* Using IconX when opened might be clearer */}
            <IconChevronRight
              size={20}
              style={{
                transform: rightOpened ? "rotate(180deg)" : "rotate(0deg)", // Adjust rotation if needed
                transition: "transform 200ms ease",
              }}
            />
          </ActionIcon>
        </Group>

        {/* Search Input */}
        <TextInput
          placeholder="Enter search term..."
          leftSection={<IconSearch size={18} stroke={1.5} />}
          rightSection={
            searchQuery ? (
              <CloseButton
                size="sm"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search input"
              />
            ) : null
          }
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          aria-label="Search Devotionals Input"
          disabled={isSearching} // Keep input disabled during search
          radius="md"
        />

        {/* Filters */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Search within:
          </Text>
          {/* Use Chip.Group for potentially single selection, or just individual Chips */}
          <Group gap="xs">
            <Chip
              checked={filters.title}
              onChange={() => handleFilterChange("title")}
              size="xs"
              radius="sm"
              disabled={isSearching}
            >
              Title
            </Chip>
            <Chip
              checked={filters.prayers}
              onChange={() => handleFilterChange("prayers")}
              size="xs"
              radius="sm"
              disabled={isSearching}
            >
              Prayers
            </Chip>
            <Chip
              checked={filters.readings}
              onChange={() => handleFilterChange("readings")}
              size="xs"
              radius="sm"
              disabled={isSearching}
            >
              Readings
            </Chip>
            <Chip
              checked={filters.scripture}
              onChange={() => handleFilterChange("scripture")}
              size="xs"
              radius="sm"
              disabled={isSearching}
            >
              Scripture
            </Chip>
          </Group>
        </Stack>
      </Stack>

      <Divider />

      {/* Scrollable Results Area */}
      <ScrollArea style={{ flexGrow: 1 }} type="auto" offsetScrollbars>
        {/* Add padding within the ScrollArea content */}
        <Stack gap="md" p="md">
          {renderResultsContent()}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
