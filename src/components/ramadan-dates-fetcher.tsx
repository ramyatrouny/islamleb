"use client";

import { useEffect } from "react";
import { fetchRamadanDates } from "@/lib/api-fetchers";

/**
 * Invisible component that fetches Ramadan dates from the Aladhan API
 * on mount and caches them in localStorage. Renders nothing.
 * Place once in the root layout.
 */
export function RamadanDatesFetcher() {
  useEffect(() => {
    const controller = new AbortController();
    fetchRamadanDates(1447, controller.signal).catch(() => {
      // Silently ignore — fallback dates in constants.ts will be used
    });
    return () => controller.abort();
  }, []);

  return null;
}
