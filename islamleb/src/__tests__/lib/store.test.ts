import { describe, it, expect, beforeEach } from "vitest";
import { useRamadanStore } from "@/lib/store";

// Reset store before each test
beforeEach(() => {
  useRamadanStore.setState({
    fastingDays: Array(30).fill(false),
    completedJuz: [],
    dailyGoals: {},
    tasbihCount: 0,
    selectedCity: "Beirut",
  });
});

describe("initial state", () => {
  it("fastingDays is array of 30 falses", () => {
    const { fastingDays } = useRamadanStore.getState();
    expect(fastingDays).toHaveLength(30);
    expect(fastingDays.every((d) => d === false)).toBe(true);
  });

  it("completedJuz is empty", () => {
    expect(useRamadanStore.getState().completedJuz).toEqual([]);
  });

  it("dailyGoals is empty object", () => {
    expect(useRamadanStore.getState().dailyGoals).toEqual({});
  });

  it("tasbihCount is 0", () => {
    expect(useRamadanStore.getState().tasbihCount).toBe(0);
  });

  it("selectedCity is Beirut", () => {
    expect(useRamadanStore.getState().selectedCity).toBe("Beirut");
  });
});

describe("toggleFastingDay", () => {
  it("toggles day 0 from false to true", () => {
    useRamadanStore.getState().toggleFastingDay(0);
    expect(useRamadanStore.getState().fastingDays[0]).toBe(true);
  });

  it("toggles back from true to false", () => {
    useRamadanStore.getState().toggleFastingDay(0);
    useRamadanStore.getState().toggleFastingDay(0);
    expect(useRamadanStore.getState().fastingDays[0]).toBe(false);
  });

  it("does not affect other days", () => {
    useRamadanStore.getState().toggleFastingDay(5);
    const { fastingDays } = useRamadanStore.getState();
    expect(fastingDays[4]).toBe(false);
    expect(fastingDays[5]).toBe(true);
    expect(fastingDays[6]).toBe(false);
  });

  it("works for last day (index 29)", () => {
    useRamadanStore.getState().toggleFastingDay(29);
    expect(useRamadanStore.getState().fastingDays[29]).toBe(true);
  });
});

describe("toggleJuz", () => {
  it("adds juz number to completedJuz", () => {
    useRamadanStore.getState().toggleJuz(1);
    expect(useRamadanStore.getState().completedJuz).toContain(1);
  });

  it("removes juz number if already present", () => {
    useRamadanStore.getState().toggleJuz(1);
    useRamadanStore.getState().toggleJuz(1);
    expect(useRamadanStore.getState().completedJuz).not.toContain(1);
  });

  it("handles multiple juz additions", () => {
    useRamadanStore.getState().toggleJuz(1);
    useRamadanStore.getState().toggleJuz(15);
    useRamadanStore.getState().toggleJuz(30);
    expect(useRamadanStore.getState().completedJuz).toEqual([1, 15, 30]);
  });
});

describe("resetKhatma", () => {
  it("clears all completed juz", () => {
    useRamadanStore.getState().toggleJuz(1);
    useRamadanStore.getState().toggleJuz(2);
    useRamadanStore.getState().resetKhatma();
    expect(useRamadanStore.getState().completedJuz).toEqual([]);
  });
});

describe("toggleGoal", () => {
  it("creates new day entry if not present", () => {
    useRamadanStore.getState().toggleGoal(0, 0, 11);
    const goals = useRamadanStore.getState().dailyGoals[0];
    expect(goals).toBeDefined();
    expect(goals[0]).toBe(true);
  });

  it("toggles specific goal index", () => {
    useRamadanStore.getState().toggleGoal(0, 2, 11);
    expect(useRamadanStore.getState().dailyGoals[0][2]).toBe(true);
    useRamadanStore.getState().toggleGoal(0, 2, 11);
    expect(useRamadanStore.getState().dailyGoals[0][2]).toBe(false);
  });

  it("preserves other goals in same day", () => {
    useRamadanStore.getState().toggleGoal(0, 0, 11);
    useRamadanStore.getState().toggleGoal(0, 5, 11);
    const goals = useRamadanStore.getState().dailyGoals[0];
    expect(goals[0]).toBe(true);
    expect(goals[5]).toBe(true);
    expect(goals[1]).toBe(false);
  });

  it("initializes with correct totalGoals length", () => {
    useRamadanStore.getState().toggleGoal(3, 0, 11);
    const goals = useRamadanStore.getState().dailyGoals[3];
    expect(goals).toHaveLength(11);
  });
});

describe("tasbih", () => {
  it("incrementTasbih increments from 0 to 1", () => {
    useRamadanStore.getState().incrementTasbih();
    expect(useRamadanStore.getState().tasbihCount).toBe(1);
  });

  it("incrementTasbih increments from 99 to 100", () => {
    useRamadanStore.setState({ tasbihCount: 99 });
    useRamadanStore.getState().incrementTasbih();
    expect(useRamadanStore.getState().tasbihCount).toBe(100);
  });

  it("resetTasbih resets count to 0", () => {
    useRamadanStore.setState({ tasbihCount: 50 });
    useRamadanStore.getState().resetTasbih();
    expect(useRamadanStore.getState().tasbihCount).toBe(0);
  });

  it("setTasbihCount sets to arbitrary value", () => {
    useRamadanStore.getState().setTasbihCount(42);
    expect(useRamadanStore.getState().tasbihCount).toBe(42);
  });
});

describe("setSelectedCity", () => {
  it("changes city from default", () => {
    useRamadanStore.getState().setSelectedCity("Tripoli");
    expect(useRamadanStore.getState().selectedCity).toBe("Tripoli");
  });
});
