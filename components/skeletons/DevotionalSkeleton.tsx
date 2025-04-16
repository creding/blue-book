import React from "react";
import {
  Skeleton,
  Stack,
  Group,
  Divider,
  Paper,
  Container,
} from "@mantine/core";

export const DevotionalSkeleton = () => {
  return (
    <Container size="lg" p={{ base: "xs", xl: "xl" }}>
      <Paper shadow="sm" radius="md" p="lg" withBorder>
        <Stack>
          <Skeleton height={30} width="40%" mb="lg" />
          <Group justify="space-between" align="center">
            <Skeleton height={20} width="30%" mb="xs" />
          </Group>
          <Skeleton height={80} radius="sm" mb="md" />
          <Divider />
          <Group justify="space-between" align="center">
            <Skeleton height={20} width="30%" mb="xs" />
          </Group>
          <Skeleton height={100} radius="sm" mb="md" />
          <Divider />
          <Group justify="space-between" align="center">
            <Skeleton height={20} width="40%" mb="xs" />
            <Group gap="xs">
              <Skeleton height={24} circle />
              <Skeleton height={16} width={40} />
              <Skeleton height={24} circle />
            </Group>
          </Group>
          <Skeleton height={120} radius="sm" mb="md" />
          <Divider />
          <Group justify="space-between" align="center">
            <Skeleton height={20} width="35%" mb="xs" />
            <Group gap="xs">
              <Skeleton height={24} circle />
              <Skeleton height={16} width={40} />
              <Skeleton height={24} circle />
            </Group>
          </Group>
          <Skeleton height={150} radius="sm" mb="md" />
          <Divider />
          <Group justify="space-between" align="center">
            <Skeleton height={20} width="30%" mb="xs" />
          </Group>
          <Skeleton height={80} radius="sm" mb="md" />
          <Divider />
          <Group justify="space-between" align="center">
            <Skeleton height={20} width="30%" mb="xs" />
          </Group>
          <Skeleton height={40} radius="sm" />
        </Stack>
      </Paper>
    </Container>
  );
};
