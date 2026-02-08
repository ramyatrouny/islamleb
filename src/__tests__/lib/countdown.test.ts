import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { computeCountdownState } from "@/lib/countdown";

describe("computeCountdownState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns phase "before" when date is before Ramadan start', () => {
    vi.setSystemTime(new Date(2026, 0, 15)); // Jan 15
    const result = computeCountdownState();
    expect(result.phase).toBe("before");
    expect(result.timeLeft.days).toBeGreaterThan(0);
  });

  it("returns non-zero timeLeft for before phase", () => {
    vi.setSystemTime(new Date(2026, 1, 17, 12, 0, 0)); // Feb 17 noon
    const result = computeCountdownState();
    expect(result.phase).toBe("before");
    expect(result.timeLeft.hours).toBeGreaterThan(0);
  });

  it('returns phase "during" when date is within Ramadan', () => {
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // Feb 25 10am
    const result = computeCountdownState();
    expect(result.phase).toBe("during");
  });

  it("returns correct ramadanDay during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // Feb 25 = day 8
    const result = computeCountdownState();
    expect(result.ramadanDay).toBe(8);
  });

  it("returns iftar countdown when before iftar time during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0)); // Noon, before iftar
    const result = computeCountdownState("18:00");
    expect(result.phase).toBe("during");
    expect(result.timeLeft.hours).toBeGreaterThan(0);
  });

  it("returns zeros after iftar time during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 19, 0, 0)); // 7pm, after iftar
    const result = computeCountdownState("18:00");
    expect(result.phase).toBe("during");
    expect(result.timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('returns phase "after" when date is after Ramadan end', () => {
    vi.setSystemTime(new Date(2026, 3, 1)); // Apr 1
    const result = computeCountdownState();
    expect(result.phase).toBe("after");
    expect(result.timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("uses default iftar time when maghribTime is null", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 16, 0, 0)); // 4pm, before default 17:30
    const result = computeCountdownState(null);
    expect(result.phase).toBe("during");
    expect(result.timeLeft.hours).toBeGreaterThanOrEqual(1);
  });
});
