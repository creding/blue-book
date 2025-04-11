type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export function getCurrentWeekAndDay(): { week: number; day: DayOfWeek } {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate week number (1-based)
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );

  // Convert JS day number to our day format
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = days[dayOfWeek];

  // Ensure week number is between 1 and 52
  const normalizedWeek = ((weekNumber - 1) % 52) + 1;

  return {
    week: normalizedWeek,
    day: currentDay,
  };
}
