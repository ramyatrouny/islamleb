import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRamadanDate } from "@/hooks/use-ramadan-date";

describe("useRamadanDate", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns isInRamadan=true during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25)); // Feb 25
    const { result } = renderHook(() => useRamadanDate());
    expect(result.current.isInRamadan).toBe(true);
  });

  it("returns correct currentDay during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25)); // Feb 25 = day 8
    const { result } = renderHook(() => useRamadanDate());
    expect(result.current.currentDay).toBe(8);
    expect(result.current.dayIndex).toBe(7);
  });

  it("returns isInRamadan=false before Ramadan", () => {
    vi.setSystemTime(new Date(2026, 0, 15));
    const { result } = renderHook(() => useRamadanDate());
    expect(result.current.isInRamadan).toBe(false);
    expect(result.current.currentDay).toBe(-1);
    expect(result.current.dayIndex).toBe(-1);
  });

  it("returns daysRemaining > 0 during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25));
    const { result } = renderHook(() => useRamadanDate());
    expect(result.current.daysRemaining).toBeGreaterThan(0);
  });

  it("returns daysRemaining = 0 after Ramadan", () => {
    vi.setSystemTime(new Date(2026, 3, 1));
    const { result } = renderHook(() => useRamadanDate());
    expect(result.current.daysRemaining).toBe(0);
  });
});
