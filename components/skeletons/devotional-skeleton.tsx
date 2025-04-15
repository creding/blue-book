import {
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Divider,
} from "@mantine/core";

export function DevotionalSkeleton() {
  return (
    <Container size="lg" p={{ base: "xs", xl: "xl" }}>
      <Paper p={{ base: "xs", xl: "xl" }} withBorder>
        {/* Header with title and actions */}
        <Group justify="space-between" align="flex-start" mb="lg">
          <Skeleton height={32} width={200} radius="md" />
          <Group gap="xs">
            <Skeleton height={36} circle />
            <Skeleton height={36} circle />
            <Skeleton height={36} circle />
          </Group>
        </Group>

        {/* Opening Prayer Section */}
        <Stack gap="lg">
          <Stack gap="sm">
            <Group gap="sm">
              <Skeleton height={40} circle />
              <Skeleton height={24} width={150} radius="md" />
            </Group>
            <Stack gap="xs">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="90%" />
              <Skeleton height={14} width={120} />
            </Stack>
          </Stack>

          <Divider />

          {/* Scripture Section */}
          <Stack gap="sm">
            <Group gap="sm">
              <Skeleton height={40} circle />
              <Skeleton height={24} width={150} radius="md" />
            </Group>
            {/* Multiple scripture items */}
            <Stack gap="md">
              {[1, 2, 3].map((i) => (
                <Paper key={i} withBorder p="md" radius="md">
                  <Group justify="space-between" mb="sm">
                    <Group gap="sm">
                      <Skeleton height={24} circle />
                      <Skeleton height={20} width={150} radius="md" />
                    </Group>
                    <Skeleton height={16} width={80} />
                  </Group>
                  <Stack gap="sm">
                    <Skeleton height={16} width="100%" />
                    <Skeleton height={16} width="95%" />
                    <Skeleton height={16} width="90%" />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>

          <Divider />

          {/* Readings Section */}
          <Stack gap="sm">
            <Group gap="sm">
              <Skeleton height={40} circle />
              <Skeleton height={24} width={150} radius="md" />
            </Group>
            <Stack gap="md">
              {[1, 2].map((i) => (
                <Paper key={i} withBorder p="md" radius="md">
                  <Stack gap="sm">
                    <Skeleton height={16} width="100%" />
                    <Skeleton height={16} width="95%" />
                    <Skeleton height={16} width="90%" />
                    <Skeleton height={14} width={120} />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>

          <Divider />

          {/* Closing Prayer Section */}
          <Stack gap="sm">
            <Group gap="sm">
              <Skeleton height={40} circle />
              <Skeleton height={24} width={150} radius="md" />
            </Group>
            <Stack gap="xs">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="90%" />
              <Skeleton height={14} width={120} />
            </Stack>
          </Stack>

          {/* Song Section */}
          <Stack gap="sm">
            <Group gap="sm">
              <Skeleton height={40} circle />
              <Skeleton height={24} width={150} radius="md" />
            </Group>
            <Skeleton height={16} width="60%" />
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
