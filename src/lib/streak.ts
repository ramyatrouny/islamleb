import { RAMADAN_2026 } from "./constants";
import { getRamadanDayIndex } from "./date-utils";

/** Calculate consecutive fasting streak ending at today (or last day if outside Ramadan) */
export function calculateStreak(fasting: boolean[]): number {
  let streak = 0;
  const todayIdx = getRamadanDayIndex();
  const lastChecked = todayIdx >= 0 ? todayIdx : RAMADAN_2026.TOTAL_DAYS - 1;
  for (let i = lastChecked; i >= 0; i--) {
    if (fasting[i]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
