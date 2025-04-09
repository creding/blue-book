"use client"

import { useState } from "react"
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
} from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { useDevotional } from "@/providers/devotional-provider"
import { searchDevotionals } from "@/lib/devotional-service"

export function SearchSidebar() {
  const { devotionals, setCurrentWeek, setCurrentDay } = useDevotional()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    title: true,
    prayers: true,
    readings: true,
    scripture: true,
  })

  const handleFilterChange = (field: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchDevotionals(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (devotionId: number) => {
    const devotional = devotionals.find((d) => d.devotion_id === devotionId)
    if (devotional) {
      // Extract week from devotional
      const week = devotional.devotion_id
      setCurrentWeek(week)
      setCurrentDay("monday") // Default to Monday when selecting from search
    }
  }

  const highlightText = (text: string | null, query: string) => {
    if (!text) return null

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) => (part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part))
  }

  // Filter results based on selected filters
  const filteredResults = searchResults.filter((result) => {
    if (!searchQuery.trim()) return false

    return (
      (filters.title && result.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (filters.prayers &&
        (result.opening_prayer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.closing_prayer?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (filters.readings && result.reading_for_reflection?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (filters.scripture &&
        (result.scriptures?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.psalm_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.psalm_text?.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  })

  return (
    <Stack spacing="md" h="100%">
      <Title order={4}>Search</Title>

      <TextInput
        placeholder="Search devotionals..."
        icon={<IconSearch size="0.9rem" />}
        value={searchQuery}
        onChange={(event) => handleSearch(event.currentTarget.value)}
      />

      <Group spacing="xs">
        <Checkbox label="Title" checked={filters.title} onChange={() => handleFilterChange("title")} size="xs" />
        <Checkbox label="Prayers" checked={filters.prayers} onChange={() => handleFilterChange("prayers")} size="xs" />
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
        <Stack spacing="md">
          {isSearching ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <Loader size="sm" />
            </div>
          ) : searchQuery.trim() ? (
            filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <Paper
                  key={result.devotion_id}
                  p="xs"
                  withBorder
                  onClick={() => handleResultClick(result.devotion_id!)}
                  sx={(theme) => ({
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.colors.gray[0],
                    },
                  })}
                >
                  <Group position="apart" mb="xs">
                    <Text weight={500}>{highlightText(result.title, searchQuery)}</Text>
                    <Badge size="sm">Week {result.devotion_id}</Badge>
                  </Group>

                  {filters.prayers &&
                    result.opening_prayer &&
                    result.opening_prayer.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <Text size="sm" lineClamp={2}>
                        Prayer: {highlightText(result.opening_prayer, searchQuery)}
                      </Text>
                    )}

                  {filters.scripture &&
                    result.psalm_reference &&
                    result.psalm_reference.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <Text size="sm" lineClamp={2}>
                        Psalm: {highlightText(result.psalm_reference, searchQuery)}
                      </Text>
                    )}

                  {filters.readings &&
                    result.reading_for_reflection &&
                    result.reading_for_reflection.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <Text size="sm" lineClamp={2}>
                        Reading: {highlightText(result.reading_for_reflection, searchQuery)}
                      </Text>
                    )}
                </Paper>
              ))
            ) : (
              <Text color="dimmed">No results found</Text>
            )
          ) : (
            <Text color="dimmed">Enter a search term</Text>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  )
}
