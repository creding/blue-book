"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BibleVersionContextType {
  bibleVersion: string;
  setBibleVersion: (version: string) => void;
}

const BibleVersionContext = createContext<BibleVersionContextType | undefined>(undefined);

export function BibleVersionProvider({ children }: { children: ReactNode }) {
  const [bibleVersion, setBibleVersion] = useState("de4e12af7f28f599-02");

  return (
    <BibleVersionContext.Provider value={{ bibleVersion, setBibleVersion }}>
      {children}
    </BibleVersionContext.Provider>
  );
}

export function useBibleVersion() {
  const context = useContext(BibleVersionContext);
  if (context === undefined) {
    throw new Error("useBibleVersion must be used within a BibleVersionProvider");
  }
  return context;
}
