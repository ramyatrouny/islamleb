import { apiFetch } from "./fetcher";
import type {
  AladhanTimingsResponse,
  AladhanHijriCalendarResponse,
} from "./types";

const BASE_URL = "https://api.aladhan.com/v1";

/** Fetch prayer times for a city */
export async function fetchPrayerTimes(
  city: string,
  country: string,
  method: number = 2,
  signal?: AbortSignal,
): Promise<AladhanTimingsResponse> {
  return apiFetch<AladhanTimingsResponse>(
    `${BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`,
    { signal, cacheTTL: 5 * 60 * 1000 },
  );
}

/**
 * Fetch Hijri calendar for a given month/year.
 * Ramadan = month 9, year 1447 for 2026.
 */
export async function fetchHijriCalendar(
  month: number,
  year: number,
  signal?: AbortSignal,
): Promise<AladhanHijriCalendarResponse> {
  return apiFetch<AladhanHijriCalendarResponse>(
    `${BASE_URL}/hijriCalendar/${month}/${year}`,
    { signal, cacheTTL: 60 * 60 * 1000 },
  );
}
