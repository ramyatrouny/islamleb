import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RAMADAN_2026, STORAGE_KEYS } from "./constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RamadanStore {
  // Fasting tracker (30 booleans, one per day)
  fastingDays: boolean[];
  toggleFastingDay: (dayIndex: number) => void;

  // Quran Khatma (set of completed juz numbers 1-30)
  completedJuz: number[];
  toggleJuz: (juz: number) => void;
  resetKhatma: () => void;

  // Daily spiritual goals (day index → array of completed goal indices)
  dailyGoals: Record<number, boolean[]>;
  toggleGoal: (dayIndex: number, goalIndex: number, totalGoals: number) => void;

  // Tasbih digital counter
  tasbihCount: number;
  incrementTasbih: () => void;
  resetTasbih: () => void;
  setTasbihCount: (count: number) => void;

  // Selected city for prayer times
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useRamadanStore = create<RamadanStore>()(
  persist(
    (set) => ({
      // ── Fasting ───────────────────────────────────────────────────────
      fastingDays: Array(RAMADAN_2026.TOTAL_DAYS).fill(false),
      toggleFastingDay: (dayIndex) =>
        set((state) => {
          const next = [...state.fastingDays];
          next[dayIndex] = !next[dayIndex];
          return { fastingDays: next };
        }),

      // ── Quran Khatma ─────────────────────────────────────────────────
      completedJuz: [],
      toggleJuz: (juz) =>
        set((state) => {
          const has = state.completedJuz.includes(juz);
          return {
            completedJuz: has
              ? state.completedJuz.filter((j) => j !== juz)
              : [...state.completedJuz, juz],
          };
        }),
      resetKhatma: () => set({ completedJuz: [] }),

      // ── Daily Goals ──────────────────────────────────────────────────
      dailyGoals: {},
      toggleGoal: (dayIndex, goalIndex, totalGoals) =>
        set((state) => {
          const current =
            state.dailyGoals[dayIndex] ?? Array(totalGoals).fill(false);
          const next = [...current];
          next[goalIndex] = !next[goalIndex];
          return { dailyGoals: { ...state.dailyGoals, [dayIndex]: next } };
        }),

      // ── Tasbih ───────────────────────────────────────────────────────
      tasbihCount: 0,
      incrementTasbih: () =>
        set((state) => ({ tasbihCount: state.tasbihCount + 1 })),
      resetTasbih: () => set({ tasbihCount: 0 }),
      setTasbihCount: (count) => set({ tasbihCount: count }),

      // ── City ─────────────────────────────────────────────────────────
      selectedCity: "Beirut",
      setSelectedCity: (city) => set({ selectedCity: city }),
    }),
    { name: STORAGE_KEYS.STORE, version: 1 },
  ),
);
