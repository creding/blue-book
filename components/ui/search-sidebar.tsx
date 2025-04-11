"use client";

import { useState } from "react";
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
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { searchDevotionals } from "@/data-access/devotion";
import { useRouter } from "next/navigation";

export function SearchSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    title: true,
    prayers: true,
    readings: true,
    scripture: true,
  });
  const router = useRouter();

  const handleFilterChange = (field: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchDevotionals(query, {
        title: filters.title,
        prayers: filters.prayers,
        readings: filters.readings,
        scripture: filters.scripture,
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const highlightText = (text: string | null | undefined, query: string) => {
    if (!text) return null;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  // Filter results based on selected filters
  const filteredResults = searchResults.filter((result) => {
    if (!searchQuery.trim()) return false;

    const query = searchQuery.toLowerCase();
    return (
      (filters.title && result.title?.toLowerCase().includes(query)) ||
      (filters.prayers &&
        (result.opening_prayer?.toLowerCase().includes(query) ||
          result.closing_prayer?.toLowerCase().includes(query))) ||
      (filters.readings &&
        result.readings?.some(
          (reading: { text?: string; source?: string; title?: string }) =>
            reading.text?.toLowerCase().includes(query) ||
            reading.source?.toLowerCase().includes(query) ||
            reading.title?.toLowerCase().includes(query)
        )) ||
      (filters.scripture &&
        (result.psalm?.reference?.toLowerCase().includes(query) ||
          result.psalm?.text?.toLowerCase().includes(query) ||
          result.scriptures?.some(
            (scripture: { reference?: string; text?: string }) =>
              scripture.reference?.toLowerCase().includes(query) ||
              scripture.text?.toLowerCase().includes(query)
          )))
    );
  });

  return (
    <Stack gap="md" h="100%">
      <Title order={4}>Search</Title>

      <TextInput
        placeholder="Search devotionals..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(event) => handleSearch(event.currentTarget.value)}
      />

      <Group gap="xs">
        <Checkbox
          label="Title"
          checked={filters.title}
          onChange={() => handleFilterChange("title")}
          size="xs"
        />
        <Checkbox
          label="Prayers"
          checked={filters.prayers}
          onChange={() => handleFilterChange("prayers")}
          size="xs"
        />
        <Checkbox
          label="Readings"
          checked={filters.readings}
          onChange={() => handleFilterChange("readings")}
          size="xs"
        />
        <Checkbox
          label="Scripture"
          checked={filters.scripture}
          onChange={() => handleFilterChange("scripture")}
          size="xs"
        />
      </Group>

      <Divider />

      <ScrollArea h="calc(100% - 150px)" type="auto" offsetScrollbars>
        <Stack gap="md">
          {isSearching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Loader size="sm" />
            </div>
          ) : searchQuery.trim() ? (
            filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <Paper
                  key={result.devotion_id}
                  p="md"
                  withBorder
                  style={{ cursor: "pointer" }}
                  className="search-result"
                  onClick={() => router.push(`/${result.id}/monday`)}
                >
                  <Group justify="apart" mb="sm">
                    <Stack gap="xs">
                      <Text fw={600} size="lg">
                        {highlightText(result.title, searchQuery)}
                      </Text>
                      <Group gap="xs">
                        <Badge size="sm" variant="light">
                          Week {result.devotion_id}
                        </Badge>
                        {filters.prayers && result.opening_prayer && (
                          <Badge size="sm" variant="outline" color="blue">
                            Prayer
                          </Badge>
                        )}
                        {filters.readings && result.readings?.length > 0 && (
                          <Badge size="sm" variant="outline" color="green">
                            Reading
                          </Badge>
                        )}
                        {filters.scripture &&
                          (result.psalm || result.scriptures?.length > 0) && (
                            <Badge size="sm" variant="outline" color="violet">
                              Scripture
                            </Badge>
                          )}
                      </Group>
                    </Stack>
                  </Group>

                  <Stack gap="xs">
                    {filters.prayers &&
                      result.opening_prayer &&
                      result.opening_prayer
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) && (
                        <Text size="sm" lineClamp={2} c="dimmed">
                          {highlightText(result.opening_prayer, searchQuery)}
                        </Text>
                      )}

                    {filters.scripture && (
                      <Stack gap="2">
                        {result.psalm?.reference &&
                          result.psalm.reference
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) && (
                            <Text size="sm" lineClamp={2} c="dimmed">
                              Psalm:{" "}
                              {highlightText(
                                result.psalm.reference,
                                searchQuery
                              )}
                            </Text>
                          )}
                        {result.scriptures?.map(
                          (
                            scripture: { reference?: string; text?: string },
                            idx: number
                          ) => {
                            const matchesQuery =
                              scripture.reference
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              scripture.text
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase());

                            return matchesQuery ? (
                              <Text
                                key={idx}
                                size="sm"
                                lineClamp={2}
                                c="dimmed"
                              >
                                {highlightText(
                                  scripture.reference,
                                  searchQuery
                                )}
                              </Text>
                            ) : null;
                          }
                        )}
                      </Stack>
                    )}

                    {filters.readings &&
                      result.readings?.map(
                        (
                          reading: {
                            text?: string;
                            source?: string;
                            title?: string;
                          },
                          idx: number
                        ) => {
                          const matchesQuery =
                            reading.text
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            reading.source
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            reading.title
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase());

                          return matchesQuery ? (
                            <Text key={idx} size="sm" lineClamp={2} c="dimmed">
                              {reading.title && (
                                <Text span fw={500}>
                                  {highlightText(reading.title, searchQuery)} -{" "}
                                </Text>
                              )}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: reading.text || "",
                                }}
                              />
                              {reading.source && (
                                <Text span size="xs" c="dimmed.4">
                                  {" "}
                                  ({highlightText(reading.source, searchQuery)})
                                </Text>
                              )}
                            </Text>
                          ) : null;
                        }
                      )}
                  </Stack>
                </Paper>
              ))
            ) : (
              <Text c="dimmed">No results found</Text>
            )
          ) : (
            <Text c="dimmed">Enter a search term</Text>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
