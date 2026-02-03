"use client";

import { useApiFetch } from "./use-api-fetch";
import { fetchHijriCalendar } from "@/lib/api/aladhan";
import type { AladhanCalendarDay } from "@/lib/api/types";

/**
 * Fetches the Aladhan Hijri calendar for a given month/year.
 * Returns an array of calendar days with timings and dates.
 */
export function useHijriCalendar(month: number, year: number) {
  return useApiFetch<AladhanCalendarDay[]>(
    (signal) =>
      fetchHijriCalendar(month, year, signal).then((res) => res.data),
    [month, year],
  );
}
