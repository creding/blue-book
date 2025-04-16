"use client";
import { Container, Title, Text, Paper, Stack, Divider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
// Assuming you are wrapping your app in MantineProvider with the custom theme

export function PrefaceIntroPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    // Use Box with background from theme's 'other' object if desired, or keep it simple
    // Example: <Box bg={theme.other.bodyBg.light} miw="100vh">
    <Container size="lg" p={{ base: "xs", xl: "xl" }}>
      {" "}
      {/* Optimal reading width */}
      <Stack gap="xl">
        {" "}
        {/* Increased gap between sections */}
        {/* Preface Section */}
        <Paper
          shadow={isMobile ? undefined : "sm"}
          p={{ base: "xs", xl: "xl" }}
          radius="md"
          withBorder={!isMobile}
        >
          {" "}
          {/* Increased padding */}
          <Stack gap="lg">
            {" "}
            {/* Adjusted gap within section */}
            <Title order={2} c="coverBlue" ta="center">
              {" "}
              {/* Applied theme color */}
              Preface
            </Title>
            <Divider my="md" /> {/* Adjusted margin */}
            <Text lh={1.6}>
              {" "}
              {/* Improved line height */}
              This book has been a long time in the making. At its core it is
              simply a spiritual journal of the themes and seasons of my own
              journey with Jesus over the past twenty years or so. It is a
              collection of words and poems and scriptures and prayers that have
              been spoken into my life by various saints, poets, and pilgrims
              along the way-most of whom I have never personally met. To each of
              them I am eternally grateful.
            </Text>
            <Text lh={1.6}>
              I am also grateful for the loving community of family and friends
              and coworkers who have surrounded, cared for, and invested in me
              through the years. Your contribution to the pages that follow
              cannot be overstated. Special thanks to Rhonda Lowry, whose
              wisdom, kindness, and tireless efforts have helped make this dream
              become a reality.
            </Text>
            <Text lh={1.6}>
              My deepest desire for this book is that it might be helpful in
              your journey with Jesus. That it might offer space and time and
              scripture and structure for you to discover the ancient rhythms of
              God that were whispered into you when he breathed you into being.
              My prayer is that it would not get in the way of what God wants to
              do in and through you, but that it might actually encourage and
              enable it. Thank you for giving me the incredible privilege of
              accompanying you on this extraordinary adventure into the heart of
              our God. May you always know the depths of his great affection.
            </Text>
          </Stack>
        </Paper>
        {/* Introduction Section */}
        <Paper
          shadow={isMobile ? undefined : "sm"}
          p={{ base: "xs", xl: "xl" }}
          radius="md"
          withBorder={!isMobile}
        >
          {" "}
          {/* Increased padding */}
          <Stack gap="lg">
            {" "}
            {/* Adjusted gap within section */}
            <Title order={2} c="coverBlue" ta="center">
              {" "}
              {/* Applied theme color */}
              Introduction
            </Title>
            <Divider my="md" /> {/* Adjusted margin */}
            <Text lh={1.6}>
              Welcome. My guess is that if you have made it this far you are
              interested in finding a fruitful way of being with God and with
              his word on a daily basis. Believe me, you are not alone. Years
              ago I began a search for a tool that would help bring me into the
              presence of God regularly. God wonderfully directed that search to
              a book called Disciplines for the Inner Life by Michael W. Benson
              and Bob Benson, which he used to form my inner life over the next
              7-8 years in ways that I never imagined. That book, as well as the
              one that it was modeled after (A Guide to Prayer for Ministers and
              Other Servants by Rueben P. Job and Norman Shawchuck), have served
              as a model for what you now hold in your hands. My prayer is that
              it would offer you rich space and time to simply be with Jesus in
              a way that nourishes your soul and transforms your heart.
            </Text>
            <Text lh={1.6}>
              Using this book is quite easy and should offer your time with God
              some structure. Start by using the prayers as a means of focus and
              attentiveness to the theme of the week. Next, pray the Psalm every
              day for the week. If the Psalm is too lengthy for you to pray each
              day, break it into parts. Praying the Psalms has been a tool of
              Christians for centuries to commune with God. To pray them, just
              read them aloud, slowly and reflectively. For the Scripture
              passage each day, read it the same way. In the words of Mme.
              Jeanne Guyon, a French writer of the seventeenth century, "Take in
              fully, gently, and carefully what you are reading. Taste it and
              digest it as you read. Use the passage to sense the presence of
              the Lord and stay with the passage until you have sensed the very
              heart of what you have read...your purpose is to take everything
              from the passage that unveils the Lord to you." Try to read one or
              two of the Readings for Reflection each day as a means of allowing
              God to speak through some of the great writers of the past and
              present.
            </Text>
            <Text lh={1.6}>
              Then take time for reflection and listening. Try to be still and
              hear what God is saying to you, maybe writing down what you hear
              in a journal. Next, turn your heart toward God in prayer. Pray as
              you feel led. Remember that Clement of Alexandria once said that
              prayer is "simply keeping company with God." Use the song as an
              expression of worship and praise to the One that made you. I
              regret that it was not possible to include the lyrics to all of
              these songs in the text, but in this day and age it should be easy
              enough to find them on your own. My prayer is that they might add
              a beautiful dimension to your daily rhythm with God. Sing them
              aloud or in your heart, which ever you prefer.
            </Text>
            <Text lh={1.6}>
              Finally, know that place and time are important elements of this
              process. Find a place that is set aside for you and God alone; a
              place that helps you be attentive to Him, a place that will not be
              full of distractions or noise. Remember that three main enemies of
              your spiritual life are crowds, noise, and busyness. Also, pick a
              time that is a good time for you; a time of day or night when you
              are at your best, awake and alert. As your time with God unfolds
              each day try not to keep an eye on your watch, just allow your
              time to happen. Some days it may take a while and some days it may
              be relatively short. We're going for quality. Let the Spirit of
              God be your guide. The key is just to be consistent. Over time you
              will begin to notice that God is near, be it ever so subtle at
              times.
            </Text>
            <Text lh={1.6}>
              Here's hoping that your time with Him is full and rich.
            </Text>
            <Divider mt="lg" mb="xs" /> {/* Adjusted margin */}
            <Text ta="right" fz="sm" fs="italic" c="dimmed">
              {" "}
              {/* Dimmed color for less emphasis */}
              Jim Branch
              <br />
              12 December 2002
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
