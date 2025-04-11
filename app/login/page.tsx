import AuthForm from "@/components/auth/auth-form";
import { Title, Container, Card, Center } from "@mantine/core";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  return (
    <Container size="sm" my="lg">
      <Center h="100vh">
        <Card
          withBorder
          shadow="md"
          pl="xl"
          pr="xl"
          pt="sm"
          pb="xl"
          radius="md"
        >
          <Title order={2} ta="center" mt="xl" mb="lg">
            Welcome to The Blue Book
          </Title>
          <AuthForm redirectPath={searchParams.redirect || "/"} />
        </Card>
      </Center>
    </Container>
  );
}
