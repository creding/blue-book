"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactElement, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchDevotionals, getDevotionalByWeekAndDay } from "@/data-access/devotion";
import { type Devotional } from "@/types/devotional";

interface DevotionalContextType {
  devotionals: Devotional[];
  currentDevotional: Devotional | null;
  currentWeek: number | null;
  currentDay: string;
  isLoading: boolean;
  setCurrentWeek: (week: number) => void;
  setCurrentDay: (day: string) => void;
  setWeekAndDay: (week: number, day: string) => void;
  nextDevotional: () => void;
  previousDevotional: () => void;
};

const DevotionalContext = createContext<DevotionalContextType | undefined>(
  undefined
);

type DevotionalProviderProps = {
  children: ReactNode;
  initialDevotional?: Devotional | null;
  initialDevotionals?: Devotional[];
  initialWeek?: number | null;
  initialDay?: string;
};

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function DevotionalProvider({ 
  children,
  initialDevotional,
  initialDevotionals = [],
  initialWeek,
  initialDay = "monday",
}: DevotionalProviderProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  const [devotionals, setDevotionals] = useState<Devotional[]>(initialDevotionals);
  const [currentDevotional, setCurrentDevotional] = useState<Devotional | null>(
    initialDevotional || null
  );
  const [currentWeek, _setCurrentWeek] = useState<number | null>(initialWeek || null);
  const [currentDay, _setCurrentDay] = useState<string>(initialDay);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to update both week and day atomically
  const setWeekAndDay = useCallback((week: number, day: string) => {
    _setCurrentWeek(week);
    _setCurrentDay(day);
    if (pathname !== '/') {
      router.replace(`/${week}/${day}`, { scroll: false });
    }
  }, [pathname, router]);

  // Wrap state updates with URL handling
  const setCurrentWeek = useCallback((week: number) => {
    _setCurrentWeek(week);
    if (currentDay && pathname !== '/') {
      router.replace(`/${week}/${currentDay}`, { scroll: false });
    }
  }, [currentDay, pathname, router]);

  const setCurrentDay = useCallback((day: string) => {
    _setCurrentDay(day);
    if (currentWeek && pathname !== '/') {
      router.replace(`/${currentWeek}/${day}`, { scroll: false });
    }
  }, [currentWeek, pathname, router]);

  // Fetch devotionals on mount
  useEffect(() => {
    async function loadDevotionals() {
      setIsLoading(true);
      try {
        const data = await fetchDevotionals();
        console.log("Fetched devotionals:", data);
        setDevotionals(data);
      } catch (error) {
        console.error("Error loading devotionals:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (initialDevotionals.length === 0) {
      loadDevotionals();
    }
  }, []);

  // Update current devotional when week or day changes
  useEffect(() => {
    async function updateCurrentDevotional() {
      if (currentWeek !== null && currentDay) {
        setIsLoading(true);
        try {
          const devotional = await getDevotionalByWeekAndDay(
            currentWeek,
            currentDay
          );
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
  const nextDevotional = useCallback(() => {
    if (!currentWeek || !currentDay) return;

    const currentDayIndex = days.indexOf(currentDay);

    if (currentDayIndex < days.length - 1) {
      // Move to next day
      setWeekAndDay(currentWeek, days[currentDayIndex + 1]);
    } else {
      // Move to next devotional, first day
      const currentIndex = devotionals.findIndex(
        (d: Devotional) => d.devotion_id === currentWeek
      );
      if (currentIndex < devotionals.length - 1) {
        setWeekAndDay(devotionals[currentIndex + 1].devotion_id, days[0]);
      }
    }
  }, [currentWeek, currentDay, devotionals, setWeekAndDay]);

  // Navigate to previous devotional
  const previousDevotional = useCallback(() => {
    if (!currentWeek || !currentDay) return;

    const currentDayIndex = days.indexOf(currentDay);

    if (currentDayIndex > 0) {
      // Move to previous day
      setWeekAndDay(currentWeek, days[currentDayIndex - 1]);
    } else {
      // Move to previous devotional, last day
      const currentIndex = devotionals.findIndex(
        (d: Devotional) => d.devotion_id === currentWeek
      );
      if (currentIndex > 0) {
        setWeekAndDay(devotionals[currentIndex - 1].devotion_id, days[days.length - 1]);
      }
    }
  }, [currentWeek, currentDay, devotionals, setWeekAndDay]);

  const value: DevotionalContextType = {
    devotionals,
    currentDevotional,
    currentWeek,
    currentDay,
    isLoading,
    setCurrentWeek,
    setCurrentDay,
    setWeekAndDay,
    nextDevotional,
    previousDevotional,
  };

  return (
    <DevotionalContext.Provider value={value}>
      {children}
    </DevotionalContext.Provider>
  );
}

export function useDevotional(): DevotionalContextType {
  const context = useContext(DevotionalContext);
  if (context === undefined) {
    throw new Error("useDevotional must be used within a DevotionalProvider");
  }
  return context;
}
