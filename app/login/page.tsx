import AuthForm from "@/components/auth/auth-form";
import { DevotionalLayout } from "@/components/layout/devotional-layout";
import { DevotionalSkeleton } from "@/components/skeletons/devotional-skeleton";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { Title, Container, Card, Center } from "@mantine/core";
import { Suspense } from "react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const { redirect } = await searchParams;
  return (
    <DevotionalLayout toc={<TableOfContents slug={""} />} user={null}>
      <Center h="calc(100vh - 100px)">
        <Card
          withBorder
          shadow="md"
          pl="xl"
          pr="xl"
          pt="sm"
          pb="xl"
          radius="md"
        >
          <Title c="coverBlue" order={2} ta="center" mt="xl" mb="lg">
            Welcome to The Blue Book
          </Title>
          <Suspense fallback={<DevotionalSkeleton />}>
            <AuthForm redirectPath={redirect || "/"} />
          </Suspense>
        </Card>
      </Center>
    </DevotionalLayout>
  );
}
