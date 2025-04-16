import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Divider,
  BackgroundImage,
  Box,
  Overlay,
  SimpleGrid,
  Card,
  ThemeIcon,
  Center,
} from "@mantine/core";
import {
  IconBook,
  IconHeartHandshake,
  IconMessages,
  IconMusic,
} from "@tabler/icons-react";
import classes from "./LandingPage.module.css";
import bookCover from "@/images/book_cover.jpg";
import Link from "next/link";
import backgroundLake from "@/images/background_lake.png";

const featuresData = [
  {
    icon: IconBook,
    title: "Daily Structure",
    description:
      "Use the weekly prayers for focus, pray the assigned Psalm daily, and read the Scripture passage slowly and reflectively.",
  },
  {
    icon: IconMessages,
    title: "Timeless Wisdom",
    description:
      "Engage with Readings for Reflection from great writers past and present to hear God speak.",
  },
  {
    icon: IconHeartHandshake,
    title: "Personal Reflection",
    description:
      "Find dedicated space and time to be still, listen to God, and perhaps journal what you hear.",
  },
  {
    icon: IconMusic,
    title: "Worshipful Songs",
    description:
      "Use the suggested songs each week as an expression of worship and praise, adding a beautiful dimension to your daily rhythm. (Lyrics not included).",
  },
];

export default function LandingPage() {
  return (
    <>
      <Box
        pos="relative"
        className={classes.hero}
        style={{
          backgroundColor: "coverBlue.7",
        }}
      >
        <BackgroundImage
          src={backgroundLake.src}
          radius="sm"
          mih={{ base: "600px", xl: "900px" }}
          bgsz="cover"
          bgp="center"
          display="flex"
        >
          <Overlay color="#000" opacity={0.2} zIndex={1} />
          <Container size="lg" style={{ zIndex: 2, position: "relative" }}>
            <Center h="100%">
              <Stack gap="xs">
                <Link href="/devotions" className={classes.bookCoverLink}>
                  <Image
                    src={bookCover.src}
                    alt="The Blue Book Cover"
                    w={{ base: 150, sm: 200, md: 250 }}
                    radius="md"
                    style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
                  />
                </Link>
              </Stack>
            </Center>
          </Container>
        </BackgroundImage>
      </Box>

      <Container size="lg" py={{ base: "xl", md: "80px" }}>
        <Stack gap="lg" align="center">
          <Title order={2} c="coverBlue" ta="center">
            Discovering the Ancient Rhythms of God
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={750} lh={1.6}>
            "The Blue Book" is a spiritual journal drawn from the themes and
            seasons of Jim Branch's journey with Jesus over twenty years. It
            gathers words, poems, scriptures, and prayers shared by saints,
            poets, and pilgrims to help you discover the ancient rhythms of God.
            This guide offers space, time, and structure to nourish your soul
            and transform your heart through being with Jesus.
          </Text>
          <Divider w={100} color="coverBlue.6" size="sm" my="sm" />
          <Text size="md" c="neutralGray.7" ta="center" fs="italic">
            “My deepest desire is that this book might be helpful in your
            journey with Jesus.” — Jim Branch
          </Text>
        </Stack>
      </Container>

      <Box bg="neutralGray.0" py={{ base: "xl", md: "80px" }}>
        <Container size="xl">
          <Stack gap="xl" align="center">
            <Title order={2} c="coverBlue" ta="center" mb="lg">
              How to Use This Guide
            </Title>
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 4 }}
              spacing="xl"
              verticalSpacing="xl"
            >
              {featuresData.map((feature, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    borderColor: "neutralGray.2",
                  }}
                >
                  <Group gap="md" mb="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="coverBlue"
                      radius="md"
                    >
                      <feature.icon style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                    <Title order={4} c="coverBlue">
                      {feature.title}
                    </Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {feature.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
            <Text fz="sm" c="dimmed" ta="center" mt="lg" maw={700}>
              Consistency is key. Find a quiet place and a time when you're
              alert to meet with God daily. Let the Spirit guide your time.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py={{ base: "xl", md: "80px" }}>
        <Paper shadow="md" p="xl" radius="lg" bg="coverBlue.0">
          <Stack gap="md" align="center">
            <Title order={2} c="coverBlue" ta="center">
              Begin Your Devotional Journey
            </Title>
            <Text size="lg" c="coverBlue" ta="center" maw={600}>
              Join countless others in discovering the depths of God’s love
              through *The Blue Book*. Let it be your companion in every season
              of life.
            </Text>
            <Button
              size="lg"
              variant="gradient"
              gradient={{
                from: "coverBlue.6",
                to: "devotionalBlue.5",
              }}
              radius="md"
              component={Link}
              href="/devotions"
              mt="md"
            >
              Get Started
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
