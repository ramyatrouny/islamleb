import { RAMADAN_2026 } from "./constants";
import type { TimeRemaining } from "./types";

/** Calculate time remaining until a target date */
export function getTimeRemaining(target: Date): TimeRemaining {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Get current Ramadan day (1-based) or -1 if outside Ramadan */
export function getRamadanDay(now: Date = new Date()): number {
  const normalized = new Date(now);
  normalized.setHours(0, 0, 0, 0);

  const start = new Date(RAMADAN_2026.START);
  start.setHours(0, 0, 0, 0);

  const diff = Math.floor((normalized.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff >= RAMADAN_2026.TOTAL_DAYS) return -1;
  return diff + 1;
}

/** Get 0-based index for today within Ramadan, or -1 if outside */
export function getRamadanDayIndex(now: Date = new Date()): number {
  const day = getRamadanDay(now);
  return day === -1 ? -1 : day - 1;
}

/** Get days remaining in Ramadan (0 if past) */
export function getDaysRemaining(now: Date = new Date()): number {
  const diff = RAMADAN_2026.END.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Check if a date falls within Ramadan */
export function isRamadan(now: Date = new Date()): boolean {
  return now >= RAMADAN_2026.START && now < RAMADAN_2026.EID;
}

/** Get the Gregorian date for a Ramadan day index (0-29) */
export function getRamadanDate(dayIndex: number): Date {
  const date = new Date(RAMADAN_2026.START);
  date.setDate(date.getDate() + dayIndex);
  return date;
}

/**
 * Get today's approximate Iftar time.
 * Accepts an optional Maghrib time string (HH:MM) from the API.
 * Falls back to 17:30 (Beirut default) if not provided.
 */
export function getTodayIftar(maghribTime?: string): Date {
  const now = new Date();
  let hour = 17;
  let minute = 30;
  if (maghribTime) {
    const cleaned = maghribTime.replace(/\s*\(.*\)/, "").trim();
    const [h, m] = cleaned.split(":").map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      hour = h;
      minute = m;
    }
  }
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
}
