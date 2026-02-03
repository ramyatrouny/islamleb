"use client";

import { useMemo } from "react";
import { getRamadanDay, getRamadanDayIndex, getDaysRemaining, isRamadan } from "@/lib/date-utils";

export interface RamadanDateInfo {
  /** Current Ramadan day 1-30 (or -1 if outside Ramadan) */
  currentDay: number;
  /** 0-based index (or -1 if outside Ramadan) */
  dayIndex: number;
  /** Days remaining in Ramadan */
  daysRemaining: number;
  /** Whether we are currently in Ramadan */
  isInRamadan: boolean;
}

/** Compute Ramadan date info (recomputes when the calendar date changes) */
export function useRamadanDate(): RamadanDateInfo {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  return useMemo(() => ({
    currentDay: getRamadanDay(),
    dayIndex: getRamadanDayIndex(),
    daysRemaining: getDaysRemaining(),
    isInRamadan: isRamadan(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [dateKey]);
}
