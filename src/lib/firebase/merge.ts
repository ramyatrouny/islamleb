import type { UserProgress } from "./types";

// ---------------------------------------------------------------------------
// Merge logic — "prefer most progress"
// Pure functions with no Firebase SDK dependency (safe for testing).
// ---------------------------------------------------------------------------

function mergeDailyGoals(
  local: Record<string, boolean[]>,
  cloud: Record<string, boolean[]>,
): Record<string, boolean[]> {
  const allDays = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const merged: Record<string, boolean[]> = {};

  for (const day of allDays) {
    const localGoals = local[day] ?? [];
    const cloudGoals = cloud[day] ?? [];
    const maxLen = Math.max(localGoals.length, cloudGoals.length);
    merged[day] = Array.from(
      { length: maxLen },
      (_, i) => (localGoals[i] ?? false) || (cloudGoals[i] ?? false),
    );
  }

  return merged;
}

/**
 * Merge local and cloud progress, preferring "most progress":
 * - fastingDays: OR per day
 * - completedJuz: union
 * - dailyGoals: OR per day per goal
 * - tasbihCount: max
 * - selectedCity: prefer local (most recent device)
 */
export function mergeProgress(
  local: UserProgress,
  cloud: UserProgress,
): UserProgress {
  const maxLen = Math.max(local.fastingDays.length, cloud.fastingDays.length);

  return {
    fastingDays: Array.from(
      { length: maxLen },
      (_, i) =>
        (local.fastingDays[i] ?? false) || (cloud.fastingDays[i] ?? false),
    ),
    completedJuz: [
      ...new Set([...local.completedJuz, ...cloud.completedJuz]),
    ].sort((a, b) => a - b),
    dailyGoals: mergeDailyGoals(local.dailyGoals, cloud.dailyGoals),
    tasbihCount: Math.max(local.tasbihCount, cloud.tasbihCount),
    selectedCity: local.selectedCity,
  };
}
