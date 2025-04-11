import { Container, Group, Paper, Skeleton } from "@mantine/core";

export function DevotionalSkeleton() {
  return (
    <Container size="md">
      <Group hiddenFrom="sm" mb="md" justify="apart">
        <Skeleton height={36} width={120} radius="sm" />
        <Skeleton height={36} width={120} radius="sm" />
      </Group>

      <Paper withBorder p="md">
        <Skeleton height={32} width="40%" mb="xl" />
        
        {/* Scripture reference skeleton */}
        <Skeleton height={24} width="30%" mb="lg" />
        
        {/* Scripture content skeleton */}
        <Group mb="xl">
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="95%" />
          <Skeleton height={16} width="85%" />
        </Group>

        {/* Devotional content skeleton */}
        <Group>
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="95%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="100%" />
        </Group>
      </Paper>
    </Container>
  );
}
