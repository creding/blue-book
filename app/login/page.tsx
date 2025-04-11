import AuthForm from '@/components/auth/auth-form'
import { Title, Container } from '@mantine/core'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  return (
    <Container size="xs">
      <Title order={2} ta="center" mt="xl" mb="lg">
        Welcome to The Blue Book
      </Title>
      <AuthForm />
    </Container>
  )
}
