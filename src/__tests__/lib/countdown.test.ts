import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { computeCountdownState } from "@/lib/countdown";

describe("computeCountdownState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns phase "before-ramadan" when date is before Ramadan start', () => {
    vi.setSystemTime(new Date(2026, 0, 25)); // Jan 25
    const result = computeCountdownState();
    expect(result.phase).toBe("before-ramadan");
    expect(result.timeLeft.days).toBeGreaterThan(0);
  });

  it('returns phase "ramadan" when date is within Ramadan', () => {
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // Feb 25 10am
    const result = computeCountdownState();
    expect(result.phase).toBe("ramadan");
  });

  it("returns correct eventDay during Ramadan (day 8)", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // Feb 25 = day 8
    const result = computeCountdownState();
    expect(result.eventDay).toBe(8);
  });

  it("returns iftar countdown when before iftar time during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0)); // Noon, before iftar
    const result = computeCountdownState("18:00");
    expect(result.phase).toBe("ramadan");
    expect(result.timeLeft.hours).toBeGreaterThan(0);
  });

  it("returns zeros after iftar time during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 19, 0, 0)); // 7pm, after iftar
    const result = computeCountdownState("18:00");
    expect(result.phase).toBe("ramadan");
    expect(result.timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('returns phase "eid-al-fitr" on Eid al-Fitr', () => {
    vi.setSystemTime(new Date(2026, 2, 20, 10, 0, 0)); // Mar 20
    const result = computeCountdownState();
    expect(result.phase).toBe("eid-al-fitr");
    expect(result.timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(result.eventDay).toBe(0);
  });

  it('returns phase "normal" for a date outside all events', () => {
    vi.setSystemTime(new Date(2026, 4, 15)); // May 15
    const result = computeCountdownState();
    expect(result.phase).toBe("normal");
    expect(result.timeLeft.days).toBeGreaterThan(0);
    expect(result.eventDay).toBe(0);
  });

  it('returns phase "shawwal-fasting" during Shawwal fasting period', () => {
    vi.setSystemTime(new Date(2026, 3, 1)); // Apr 1
    const result = computeCountdownState();
    expect(result.phase).toBe("shawwal-fasting");
    expect(result.eventDay).toBe(0);
  });

  it('returns phase "dhul-hijjah" during Dhul Hijjah', () => {
    vi.setSystemTime(new Date(2026, 6, 20)); // Jul 20
    const result = computeCountdownState();
    expect(result.phase).toBe("dhul-hijjah");
    expect(result.eventDay).toBe(0);
  });

  it('returns phase "eid-al-adha" on Eid al-Adha', () => {
    vi.setSystemTime(new Date(2026, 6, 26, 10, 0, 0)); // Jul 26
    const result = computeCountdownState();
    expect(result.phase).toBe("eid-al-adha");
    expect(result.timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(result.eventDay).toBe(0);
  });

  it("uses default iftar time when maghribTime is null", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 16, 0, 0)); // 4pm, before default 17:30
    const result = computeCountdownState(null);
    expect(result.phase).toBe("ramadan");
    expect(result.timeLeft.hours).toBeGreaterThanOrEqual(1);
  });
});
