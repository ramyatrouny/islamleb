import { RAMADAN_2026 } from "./constants";
import { getTimeRemaining, getRamadanDay, getTodayIftar, isRamadan } from "./date-utils";
import type { TimeRemaining } from "./types";

export interface CountdownState {
  phase: "before" | "during" | "after";
  timeLeft: TimeRemaining;
  ramadanDay: number;
}

/** Compute the current countdown state based on Ramadan phase */
export function computeCountdownState(maghribTime?: string | null): CountdownState {
  const now = new Date();
  if (now < RAMADAN_2026.START) {
    return {
      phase: "before",
      timeLeft: getTimeRemaining(RAMADAN_2026.START),
      ramadanDay: 1,
    };
  } else if (isRamadan(now)) {
    const iftar = getTodayIftar(maghribTime ?? undefined);
    return {
      phase: "during",
      timeLeft: now < iftar ? getTimeRemaining(iftar) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
      ramadanDay: getRamadanDay(now),
    };
  }
  return {
    phase: "after",
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    ramadanDay: 1,
  };
}
