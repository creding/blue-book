import AuthForm from "@/components/auth/AuthForm";
import { CustomLayout } from "@/components/layout/CustomLayout";
import { DevotionalSkeleton } from "@/components/skeletons/DevotionalSkeleton";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { Title, Container, Card, Center } from "@mantine/core";
import { Suspense } from "react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const { redirect } = await searchParams;
  return (
    <CustomLayout toc={<TableOfContents slug={""} />} user={null}>
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
    </CustomLayout>
  );
}
