import { describe, it, expect } from "vitest";
import { mergeProgress } from "@/lib/firebase/merge";
import type { UserProgress } from "@/lib/firebase/types";

function makeProgress(overrides: Partial<UserProgress> = {}): UserProgress {
  return {
    fastingDays: Array(30).fill(false),
    completedJuz: [],
    dailyGoals: {},
    tasbihCount: 0,
    selectedCity: "Beirut",
    ...overrides,
  };
}

describe("mergeProgress", () => {
  it("OR-merges fastingDays (never loses a fasted day)", () => {
    const local = makeProgress({
      fastingDays: [true, false, true, false, ...Array(26).fill(false)],
    });
    const cloud = makeProgress({
      fastingDays: [false, true, true, false, ...Array(26).fill(false)],
    });
    const merged = mergeProgress(local, cloud);

    expect(merged.fastingDays[0]).toBe(true); // local was true
    expect(merged.fastingDays[1]).toBe(true); // cloud was true
    expect(merged.fastingDays[2]).toBe(true); // both true
    expect(merged.fastingDays[3]).toBe(false); // both false
  });

  it("unions completedJuz and sorts them", () => {
    const local = makeProgress({ completedJuz: [1, 3, 5] });
    const cloud = makeProgress({ completedJuz: [2, 3, 7] });
    const merged = mergeProgress(local, cloud);

    expect(merged.completedJuz).toEqual([1, 2, 3, 5, 7]);
  });

  it("OR-merges dailyGoals per day per goal", () => {
    const local = makeProgress({
      dailyGoals: { "0": [true, false, true], "1": [false, true] },
    });
    const cloud = makeProgress({
      dailyGoals: { "0": [false, true, true], "2": [true] },
    });
    const merged = mergeProgress(local, cloud);

    expect(merged.dailyGoals["0"]).toEqual([true, true, true]);
    expect(merged.dailyGoals["1"]).toEqual([false, true]);
    expect(merged.dailyGoals["2"]).toEqual([true]);
  });

  it("takes the higher tasbihCount", () => {
    const local = makeProgress({ tasbihCount: 150 });
    const cloud = makeProgress({ tasbihCount: 300 });
    const merged = mergeProgress(local, cloud);

    expect(merged.tasbihCount).toBe(300);
  });

  it("prefers local selectedCity", () => {
    const local = makeProgress({ selectedCity: "Tripoli" });
    const cloud = makeProgress({ selectedCity: "Sidon" });
    const merged = mergeProgress(local, cloud);

    expect(merged.selectedCity).toBe("Tripoli");
  });

  it("handles empty cloud data (first sync)", () => {
    const local = makeProgress({
      fastingDays: [true, true, ...Array(28).fill(false)],
      completedJuz: [1, 2],
      tasbihCount: 42,
    });
    const cloud = makeProgress();
    const merged = mergeProgress(local, cloud);

    expect(merged.fastingDays[0]).toBe(true);
    expect(merged.fastingDays[1]).toBe(true);
    expect(merged.completedJuz).toEqual([1, 2]);
    expect(merged.tasbihCount).toBe(42);
  });

  it("handles empty local data (fresh device)", () => {
    const local = makeProgress();
    const cloud = makeProgress({
      fastingDays: [true, true, true, ...Array(27).fill(false)],
      completedJuz: [1, 2, 3],
      tasbihCount: 500,
      selectedCity: "Sidon",
    });
    const merged = mergeProgress(local, cloud);

    expect(merged.fastingDays[0]).toBe(true);
    expect(merged.completedJuz).toEqual([1, 2, 3]);
    expect(merged.tasbihCount).toBe(500);
    // Local city preference still wins (Beirut default)
    expect(merged.selectedCity).toBe("Beirut");
  });

  it("handles different-length fastingDays arrays", () => {
    const local = makeProgress({
      fastingDays: [true, false, true],
    });
    const cloud = makeProgress({
      fastingDays: [false, true, false, true, true],
    });
    const merged = mergeProgress(local, cloud);

    expect(merged.fastingDays).toEqual([true, true, true, true, true]);
  });

  it("handles dailyGoals with different-length goal arrays", () => {
    const local = makeProgress({
      dailyGoals: { "0": [true, false] },
    });
    const cloud = makeProgress({
      dailyGoals: { "0": [false, false, true, true] },
    });
    const merged = mergeProgress(local, cloud);

    expect(merged.dailyGoals["0"]).toEqual([true, false, true, true]);
  });
});
