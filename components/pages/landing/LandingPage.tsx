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
} from "@mantine/core";
// Assuming you have Tabler Icons installed
import {
  IconBook,
  IconHeartHandshake,
  IconMessages,
  IconMusic,
} from "@tabler/icons-react";
import classes from "./LandingPage.module.css"; // Keep your CSS module for custom styles
import bookCover from "@/images/book_cover.jpg"; // Ensure path is correct
import heroImage from "@/images/hero_bkg.jpg"; // Ensure path is correct
import Link from "next/link";
import backgroundCabin from "@/images/background_cabin.png";
import backgroundLake from "@/images/background_lake.png";
// Define feature data including icons
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
      {/* Hero Section - Simplified to just clickable image */}
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
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",

            minHeight: "900px", // Keep height or adjust as needed
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the content horizontally too
          }}
        >
          {/* Overlay */}
          <Overlay color="#000" opacity={0.2} zIndex={1} />

          {/* Content container */}
          <Container size="lg" style={{ zIndex: 2, position: "relative" }}>
            {/* Centered clickable book cover */}
            <Group justify="center">
              <Link href="/devotions">
                <Image
                  src={bookCover.src}
                  alt="The Blue Book Cover"
                  w={{ base: 150, sm: 200, md: 250 }}
                  radius="md"
                  style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
                />
              </Link>
            </Group>
          </Container>
        </BackgroundImage>
      </Box>

      {/* Introduction Section */}
      <Container size="lg" py={{ base: "xl", md: "80px" }}>
        <Stack gap="lg" align="center">
          {/* Use primary theme color for title */}
          <Title order={2} c="coverBlue" ta="center">
            Discovering the Ancient Rhythms of God
          </Title>
          {/* Use theme text color or specific gray shade */}
          <Text size="lg" c="dimmed" ta="center" maw={750} lh={1.6}>
            *The Blue Book* is a spiritual journal drawn from the themes and
            seasons of Jim Branch's journey with Jesus over twenty years. It
            gathers words, poems, scriptures, and prayers shared by saints,
            poets, and pilgrims to help you discover the ancient rhythms of God.
            This guide offers space, time, and structure to nourish your soul
            and transform your heart through being with Jesus.
          </Text>
          {/* Use primary theme color for divider */}
          <Divider w={100} color="coverBlue.6" size="sm" my="sm" />
          {/* Use appropriate gray shade from theme */}
          <Text size="md" c="neutralGray.7" ta="center" fs="italic">
            “My deepest desire is that this book might be helpful in your
            journey with Jesus.” — Jim Branch
          </Text>
        </Stack>
      </Container>

      {/* Features Section */}
      {/* Use a background color from the theme */}
      <Box bg="neutralGray.0" py={{ base: "xl", md: "80px" }}>
        <Container size="xl">
          {" "}
          {/* Consider 'lg' or 'xl' based on preference */}
          <Stack gap="xl" align="center">
            {/* Use primary theme color for title */}
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
                  radius="md" // Use theme default radius
                  withBorder
                  // Style border with theme color
                  style={{
                    borderColor: "neutralGray.2",
                  }}
                >
                  <Group gap="md" mb="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="coverBlue" // Use primary theme color
                      radius="md" // Use theme default radius
                    >
                      <feature.icon style={{ width: "70%", height: "70%" }} />
                    </ThemeIcon>
                    {/* Use primary theme color for title */}
                    <Title order={4} c="coverBlue">
                      {feature.title}
                    </Title>
                  </Group>
                  {/* Use theme text color or specific gray */}
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

      {/* CTA Section */}
      <Container size="lg" py={{ base: "xl", md: "80px" }}>
        {/* Use a background color from the theme */}
        <Paper
          shadow="md"
          p="xl"
          radius="lg" // Keep larger radius for emphasis
          bg="coverBlue.0"
        >
          <Stack gap="md" align="center">
            {/* Use primary theme color */}
            <Title order={2} c="coverBlue" ta="center">
              Begin Your Devotional Journey
            </Title>
            {/* Use theme appropriate text color */}
            <Text size="lg" c="coverBlue" ta="center" maw={600}>
              Join countless others in discovering the depths of God’s love
              through *The Blue Book*. Let it be your companion in every season
              of life.
            </Text>
            <Button
              size="lg"
              variant="gradient"
              // Use theme colors for gradient
              gradient={{
                from: "coverBlue.6",
                to: "devotionalBlue.5",
              }} // Example: coverBlue to devotionalBlue
              radius="md" // Use theme default radius
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
