import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateStreak } from "@/lib/streak";

describe("calculateStreak", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns 0 when no days are fasted", () => {
    // Outside Ramadan — falls back to checking from day 29
    vi.setSystemTime(new Date(2026, 3, 1));
    const fasting = Array(30).fill(false);
    expect(calculateStreak(fasting)).toBe(0);
  });

  it("returns streak from end when outside Ramadan", () => {
    vi.setSystemTime(new Date(2026, 3, 1)); // After Ramadan
    const fasting = Array(30).fill(false);
    fasting[29] = true;
    fasting[28] = true;
    fasting[27] = true;
    expect(calculateStreak(fasting)).toBe(3);
  });

  it("returns correct streak during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 22)); // Feb 22 = day 5 (index 4)
    const fasting = Array(30).fill(false);
    fasting[4] = true; // today
    fasting[3] = true; // yesterday
    fasting[2] = true; // day before
    expect(calculateStreak(fasting)).toBe(3);
  });

  it("breaks streak at first unfasted day going backwards", () => {
    vi.setSystemTime(new Date(2026, 1, 22)); // index 4
    const fasting = Array(30).fill(false);
    fasting[4] = true;
    fasting[3] = true;
    // fasting[2] = false (gap)
    fasting[1] = true;
    expect(calculateStreak(fasting)).toBe(2);
  });

  it("returns 30 when all days fasted (outside Ramadan)", () => {
    vi.setSystemTime(new Date(2026, 3, 1));
    const fasting = Array(30).fill(true);
    expect(calculateStreak(fasting)).toBe(30);
  });

  it("returns 0 when today is not fasted during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 22)); // index 4
    const fasting = Array(30).fill(false);
    fasting[3] = true; // yesterday fasted but today not
    expect(calculateStreak(fasting)).toBe(0);
  });

  it("returns 1 when only today is fasted", () => {
    vi.setSystemTime(new Date(2026, 1, 18)); // index 0
    const fasting = Array(30).fill(false);
    fasting[0] = true;
    expect(calculateStreak(fasting)).toBe(1);
  });
});
