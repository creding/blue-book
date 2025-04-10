"use server";

const ESV_API_KEY = process.env.ESV_API_KEY;
const BASE_URL = "https://api.esv.org/v3/passage/html";

type EsvPassageResponse = {
  query: string;
  canonical: string;
  passages: string[];
};

export async function fetchEsvAction(passage: string) {
  if (!ESV_API_KEY) {
    throw new Error("ESV_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    q: passage,
    include_passage_references: "false",
    include_verse_numbers: "true",
    include_first_verse_numbers: "true",
    include_footnotes: "false",
    include_headings: "true",
    include_short_copyright: "false",
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Token ${ESV_API_KEY}`,
      },
      next: {
        revalidate: 3600000, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`ESV API error: ${response.statusText}`);
    }

    const data: EsvPassageResponse = await response.json();
    return data.passages[0] || "";
  } catch (error) {
    console.error("Error fetching ESV passage:", error);
    throw error;
  }
}
