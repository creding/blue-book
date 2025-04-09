"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Devotional } from "@/types/devotional";
import {
  fetchDevotionals,
  getDevotionalByWeekAndDay,
} from "@/lib/devotional-service";

interface DevotionalContextType {
  devotionals: Devotional[];
  currentDevotional: Devotional | null;
  currentWeek: number | null;
  setCurrentWeek: (week: number) => void;
  currentDay: string;
  setCurrentDay: (day: string) => void;
  nextDevotional: () => void;
  previousDevotional: () => void;
  isLoading: boolean;
}

const DevotionalContext = createContext<DevotionalContextType | undefined>(
  undefined
);

export function DevotionalProvider({ children }: { children: ReactNode }) {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [currentDevotional, setCurrentDevotional] = useState<Devotional | null>(
    null
  );
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<string>("monday");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch devotionals on mount
  useEffect(() => {
    async function loadDevotionals() {
      setIsLoading(true);
      try {
        const data = await fetchDevotionals();
        console.log("Fetched devotionals:", data);
        setDevotionals(data);

        // Set initial week if not already set
        if (currentWeek === null && data.length > 0) {
          // Set to first devotional's ID
          setCurrentWeek(data[0].devotion_id);
        }
      } catch (error) {
        console.error("Error loading devotionals:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDevotionals();
  }, [currentWeek]);

  // Update current devotional when week or day changes
  useEffect(() => {
    async function updateCurrentDevotional() {
      if (currentWeek !== null && currentDay) {
        setIsLoading(true);
        try {
          const devotional = await getDevotionalByWeekAndDay(currentWeek, currentDay);
          setCurrentDevotional(devotional);
        } catch (error) {
          console.error("Error fetching devotional:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    updateCurrentDevotional();
  }, [currentWeek, currentDay]);

  // Navigate to next devotional
  const nextDevotional = () => {
    if (!currentWeek || !currentDay) return;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const currentDayIndex = days.indexOf(currentDay);

    if (currentDayIndex < days.length - 1) {
      // Move to next day
      setCurrentDay(days[currentDayIndex + 1]);
    } else {
      // Move to next devotional, first day
      const currentIndex = devotionals.findIndex(d => d.devotion_id === currentWeek);
      const nextExists = currentIndex < devotionals.length - 1;

      if (nextExists) {
        setCurrentWeek(devotionals[currentIndex + 1].devotion_id);
        setCurrentDay(days[0]);
      }
    }
  };

  // Navigate to previous devotional
  const previousDevotional = () => {
    if (!currentWeek || !currentDay) return;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const currentDayIndex = days.indexOf(currentDay);

    if (currentDayIndex > 0) {
      // Move to previous day
      setCurrentDay(days[currentDayIndex - 1]);
    } else {
      // Move to previous devotional, last day
      const currentIndex = devotionals.findIndex(d => d.devotion_id === currentWeek);
      const prevExists = currentIndex > 0;

      if (prevExists) {
        setCurrentWeek(devotionals[currentIndex - 1].devotion_id);
        setCurrentDay(days[days.length - 1]);
      }
    }
  };

  return (
    <DevotionalContext.Provider
      value={{
        devotionals,
        currentDevotional,
        currentWeek,
        setCurrentWeek,
        currentDay,
        setCurrentDay,
        nextDevotional,
        previousDevotional,
        isLoading,
      }}
    >
      {children}
    </DevotionalContext.Provider>
  );
}

export function useDevotional() {
  const context = useContext(DevotionalContext);
  if (context === undefined) {
    throw new Error("useDevotional must be used within a DevotionalProvider");
  }
  return context;
}
