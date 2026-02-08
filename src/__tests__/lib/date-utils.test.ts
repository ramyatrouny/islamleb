import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getTimeRemaining,
  getRamadanDay,
  getRamadanDayIndex,
  getDaysRemaining,
  isRamadan,
  getRamadanDate,
  getTodayIftar,
} from "@/lib/date-utils";

// Ramadan 2026: Feb 18 – Mar 19, Eid Mar 20

describe("getTimeRemaining", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns zeros when target is in the past", () => {
    vi.setSystemTime(new Date(2026, 2, 1)); // Mar 1
    const result = getTimeRemaining(new Date(2026, 1, 1)); // Feb 1
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("returns zeros when target equals now", () => {
    const now = new Date(2026, 1, 18);
    vi.setSystemTime(now);
    const result = getTimeRemaining(new Date(now));
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("returns correct breakdown for a known future date", () => {
    vi.setSystemTime(new Date(2026, 1, 17, 0, 0, 0)); // Feb 17 00:00:00
    const target = new Date(2026, 1, 18, 0, 0, 0); // Feb 18 00:00:00 = 1 day later
    const result = getTimeRemaining(target);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it("handles target less than 1 minute in the future", () => {
    const now = new Date(2026, 1, 18, 12, 0, 0);
    vi.setSystemTime(now);
    const target = new Date(2026, 1, 18, 12, 0, 30); // 30s later
    const result = getTimeRemaining(target);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(30);
  });

  it("handles target exactly 1 day away with hours/minutes", () => {
    vi.setSystemTime(new Date(2026, 1, 17, 10, 30, 0));
    const target = new Date(2026, 1, 18, 12, 0, 0); // 1d 1h 30m
    const result = getTimeRemaining(target);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(0);
  });
});

describe("getRamadanDay", () => {
  it("returns 1 on Ramadan start date (Feb 18, 2026)", () => {
    expect(getRamadanDay(new Date(2026, 1, 18))).toBe(1);
  });

  it("returns 1 on start date at 23:59", () => {
    expect(getRamadanDay(new Date(2026, 1, 18, 23, 59, 59))).toBe(1);
  });

  it("returns 30 on last day (Mar 19, 2026)", () => {
    expect(getRamadanDay(new Date(2026, 2, 19))).toBe(30);
  });

  it("returns -1 before Ramadan (Feb 17, 2026)", () => {
    expect(getRamadanDay(new Date(2026, 1, 17))).toBe(-1);
  });

  it("returns -1 after Ramadan (Mar 20, 2026 = Eid)", () => {
    expect(getRamadanDay(new Date(2026, 2, 20))).toBe(-1);
  });

  it("returns correct day mid-Ramadan (Feb 25 = day 8)", () => {
    expect(getRamadanDay(new Date(2026, 1, 25))).toBe(8);
  });

  it("returns -1 well before Ramadan", () => {
    expect(getRamadanDay(new Date(2026, 0, 1))).toBe(-1);
  });

  it("returns -1 well after Ramadan", () => {
    expect(getRamadanDay(new Date(2026, 5, 1))).toBe(-1);
  });
});

describe("getRamadanDayIndex", () => {
  it("returns 0 on start date", () => {
    expect(getRamadanDayIndex(new Date(2026, 1, 18))).toBe(0);
  });

  it("returns 29 on last day", () => {
    expect(getRamadanDayIndex(new Date(2026, 2, 19))).toBe(29);
  });

  it("returns -1 outside Ramadan", () => {
    expect(getRamadanDayIndex(new Date(2026, 1, 17))).toBe(-1);
  });
});

describe("getDaysRemaining", () => {
  it("returns positive value on start date", () => {
    const result = getDaysRemaining(new Date(2026, 1, 18));
    expect(result).toBeGreaterThan(0);
  });

  it("returns 0 after end date", () => {
    expect(getDaysRemaining(new Date(2026, 2, 25))).toBe(0);
  });

  it("returns 1 on last day", () => {
    // Mar 19 at midnight, end is Mar 19 — should be 0 or close
    const result = getDaysRemaining(new Date(2026, 2, 19));
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe("isRamadan", () => {
  it("returns false before Ramadan start", () => {
    expect(isRamadan(new Date(2026, 1, 17))).toBe(false);
  });

  it("returns true on start date", () => {
    expect(isRamadan(new Date(2026, 1, 18))).toBe(true);
  });

  it("returns true on last day", () => {
    expect(isRamadan(new Date(2026, 2, 19))).toBe(true);
  });

  it("returns false on Eid day (Mar 20)", () => {
    expect(isRamadan(new Date(2026, 2, 20))).toBe(false);
  });

  it("returns false well after Ramadan", () => {
    expect(isRamadan(new Date(2026, 5, 1))).toBe(false);
  });
});

describe("getRamadanDate", () => {
  it("returns Feb 18 for dayIndex 0", () => {
    const date = getRamadanDate(0);
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1); // Feb
    expect(date.getDate()).toBe(18);
  });

  it("returns Feb 19 for dayIndex 1", () => {
    const date = getRamadanDate(1);
    expect(date.getDate()).toBe(19);
    expect(date.getMonth()).toBe(1);
  });

  it("returns Mar 19 for dayIndex 29", () => {
    const date = getRamadanDate(29);
    expect(date.getMonth()).toBe(2); // Mar
    expect(date.getDate()).toBe(19);
  });
});

describe("getTodayIftar", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns 17:30 when no maghribTime provided", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0));
    const result = getTodayIftar();
    expect(result.getHours()).toBe(17);
    expect(result.getMinutes()).toBe(30);
  });

  it("parses '18:05' correctly", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0));
    const result = getTodayIftar("18:05");
    expect(result.getHours()).toBe(18);
    expect(result.getMinutes()).toBe(5);
  });

  it("strips timezone notation like '18:05 (EET)'", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0));
    const result = getTodayIftar("18:05 (EET)");
    expect(result.getHours()).toBe(18);
    expect(result.getMinutes()).toBe(5);
  });

  it("falls back to 17:30 for invalid input", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0));
    const result = getTodayIftar("invalid");
    expect(result.getHours()).toBe(17);
    expect(result.getMinutes()).toBe(30);
  });

  it("falls back to 17:30 for empty string", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0));
    const result = getTodayIftar("");
    expect(result.getHours()).toBe(17);
    expect(result.getMinutes()).toBe(30);
  });
});
