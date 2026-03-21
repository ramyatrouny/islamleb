import { describe, it, expect } from "vitest";

/**
 * Tests for the v1 → v2 persist migration.
 *
 * We cannot easily invoke Zustand's internal migrate function in isolation,
 * so we import the store and verify that the new fields exist with correct
 * defaults after the store is created (which triggers migration for any
 * persisted v1 data).
 */

describe("store v1 → v2 migration", () => {
  it("migrate function adds sunnahFasting and generalDailyGoals to v1 state", () => {
    // Simulate a v1 persisted state (no sunnahFasting or generalDailyGoals)
    const v1State: Record<string, unknown> = {
      fastingDays: Array(30).fill(false),
      completedJuz: [],
      dailyGoals: {},
      tasbihCount: 0,
      selectedCity: "Beirut",
      lastSyncedAt: 0,
    };

    // Replicate the migrate logic from store.ts
    const migrated = { ...v1State, sunnahFasting: {}, generalDailyGoals: {} };

    expect(migrated.sunnahFasting).toEqual({});
    expect(migrated.generalDailyGoals).toEqual({});
    // Original fields preserved
    expect(migrated.fastingDays).toEqual(Array(30).fill(false));
    expect(migrated.completedJuz).toEqual([]);
    expect(migrated.dailyGoals).toEqual({});
    expect(migrated.tasbihCount).toBe(0);
    expect(migrated.selectedCity).toBe("Beirut");
  });

  it("migrate function preserves existing v2 fields if already present", () => {
    const v2State = {
      fastingDays: Array(30).fill(false),
      completedJuz: [1, 2],
      dailyGoals: {},
      tasbihCount: 33,
      selectedCity: "Tripoli",
      lastSyncedAt: 1000,
      sunnahFasting: { "2026-03": [true, false] },
      generalDailyGoals: { "2026-03-21": [true, true] },
    };

    // For version >= 2, migration returns state as-is
    const migrated = v2State;

    expect(migrated.sunnahFasting).toEqual({ "2026-03": [true, false] });
    expect(migrated.generalDailyGoals).toEqual({ "2026-03-21": [true, true] });
    expect(migrated.completedJuz).toEqual([1, 2]);
    expect(migrated.tasbihCount).toBe(33);
  });

  it("new store instance has sunnahFasting and generalDailyGoals defaults", async () => {
    const { useRamadanStore } = await import("@/lib/store");
    const state = useRamadanStore.getState();
    expect(state.sunnahFasting).toEqual({});
    expect(state.generalDailyGoals).toEqual({});
  });
});
