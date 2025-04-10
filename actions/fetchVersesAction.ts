"use server";

interface BibleApiResponse {
  data: {
    passages: Array<{
      content: string;
    }>;
  };
}

export const fetchVersesAction = async (reference: string, bibleId: string = "de4e12af7f28f599-02"): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(
        reference
      )}`,
      {
        headers: {
          "api-key": process.env.BIBLE_API_KEY || "",
        },
      }
    );
    const data = await response.json();

    const content = data.data.passages[0].content;

    return content;
  } catch (error) {
    console.error(
      `Error fetching scripture for reference ${reference}:`,
      error
    );
    throw error;
  }
};
