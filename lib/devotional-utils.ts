import type { Devotional, Scripture, Reading } from "@/types/devotional";

// Get current week number (1-52)
export function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.ceil(diff / oneWeek);

  // Ensure week is between 1-52
  return Math.min(Math.max(weekNumber, 1), 52);
}

// Get current day of the week as string
export function getCurrentDay(): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

export interface DayContent {
  scripture: string | null;
  reflection: string | null;
}

// Parse content for specific day from devotional
export function getDayContent(devotional: Devotional, day: string | null): DayContent {
  try {
    let scripture: string | null = null;
    let reflection: string | null = null;

    if (!day) return { scripture, reflection };

    // Find scripture for the day
    const dayScripture = devotional.scriptures.find(s => s.day === day);
    if (dayScripture) {
      scripture = `${dayScripture.reference}\n\n${dayScripture.text}`;
    }

    // Find reflection for the day
    const dayReading = devotional.readings.find(r => r.day === day);
    if (dayReading) {
      reflection = dayReading.text;
      if (dayReading.source) {
        reflection += `\n\n— ${dayReading.source}`;
      }
    }

    return { scripture, reflection };
  } catch (error) {
    console.error("Error parsing day content:", error);
    return { scripture: null, reflection: null };
  }
}

// Helper function to check if a string is valid JSON
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
