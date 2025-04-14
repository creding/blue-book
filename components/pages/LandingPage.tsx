// components/LandingPage.tsx
import { useState } from "react";
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
} from "@mantine/core";
import classes from "./LandingPage.module.css";
import bookCover from "@/images/book_cover.jpg"; // Assuming you have the cover image here
import heroImage from "@/images/hero_bkg.jpg";
export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <BackgroundImage
        src={heroImage.src}
        className={classes.hero}
        style={{
          background: "cover",
        }}
      >
        <Container size="lg" className={classes.heroContainer}>
          <Paper shadow="md" p="xl" radius="md" className={classes.heroPaper}>
            <Group justify="space-between" align="center">
              <Stack gap="md">
                <Title order={1} c="blue.7" className={classes.title}>
                  The Blue Book
                </Title>
                {/* Subtitle from book cover */}
                <Text size="xl" c="blue.8" fw={500}>
                  A Devotional Guide for Every Season of Your Life
                </Text>
                <Text size="lg" c="blue.9">
                  By Jim Branch
                </Text>
                <Button
                  size="lg"
                  color="blue.6"
                  radius="md"
                  component="a"
                  href="/devotions" // Link to about or purchase
                >
                  Discover the Journey
                </Button>
              </Stack>
              <Image
                // Make sure bookCover.src points to the correct image path
                src={bookCover.src}
                alt="The Blue Book Cover"
                w={200} // Adjust width as needed
                radius="md"
                visibleFrom="sm" // Hide image on smaller screens if desired
              />
            </Group>
          </Paper>
        </Container>
      </BackgroundImage>

      {/* Introduction Section */}
      <Container size="lg" py="xl">
        <Stack gap="xl" align="center">
          {/* Updated title based on book's purpose */}
          <Title order={2} c="blue.7" ta="center">
            Discovering the Ancient Rhythms of God
          </Title>
          {/* Updated description based on Preface/Intro */}
          <Text size="md" c="blue.9" ta="center" maw={700}>
            *The Blue Book* is a spiritual journal drawn from the themes and
            seasons of Jim Branch's journey with Jesus over twenty years. It
            gathers words, poems, scriptures, and prayers shared by saints,
            poets, and pilgrims to help you discover the ancient rhythms of God.
            This guide offers space, time, and structure to nourish your soul
            and transform your heart through being with Jesus.
          </Text>
          <Divider w={100} c="blue.6" size="sm" />
          {/* Accurate author quote */}
          <Text size="sm" c="blue.8" ta="center" fs="italic">
            “My deepest desire is that this book might be helpful in your
            journey with Jesus.” — Jim Branch
          </Text>
        </Stack>
      </Container>

      {/* Features Section */}
      <Container size="lg" py="xl" bg="blue.0">
        <Stack gap="xl" align="center">
          <Title order={2} c="blue.7" ta="center">
            How to Use This Guide
          </Title>
          <Group justify="center" gap="xl" wrap="wrap" align="stretch">
            {[
              {
                title: "Daily Structure",
                description:
                  "Use the weekly prayers for focus, pray the assigned Psalm daily, and read the Scripture passage slowly and reflectively.",
              },
              {
                title: "Timeless Wisdom",
                description:
                  "Engage with Readings for Reflection from great writers past and present to hear God speak.",
              },
              {
                title: "Personal Reflection",
                description:
                  "Find dedicated space and time to be still, listen to God, and perhaps journal what you hear.",
              },
              {
                title: "Worshipful Songs",
                description:
                  "Use the suggested songs each week as an expression of worship and praise, adding a beautiful dimension to your daily rhythm. (Lyrics not included in book).",
              },
            ].map((feature, index) => (
              <Paper
                key={index}
                shadow="sm"
                p="md"
                radius="md"
                w={250} // Adjust width as needed
                bg="white"
              >
                <Title order={4} c="blue.6" mb="sm">
                  {feature.title}
                </Title>
                <Text size="sm" c="blue.9">
                  {feature.description}
                </Text>
              </Paper>
            ))}
          </Group>
          {/* Added note on consistency and place/time */}
          <Text size="sm" c="blue.8" ta="center" mt="lg" maw={700}>
            Consistency is key. Find a quiet place and a time when you're alert
            to meet with God daily. Let the Spirit guide your time.
          </Text>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Container size="lg" py="xl">
        <Paper shadow="lg" p="xl" radius="md" bg="blue.1">
          <Stack gap="md" align="center">
            <Title order={2} c="blue.7" ta="center">
              Begin Your Devotional Journey
            </Title>
            <Text size="md" c="blue.9" ta="center" maw={600}>
              Join countless others in discovering the depths of God’s love
              through *The Blue Book*. Let it be your companion in every season
              of life.
            </Text>
            <Button
              size="lg"
              color="blue.6"
              radius="md"
              component="a"
              href="/purchase" // Link to purchase page
            >
              Get Your Copy Today
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
