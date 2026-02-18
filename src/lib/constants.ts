/**
 * Ramadan date constants.
 *
 * On first load, hardcoded defaults are used. Once the Aladhan API response
 * is cached in localStorage (via <RamadanDatesFetcher />), these values are
 * automatically sourced from the cache on subsequent visits.
 *
 * Override in `.env.local`:
 *   NEXT_PUBLIC_RAMADAN_START=2026-02-18
 *   NEXT_PUBLIC_RAMADAN_END=2026-03-19
 *   NEXT_PUBLIC_RAMADAN_EID=2026-03-20
 *   NEXT_PUBLIC_RAMADAN_TOTAL_DAYS=30
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseEnvDate(envKey: string, fallback: Date): Date {
  const raw = typeof process !== "undefined" ? process.env[envKey] : undefined;
  if (!raw) return fallback;
  const parsed = new Date(raw + "T00:00:00");
  return isNaN(parsed.getTime()) ? fallback : parsed;
}

function parseEnvInt(envKey: string, fallback: number): number {
  const raw = typeof process !== "undefined" ? process.env[envKey] : undefined;
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Try to read Ramadan dates from the localStorage cache written by the
 * Aladhan API fetcher. Returns null if unavailable (SSR or cache miss).
 */
function getCachedRamadanDates(): {
  start: Date;
  end: Date;
  eid: Date;
  totalDays: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("islamleb-cache-ramadan-dates");
    if (!raw) return null;
    const entry = JSON.parse(raw);
    // Check TTL (24h)
    if (Date.now() - entry.timestamp > 24 * 60 * 60 * 1000) return null;
    const data = entry.data;
    return {
      start: new Date(data.start),
      end: new Date(data.end),
      eid: new Date(data.eid),
      totalDays: data.totalDays,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Exported constants
// ---------------------------------------------------------------------------

const cached = getCachedRamadanDates();

export const RAMADAN_2026 = {
  START: cached?.start ?? parseEnvDate("NEXT_PUBLIC_RAMADAN_START", new Date(2026, 1, 18)),
  END: cached?.end ?? parseEnvDate("NEXT_PUBLIC_RAMADAN_END", new Date(2026, 2, 19)),
  EID: cached?.eid ?? parseEnvDate("NEXT_PUBLIC_RAMADAN_EID", new Date(2026, 2, 20)),
  TOTAL_DAYS: cached?.totalDays ?? parseEnvInt("NEXT_PUBLIC_RAMADAN_TOTAL_DAYS", 30),
} as const;

export const ARABIC_NUMERALS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

export const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
] as const;

/** Centralized localStorage key registry */
export const STORAGE_KEYS = {
  STORE: "islamleb-store",
} as const;
