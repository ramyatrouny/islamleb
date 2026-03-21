# Year-Round Islamic Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform IslamLeb from a Ramadan-only app into a year-round Islamic companion with phase-aware UI, Sunnah fasting tracker, general duas, expanded hadiths, and adaptive navigation.

**Architecture:** Phase-gated approach — a single `getIslamicPhase()` function determines the current Islamic season, and all UI components branch on its result. During Ramadan, everything behaves identically to the current app. New store slices (`sunnahFasting`, `generalDailyGoals`) sit alongside existing data with a migration from store v1 to v2.

**Tech Stack:** Next.js 16 (App Router), TypeScript, React 19, Zustand 5 (persist middleware), Tailwind CSS v4, Framer Motion 12, Vitest 4, Aladhan API.

**Spec:** `docs/superpowers/specs/2026-03-21-year-round-islamic-companion-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/islamic-calendar.ts` | `IslamicPhase` type, `getIslamicPhase()`, `getNextIslamicEvent()`, `isRamadanSeason()` |
| Create | `src/__tests__/lib/islamic-calendar.test.ts` | Tests for phase detection and event lookup |
| Create | `src/__tests__/lib/store-migration.test.ts` | Tests for v1→v2 store migration |
| Modify | `src/lib/constants.ts` | Add `ISLAMIC_EVENTS` object |
| Modify | `src/lib/types.ts` | Add `Hadith` type alias, update `CountdownState` |
| Modify | `src/lib/countdown.ts` | Use `getIslamicPhase()`, rename `ramadanDay` → `eventDay` |
| Modify | `src/__tests__/lib/countdown.test.ts` | Update tests for new phase names and `eventDay` |
| Modify | `src/lib/date-utils.ts` | Add `getSunnahFastingDays()`, `getAyyamAlBeed()` |
| Modify | `src/lib/store.ts` | Add `sunnahFasting`, `generalDailyGoals`, migrate v1→v2, update `setSyncData` |
| Modify | `src/__tests__/lib/store.test.ts` | Add tests for new store slices |
| Modify | `src/lib/hadith-data.ts` | Add `generalHadiths` array |
| Modify | `src/lib/adhkar-data.ts` | Add `generalDuas` collection |
| Modify | `src/config/spiritual-goals.ts` | Split into `RAMADAN_SPIRITUAL_GOALS` + `GENERAL_SPIRITUAL_GOALS` |
| Modify | `src/config/navigation.ts` | Add `getVisibleNavItems()` + `getVisibleBottomNavItems()` |
| Modify | `src/components/header.tsx` | Use `getVisibleNavItems()` |
| Modify | `src/components/bottom-nav.tsx` | Use `getVisibleBottomNavItems()` |
| Modify | `src/app/page.tsx` | Phase-aware hero, countdown, quick access, hadith, banner |
| Modify | `src/app/tracker/page.tsx` | Dual-mode: Ramadan grid vs Sunnah monthly calendar |
| Modify | `src/app/adhkar/page.tsx` | Swap Ramadan duas tab for general duas outside Ramadan |
| Modify | `src/app/contact/page.tsx` | Adapt page selector to visible pages |

---

## Task 1: Islamic Calendar — Constants & Phase Detection

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/types.ts`
- Create: `src/lib/islamic-calendar.ts`
- Create: `src/__tests__/lib/islamic-calendar.test.ts`

- [ ] **Step 1: Add `ISLAMIC_EVENTS` to constants**

In `src/lib/constants.ts`, add after the `RAMADAN_2026` export:

```typescript
/** Key Islamic dates for 1447-1448 AH (approximate Gregorian equivalents) */
export const ISLAMIC_EVENTS = {
  // 1447 AH
  EID_AL_FITR_START: new Date(2026, 2, 20),    // Mar 20, 2026 (1 Shawwal)
  EID_AL_FITR_END: new Date(2026, 2, 23),       // Mar 22, 2026 (3 Shawwal)
  SHAWWAL_END: new Date(2026, 3, 18),            // Apr 18, 2026 (30 Shawwal)
  DHUL_HIJJAH_START: new Date(2026, 6, 17),      // Jul 17, 2026 (1 Dhul Hijjah)
  ARAFAH: new Date(2026, 6, 25),                 // Jul 25, 2026 (9 Dhul Hijjah)
  EID_AL_ADHA_START: new Date(2026, 6, 26),      // Jul 26, 2026 (10 Dhul Hijjah)
  EID_AL_ADHA_END: new Date(2026, 6, 30),        // Jul 29, 2026 (13 Dhul Hijjah)
  // 1448 AH (next Ramadan — approximate)
  NEXT_RAMADAN_START: new Date(2027, 1, 7),       // Feb 7, 2027 (estimated)
} as const;
```

- [ ] **Step 2: Update types**

In `src/lib/types.ts`, add the `IslamicPhase` type and `Hadith` alias, and update `CountdownState`:

```typescript
/** Islamic calendar phase */
export type IslamicPhase =
  | "before-ramadan"
  | "ramadan"
  | "eid-al-fitr"
  | "shawwal-fasting"
  | "dhul-hijjah"
  | "eid-al-adha"
  | "normal";

/** Hadith entry (general-purpose alias) */
export type Hadith = RamadanHadith;
```

- [ ] **Step 3: Write failing tests for islamic-calendar**

Create `src/__tests__/lib/islamic-calendar.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getIslamicPhase, getNextIslamicEvent, isRamadanSeason } from "@/lib/islamic-calendar";

describe("getIslamicPhase", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns 'ramadan' during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25));  // Feb 25
    expect(getIslamicPhase()).toBe("ramadan");
  });

  it("returns 'before-ramadan' 30 days before Ramadan", () => {
    vi.setSystemTime(new Date(2026, 0, 25));  // Jan 25 (24 days before Feb 18)
    expect(getIslamicPhase()).toBe("before-ramadan");
  });

  it("returns 'eid-al-fitr' on Mar 20 (1 Shawwal)", () => {
    vi.setSystemTime(new Date(2026, 2, 20));
    expect(getIslamicPhase()).toBe("eid-al-fitr");
  });

  it("returns 'eid-al-fitr' on Mar 22 (3 Shawwal)", () => {
    vi.setSystemTime(new Date(2026, 2, 22));
    expect(getIslamicPhase()).toBe("eid-al-fitr");
  });

  it("returns 'shawwal-fasting' on Mar 23 (4 Shawwal)", () => {
    vi.setSystemTime(new Date(2026, 2, 23));
    expect(getIslamicPhase()).toBe("shawwal-fasting");
  });

  it("returns 'dhul-hijjah' on Jul 17 (1 Dhul Hijjah)", () => {
    vi.setSystemTime(new Date(2026, 6, 17));
    expect(getIslamicPhase()).toBe("dhul-hijjah");
  });

  it("returns 'eid-al-adha' on Jul 26 (10 Dhul Hijjah)", () => {
    vi.setSystemTime(new Date(2026, 6, 26));
    expect(getIslamicPhase()).toBe("eid-al-adha");
  });

  it("returns 'normal' on May 15 (no special period)", () => {
    vi.setSystemTime(new Date(2026, 4, 15));
    expect(getIslamicPhase()).toBe("normal");
  });

  it("ramadan takes priority over before-ramadan overlap", () => {
    vi.setSystemTime(new Date(2026, 1, 18));  // Ramadan start
    expect(getIslamicPhase()).toBe("ramadan");
  });
});

describe("getNextIslamicEvent", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns Ramadan as next event before Ramadan", () => {
    vi.setSystemTime(new Date(2026, 0, 1));
    const event = getNextIslamicEvent();
    expect(event.name).toContain("رمضان");
  });

  it("returns Shawwal fasting after Eid al-Fitr", () => {
    vi.setSystemTime(new Date(2026, 2, 21));  // During Eid al-Fitr
    const event = getNextIslamicEvent();
    expect(event.name).toContain("شوال");
  });

  it("returns next Ramadan when all 1447 events have passed", () => {
    vi.setSystemTime(new Date(2026, 7, 15));  // Aug 15, after all events
    const event = getNextIslamicEvent();
    expect(event.name).toContain("رمضان");
    expect(event.date.getFullYear()).toBe(2027);
  });
});

describe("isRamadanSeason", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns true during before-ramadan", () => {
    vi.setSystemTime(new Date(2026, 0, 25));
    expect(isRamadanSeason()).toBe(true);
  });

  it("returns true during ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25));
    expect(isRamadanSeason()).toBe(true);
  });

  it("returns true during eid-al-fitr", () => {
    vi.setSystemTime(new Date(2026, 2, 20));
    expect(isRamadanSeason()).toBe(true);
  });

  it("returns false during normal", () => {
    vi.setSystemTime(new Date(2026, 4, 15));
    expect(isRamadanSeason()).toBe(false);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/lib/islamic-calendar.test.ts`
Expected: FAIL — module not found

- [ ] **Step 5: Implement islamic-calendar.ts**

Create `src/lib/islamic-calendar.ts`:

```typescript
import { RAMADAN_2026, ISLAMIC_EVENTS } from "./constants";
import { isRamadan } from "./date-utils";
import type { IslamicPhase } from "./types";

/**
 * Determine the current Islamic calendar phase.
 * Priority order: ramadan > eid-al-fitr > eid-al-adha > dhul-hijjah > shawwal-fasting > before-ramadan > normal
 */
export function getIslamicPhase(now: Date = new Date()): IslamicPhase {
  // 1. Ramadan (highest priority)
  if (isRamadan(now)) return "ramadan";

  // 2. Eid al-Fitr (1-3 Shawwal)
  if (now >= ISLAMIC_EVENTS.EID_AL_FITR_START && now < ISLAMIC_EVENTS.EID_AL_FITR_END) {
    return "eid-al-fitr";
  }

  // 3. Eid al-Adha (10-13 Dhul Hijjah)
  if (now >= ISLAMIC_EVENTS.EID_AL_ADHA_START && now < ISLAMIC_EVENTS.EID_AL_ADHA_END) {
    return "eid-al-adha";
  }

  // 4. Dhul Hijjah (1-9, before Eid)
  if (now >= ISLAMIC_EVENTS.DHUL_HIJJAH_START && now < ISLAMIC_EVENTS.EID_AL_ADHA_START) {
    return "dhul-hijjah";
  }

  // 5. Shawwal fasting (4-30 Shawwal)
  if (now >= ISLAMIC_EVENTS.EID_AL_FITR_END && now < ISLAMIC_EVENTS.SHAWWAL_END) {
    return "shawwal-fasting";
  }

  // 6. Before Ramadan (30 days before start)
  const thirtyDaysBefore = new Date(RAMADAN_2026.START);
  thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);
  if (now >= thirtyDaysBefore && now < RAMADAN_2026.START) {
    return "before-ramadan";
  }

  // 7. Normal (fallback)
  return "normal";
}

/** Upcoming Islamic events in chronological order */
const UPCOMING_EVENTS = [
  { name: "رمضان المبارك", date: RAMADAN_2026.START, hijriDate: "١ رمضان ١٤٤٧" },
  { name: "عيد الفطر", date: ISLAMIC_EVENTS.EID_AL_FITR_START, hijriDate: "١ شوال ١٤٤٧" },
  { name: "صيام ستة من شوال", date: ISLAMIC_EVENTS.EID_AL_FITR_END, hijriDate: "٤ شوال ١٤٤٧" },
  { name: "عشر ذي الحجة", date: ISLAMIC_EVENTS.DHUL_HIJJAH_START, hijriDate: "١ ذو الحجة ١٤٤٧" },
  { name: "يوم عرفة", date: ISLAMIC_EVENTS.ARAFAH, hijriDate: "٩ ذو الحجة ١٤٤٧" },
  { name: "عيد الأضحى", date: ISLAMIC_EVENTS.EID_AL_ADHA_START, hijriDate: "١٠ ذو الحجة ١٤٤٧" },
  { name: "رمضان المبارك", date: ISLAMIC_EVENTS.NEXT_RAMADAN_START, hijriDate: "١ رمضان ١٤٤٨" },
];

/**
 * Get the next upcoming Islamic event.
 * If all known events have passed, estimates next Ramadan by adding ~354 days.
 */
export function getNextIslamicEvent(
  now: Date = new Date()
): { name: string; date: Date; hijriDate: string } {
  for (const event of UPCOMING_EVENTS) {
    if (event.date > now) return event;
  }
  // Fallback: estimate next Ramadan (~354 days after last known Ramadan)
  const estimated = new Date(ISLAMIC_EVENTS.NEXT_RAMADAN_START);
  estimated.setDate(estimated.getDate() + 354);
  return { name: "رمضان المبارك", date: estimated, hijriDate: "١ رمضان ١٤٤٩" };
}

/** True during before-ramadan, ramadan, or eid-al-fitr phases */
export function isRamadanSeason(now?: Date): boolean {
  const phase = getIslamicPhase(now);
  return phase === "before-ramadan" || phase === "ramadan" || phase === "eid-al-fitr";
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/lib/islamic-calendar.test.ts`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/constants.ts src/lib/types.ts src/lib/islamic-calendar.ts src/__tests__/lib/islamic-calendar.test.ts
git commit -m "feat: add Islamic calendar phase detection system"
```

---

## Task 2: Update Countdown System

**Files:**
- Modify: `src/lib/countdown.ts`
- Modify: `src/__tests__/lib/countdown.test.ts`

- [ ] **Step 1: Update countdown.ts**

Replace `src/lib/countdown.ts` with:

```typescript
import { RAMADAN_2026 } from "./constants";
import { getTimeRemaining, getRamadanDay, getTodayIftar, isRamadan } from "./date-utils";
import { getIslamicPhase, getNextIslamicEvent } from "./islamic-calendar";
import type { IslamicPhase, TimeRemaining } from "./types";

export interface CountdownState {
  phase: IslamicPhase;
  timeLeft: TimeRemaining;
  eventDay: number;
}

/** Compute the current countdown state based on Islamic calendar phase */
export function computeCountdownState(maghribTime?: string | null): CountdownState {
  const now = new Date();
  const phase = getIslamicPhase(now);

  switch (phase) {
    case "before-ramadan":
      return {
        phase,
        timeLeft: getTimeRemaining(RAMADAN_2026.START),
        eventDay: Math.ceil((RAMADAN_2026.START.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      };

    case "ramadan": {
      const iftar = getTodayIftar(maghribTime ?? undefined);
      return {
        phase,
        timeLeft: now < iftar ? getTimeRemaining(iftar) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
        eventDay: getRamadanDay(now),
      };
    }

    case "eid-al-fitr":
    case "eid-al-adha":
      return {
        phase,
        timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        eventDay: 0,
      };

    default: {
      // normal, shawwal-fasting, dhul-hijjah — countdown to next event
      const nextEvent = getNextIslamicEvent(now);
      return {
        phase,
        timeLeft: getTimeRemaining(nextEvent.date),
        eventDay: 0,
      };
    }
  }
}
```

- [ ] **Step 2: Update countdown tests**

Replace `src/__tests__/lib/countdown.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { computeCountdownState } from "@/lib/countdown";

describe("computeCountdownState", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns phase "before-ramadan" when 30 days before Ramadan', () => {
    vi.setSystemTime(new Date(2026, 0, 25)); // Jan 25
    const result = computeCountdownState();
    expect(result.phase).toBe("before-ramadan");
    expect(result.timeLeft.days).toBeGreaterThan(0);
  });

  it('returns phase "ramadan" during Ramadan', () => {
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // Feb 25 10am
    const result = computeCountdownState();
    expect(result.phase).toBe("ramadan");
  });

  it("returns correct eventDay during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 10, 0, 0)); // Feb 25 = day 8
    const result = computeCountdownState();
    expect(result.eventDay).toBe(8);
  });

  it("returns iftar countdown when before iftar during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25, 12, 0, 0));
    const result = computeCountdownState("18:00");
    expect(result.phase).toBe("ramadan");
    expect(result.timeLeft.hours).toBeGreaterThan(0);
  });

  it('returns phase "eid-al-fitr" after Ramadan', () => {
    vi.setSystemTime(new Date(2026, 2, 20));
    const result = computeCountdownState();
    expect(result.phase).toBe("eid-al-fitr");
    expect(result.eventDay).toBe(0);
  });

  it('returns phase "normal" in May', () => {
    vi.setSystemTime(new Date(2026, 4, 15));
    const result = computeCountdownState();
    expect(result.phase).toBe("normal");
    expect(result.timeLeft.days).toBeGreaterThan(0);
  });

  it('returns phase "dhul-hijjah" in early Dhul Hijjah', () => {
    vi.setSystemTime(new Date(2026, 6, 20));
    const result = computeCountdownState();
    expect(result.phase).toBe("dhul-hijjah");
  });

  it('returns phase "eid-al-adha" on Eid day', () => {
    vi.setSystemTime(new Date(2026, 6, 26));
    const result = computeCountdownState();
    expect(result.phase).toBe("eid-al-adha");
    expect(result.eventDay).toBe(0);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/__tests__/lib/countdown.test.ts`
Expected: All PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/countdown.ts src/__tests__/lib/countdown.test.ts
git commit -m "feat: update countdown to use Islamic calendar phases"
```

---

## Task 3: Store Migration — Sunnah Fasting & General Goals

**Files:**
- Modify: `src/lib/store.ts`
- Modify: `src/__tests__/lib/store.test.ts`
- Create: `src/__tests__/lib/store-migration.test.ts`

- [ ] **Step 1: Update store with new slices and migration**

In `src/lib/store.ts`:

1. Add to the `RamadanStore` interface (keep existing, add after `setSyncData`):
```typescript
  // Sunnah fasting (keyed by "YYYY-MM")
  sunnahFasting: Record<string, boolean[]>;
  toggleSunnahFasting: (yearMonth: string, dayIndex: number, daysInMonth: number) => void;

  // General daily goals (keyed by "YYYY-MM-DD")
  generalDailyGoals: Record<string, boolean[]>;
  toggleGeneralGoal: (dateKey: string, goalIndex: number, totalGoals: number) => void;
```

2. Add implementations in the store creator (after `setSyncData`):
```typescript
      // ── Sunnah fasting ──────────────────────────────────────────────
      sunnahFasting: {},
      toggleSunnahFasting: (yearMonth, dayIndex, daysInMonth) =>
        set((state) => {
          const current = state.sunnahFasting[yearMonth] ?? Array(daysInMonth).fill(false);
          const next = [...current];
          next[dayIndex] = !next[dayIndex];
          return { sunnahFasting: { ...state.sunnahFasting, [yearMonth]: next } };
        }),

      // ── General daily goals ─────────────────────────────────────────
      generalDailyGoals: {},
      toggleGeneralGoal: (dateKey, goalIndex, totalGoals) =>
        set((state) => {
          const current = state.generalDailyGoals[dateKey] ?? Array(totalGoals).fill(false);
          const next = [...current];
          next[goalIndex] = !next[goalIndex];
          return { generalDailyGoals: { ...state.generalDailyGoals, [dateKey]: next } };
        }),
```

3. Update `setSyncData` to include new fields:
```typescript
      setSyncData: (data) =>
        set({
          fastingDays: data.fastingDays,
          completedJuz: data.completedJuz,
          dailyGoals: data.dailyGoals,
          tasbihCount: data.tasbihCount,
          selectedCity: data.selectedCity,
          sunnahFasting: data.sunnahFasting ?? {},
          generalDailyGoals: data.generalDailyGoals ?? {},
          lastSyncedAt: Date.now(),
        }),
```

Also update the `setSyncData` type signature to include the new optional fields:
```typescript
  setSyncData: (data: {
    fastingDays: boolean[];
    completedJuz: number[];
    dailyGoals: Record<number, boolean[]>;
    tasbihCount: number;
    selectedCity: string;
    sunnahFasting?: Record<string, boolean[]>;
    generalDailyGoals?: Record<string, boolean[]>;
  }) => void;
```

4. Update persist config (replace `{ name: STORAGE_KEYS.STORE, version: 1 }`):
```typescript
    {
      name: STORAGE_KEYS.STORE,
      version: 2,
      migrate: (persisted, version) => {
        if (version === 1) {
          return { ...(persisted as Record<string, unknown>), sunnahFasting: {}, generalDailyGoals: {} };
        }
        return persisted as RamadanStore;
      },
    },
```

- [ ] **Step 2: Write store migration test**

Create `src/__tests__/lib/store-migration.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("store migration v1 → v2", () => {
  it("adds sunnahFasting and generalDailyGoals to v1 state", () => {
    const v1State = {
      fastingDays: Array(30).fill(false),
      completedJuz: [1, 2],
      dailyGoals: {},
      tasbihCount: 5,
      selectedCity: "Beirut",
      lastSyncedAt: 0,
    };

    // Simulate migration
    const migrated = { ...v1State, sunnahFasting: {}, generalDailyGoals: {} };

    expect(migrated.sunnahFasting).toEqual({});
    expect(migrated.generalDailyGoals).toEqual({});
    expect(migrated.completedJuz).toEqual([1, 2]); // preserved
    expect(migrated.tasbihCount).toBe(5); // preserved
  });
});
```

- [ ] **Step 3: Update existing store tests**

In `src/__tests__/lib/store.test.ts`, update the `beforeEach` reset to include new fields:
```typescript
beforeEach(() => {
  useRamadanStore.setState({
    fastingDays: Array(30).fill(false),
    completedJuz: [],
    dailyGoals: {},
    tasbihCount: 0,
    selectedCity: "Beirut",
    sunnahFasting: {},
    generalDailyGoals: {},
  });
});
```

Add new test blocks:
```typescript
describe("toggleSunnahFasting", () => {
  it("toggles a day in a month", () => {
    const { toggleSunnahFasting } = useRamadanStore.getState();
    toggleSunnahFasting("2026-04", 5, 30);
    const month = useRamadanStore.getState().sunnahFasting["2026-04"];
    expect(month?.[5]).toBe(true);
    expect(month?.[0]).toBe(false);
  });

  it("toggles back to false", () => {
    const { toggleSunnahFasting } = useRamadanStore.getState();
    toggleSunnahFasting("2026-04", 5, 30);
    toggleSunnahFasting("2026-04", 5, 30);
    expect(useRamadanStore.getState().sunnahFasting["2026-04"]?.[5]).toBe(false);
  });
});

describe("toggleGeneralGoal", () => {
  it("toggles a goal for a date", () => {
    const { toggleGeneralGoal } = useRamadanStore.getState();
    toggleGeneralGoal("2026-04-15", 2, 9);
    const goals = useRamadanStore.getState().generalDailyGoals["2026-04-15"];
    expect(goals?.[2]).toBe(true);
    expect(goals?.[0]).toBe(false);
  });
});
```

- [ ] **Step 4: Run all store tests**

Run: `npx vitest run src/__tests__/lib/store.test.ts src/__tests__/lib/store-migration.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/store.ts src/__tests__/lib/store.test.ts src/__tests__/lib/store-migration.test.ts
git commit -m "feat: add sunnah fasting and general goals store slices with v1→v2 migration"
```

---

## Task 4: Content Data — General Hadiths, Duas, Spiritual Goals

**Files:**
- Modify: `src/lib/hadith-data.ts`
- Modify: `src/lib/adhkar-data.ts`
- Modify: `src/config/spiritual-goals.ts`

- [ ] **Step 1: Add general hadiths**

In `src/lib/hadith-data.ts`, add after the `ramadanHadiths` array:

```typescript
/** Year-round hadiths for non-Ramadan periods */
export const generalHadiths: RamadanHadith[] = [
  {
    id: 101,
    text: "قال رسول الله ﷺ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    source: "متفق عليه",
    topic: "الإخلاص",
  },
  {
    id: 102,
    text: "قال رسول الله ﷺ: مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    source: "رواه مسلم",
    topic: "طلب العلم",
  },
  {
    id: 103,
    text: "قال رسول الله ﷺ: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    source: "رواه البخاري",
    topic: "القرآن",
  },
  {
    id: 104,
    text: "قال رسول الله ﷺ: الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    source: "متفق عليه",
    topic: "الأخلاق",
  },
  {
    id: 105,
    text: "قال رسول الله ﷺ: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    source: "متفق عليه",
    topic: "الأخوة",
  },
  {
    id: 106,
    text: "قال رسول الله ﷺ: مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    source: "متفق عليه",
    topic: "حفظ اللسان",
  },
  {
    id: 107,
    text: "قال رسول الله ﷺ: إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الأَمْرِ كُلِّهِ",
    source: "متفق عليه",
    topic: "الرفق",
  },
  {
    id: 108,
    text: "قال رسول الله ﷺ: الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ",
    source: "رواه مسلم",
    topic: "الإيمان",
  },
  {
    id: 109,
    text: "قال رسول الله ﷺ: بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ",
    source: "متفق عليه",
    topic: "أركان الإسلام",
  },
  {
    id: 110,
    text: "قال رسول الله ﷺ: مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    source: "رواه مسلم",
    topic: "الصدقة",
  },
  {
    id: 111,
    text: "قال رسول الله ﷺ: اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    source: "رواه الترمذي",
    topic: "التقوى",
  },
  {
    id: 112,
    text: "قال رسول الله ﷺ: الدُّعَاءُ هُوَ الْعِبَادَةُ",
    source: "رواه الترمذي",
    topic: "الدعاء",
  },
  {
    id: 113,
    text: "قال رسول الله ﷺ: أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    source: "متفق عليه",
    topic: "المداومة",
  },
  {
    id: 114,
    text: "قال رسول الله ﷺ: إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    source: "رواه مسلم",
    topic: "الإخلاص",
  },
  {
    id: 115,
    text: "قال رسول الله ﷺ: مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ بَعَّدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا",
    source: "متفق عليه",
    topic: "فضل الصيام",
  },
  {
    id: 116,
    text: "قال رسول الله ﷺ: أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ",
    source: "رواه مسلم",
    topic: "الصلاة",
  },
  {
    id: 117,
    text: "قال رسول الله ﷺ: كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    source: "متفق عليه",
    topic: "الذكر",
  },
  {
    id: 118,
    text: "قال رسول الله ﷺ: مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
    source: "متفق عليه",
    topic: "الصلاة",
  },
  {
    id: 119,
    text: "قال رسول الله ﷺ: الصَّبْرُ ضِيَاءٌ",
    source: "رواه مسلم",
    topic: "الصبر",
  },
  {
    id: 120,
    text: "قال رسول الله ﷺ: مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ",
    source: "متفق عليه",
    topic: "طلب العلم",
  },
  {
    id: 121,
    text: "قال رسول الله ﷺ: خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    source: "رواه الطبراني",
    topic: "خدمة الناس",
  },
  {
    id: 122,
    text: "قال رسول الله ﷺ: تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    source: "رواه الترمذي",
    topic: "الصدقة",
  },
  {
    id: 123,
    text: "قال رسول الله ﷺ: الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
    source: "متفق عليه",
    topic: "الأخوة",
  },
  {
    id: 124,
    text: "قال رسول الله ﷺ: لَا تَحَاسَدُوا، وَلَا تَنَاجَشُوا، وَلَا تَبَاغَضُوا، وَلَا تَدَابَرُوا، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا",
    source: "رواه مسلم",
    topic: "الأخوة",
  },
  {
    id: 125,
    text: "قال رسول الله ﷺ: مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا",
    source: "رواه الترمذي",
    topic: "القرآن",
  },
  {
    id: 126,
    text: "قال رسول الله ﷺ: خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي",
    source: "رواه الترمذي",
    topic: "الأسرة",
  },
  {
    id: 127,
    text: "قال رسول الله ﷺ: مَا مِنْ مُسْلِمٍ يَغْرِسُ غَرْسًا أَوْ يَزْرَعُ زَرْعًا فَيَأْكُلُ مِنْهُ طَيْرٌ أَوْ إِنْسَانٌ أَوْ بَهِيمَةٌ إِلَّا كَانَ لَهُ بِهِ صَدَقَةٌ",
    source: "متفق عليه",
    topic: "العمل الصالح",
  },
  {
    id: 128,
    text: "قال رسول الله ﷺ: إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    source: "رواه مسلم",
    topic: "الصدقة الجارية",
  },
  {
    id: 129,
    text: "قال رسول الله ﷺ: مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ",
    source: "رواه مسلم",
    topic: "صيام شوال",
  },
  {
    id: 130,
    text: "قال رسول الله ﷺ: رَغِمَ أَنْفُ رَجُلٍ ذُكِرْتُ عِنْدَهُ فَلَمْ يُصَلِّ عَلَيَّ",
    source: "رواه الترمذي",
    topic: "الصلاة على النبي",
  },
];
```

- [ ] **Step 2: Add general duas**

In `src/lib/adhkar-data.ts`, add a new `generalDuas` key to the `adhkarData` object:

```typescript
  generalDuas: {
    name: "أدعية عامة",
    items: [
      {
        id: "general-dua-1",
        text: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ",
        count: 1,
        source: "رواه البخاري — دعاء الاستخارة",
      },
      {
        id: "general-dua-2",
        text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        count: 3,
        source: "رواه أبو داود — دعاء الحفظ",
      },
      {
        id: "general-dua-3",
        text: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        count: 1,
        source: "رواه أبو داود — دعاء الخروج من المنزل",
      },
      {
        id: "general-dua-4",
        text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        count: 1,
        source: "متفق عليه — دعاء دخول الخلاء",
      },
      {
        id: "general-dua-5",
        text: "بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        count: 1,
        source: "رواه البخاري — دعاء النوم",
      },
      {
        id: "general-dua-6",
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        count: 1,
        source: "رواه البخاري — دعاء الاستيقاظ",
      },
      {
        id: "general-dua-7",
        text: "بِسْمِ اللَّهِ، اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
        count: 1,
        source: "رواه ابن السني — دعاء قبل الطعام",
      },
      {
        id: "general-dua-8",
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        count: 1,
        source: "رواه أبو داود — دعاء بعد الطعام",
      },
      {
        id: "general-dua-9",
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
        count: 1,
        source: "رواه ابن ماجه — دعاء بعد الفجر",
      },
      {
        id: "general-dua-10",
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        count: 100,
        source: "متفق عليه — التسبيح",
      },
      {
        id: "general-dua-11",
        text: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        count: 1,
        source: "سورة إبراهيم: ٤١ — دعاء للوالدين",
      },
      {
        id: "general-dua-12",
        text: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ",
        count: 1,
        source: "رواه مسلم — دعاء للميت",
      },
    ],
  },
```

- [ ] **Step 3: Split spiritual goals**

Replace `src/config/spiritual-goals.ts`:

```typescript
/** Ramadan-specific spiritual goals */
export const RAMADAN_SPIRITUAL_GOALS = [
  "صلاة الفجر في وقتها",
  "صلاة الظهر في وقتها",
  "صلاة العصر في وقتها",
  "صلاة المغرب في وقتها",
  "صلاة العشاء في وقتها",
  "صلاة التراويح",
  "قراءة الجزء اليومي",
  "أذكار الصباح",
  "أذكار المساء",
  "صدقة اليوم",
  "تجنب الغيبة والنميمة",
] as const;

/** Year-round spiritual goals (outside Ramadan) */
export const GENERAL_SPIRITUAL_GOALS = [
  "صلاة الفجر في وقتها",
  "صلاة الظهر في وقتها",
  "صلاة العصر في وقتها",
  "صلاة المغرب في وقتها",
  "صلاة العشاء في وقتها",
  "صلاة الضحى",
  "صيام السنّة",
  "أذكار الصباح",
  "أذكار المساء",
  "صدقة اليوم",
  "تجنب الغيبة والنميمة",
] as const;

/** @deprecated Use RAMADAN_SPIRITUAL_GOALS instead */
export const SPIRITUAL_GOALS = RAMADAN_SPIRITUAL_GOALS;
```

- [ ] **Step 4: Run the full test suite to verify nothing broke**

Run: `npx vitest run`
Expected: All existing tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/hadith-data.ts src/lib/adhkar-data.ts src/config/spiritual-goals.ts
git commit -m "feat: add general hadiths, general duas, and year-round spiritual goals"
```

---

## Task 5: Navigation — Phase-Aware Visibility

**Files:**
- Modify: `src/config/navigation.ts`
- Modify: `src/components/header.tsx`
- Modify: `src/components/bottom-nav.tsx`

- [ ] **Step 1: Add getVisibleNavItems to navigation.ts**

Replace `src/config/navigation.ts`:

```typescript
import {
  Home,
  Clock,
  BookOpen,
  Heart,
  CalendarDays,
  Calculator,
  HandHeart,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import type { NavItem } from "@/lib/types";
import type { IslamicPhase } from "@/lib/types";

/** Full navigation items (superset) */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/prayer-times", label: "مواقيت الصلاة", icon: Clock },
  { href: "/quran", label: "القرآن الكريم", icon: BookOpen },
  { href: "/ayat-al-kursi", label: "آية الكرسي", icon: ShieldCheck },
  { href: "/adhkar", label: "الأذكار", icon: Heart },
  { href: "/tracker", label: "المتتبع", icon: CalendarDays },
  { href: "/zakat", label: "حاسبة الزكاة", icon: Calculator },
  { href: "/calendar", label: "التقويم", icon: HandHeart },
  { href: "/contact", label: "تواصل معنا", icon: MessageCircle },
];

/** Full bottom nav items (superset) */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/prayer-times", label: "الصلاة", icon: Clock },
  { href: "/quran", label: "القرآن", icon: BookOpen },
  { href: "/adhkar", label: "الأذكار", icon: Heart },
  { href: "/tracker", label: "المتتبع", icon: CalendarDays },
];

const RAMADAN_PHASES: IslamicPhase[] = ["before-ramadan", "ramadan"];

/** Get visible nav items based on current Islamic phase */
export function getVisibleNavItems(phase: IslamicPhase): NavItem[] {
  const isRamadan = RAMADAN_PHASES.includes(phase);
  return NAV_ITEMS
    .filter((item) => {
      // Hide calendar outside Ramadan
      if (item.href === "/calendar" && !isRamadan) return false;
      return true;
    })
    .map((item) => {
      // Rename tracker outside Ramadan
      if (item.href === "/tracker" && !isRamadan) {
        return { ...item, label: "صيام السنّة" };
      }
      return item;
    });
}

/** Get visible bottom nav items based on current Islamic phase */
export function getVisibleBottomNavItems(phase: IslamicPhase): NavItem[] {
  const isRamadan = RAMADAN_PHASES.includes(phase);
  return BOTTOM_NAV_ITEMS.map((item) => {
    if (item.href === "/tracker" && !isRamadan) {
      return { ...item, label: "السنّة" };
    }
    return item;
  });
}
```

- [ ] **Step 2: Update header.tsx to use phase-aware nav**

In `src/components/header.tsx`:

1. Add import at the top:
```typescript
import { getVisibleNavItems } from "@/config/navigation";
import { getIslamicPhase } from "@/lib/islamic-calendar";
import { useHydrated } from "@/hooks/use-hydrated";
```

2. Remove the import of `NAV_ITEMS` (replace usage):
```typescript
// Remove: import { NAV_ITEMS } from "@/config/navigation";
```

3. Inside the `Header` component, add:
```typescript
  const mounted = useHydrated();
  const navItems = mounted ? getVisibleNavItems(getIslamicPhase()) : NAV_ITEMS;
```

4. Replace both `NAV_ITEMS.map(` occurrences (desktop nav line 42 and drawer nav line 168) with `navItems.map(`.

- [ ] **Step 3: Update bottom-nav.tsx to use phase-aware nav**

In `src/components/bottom-nav.tsx`:

1. Add imports:
```typescript
import { getVisibleBottomNavItems } from "@/config/navigation";
import { getIslamicPhase } from "@/lib/islamic-calendar";
import { useHydrated } from "@/hooks/use-hydrated";
```

2. Remove `BOTTOM_NAV_ITEMS` import.

3. Inside the `BottomNav` component, add:
```typescript
  const mounted = useHydrated();
  const items = mounted ? getVisibleBottomNavItems(getIslamicPhase()) : BOTTOM_NAV_ITEMS;
```

4. Replace `BOTTOM_NAV_ITEMS.map(` with `items.map(`.

Note: Keep `BOTTOM_NAV_ITEMS` imported as the SSR fallback in the same file — or import it alongside the new function.

- [ ] **Step 4: Run existing nav tests**

Run: `npx vitest run src/__tests__/components/bottom-nav.test.tsx src/__tests__/components/header.test.tsx`
Expected: PASS (tests may need minor updates if they assert specific label text)

- [ ] **Step 5: Commit**

```bash
git add src/config/navigation.ts src/components/header.tsx src/components/bottom-nav.tsx
git commit -m "feat: phase-aware navigation with adaptive labels and visibility"
```

---

## Task 6: Home Page — Phase-Aware Transformation

**Files:**
- Modify: `src/app/page.tsx`

This is the largest single-file change. The home page gets conditional rendering for hero, countdown, quick access, hadith, and banner sections.

- [ ] **Step 1: Update imports in page.tsx**

Add at the top of `src/app/page.tsx`:
```typescript
import { Landmark } from "lucide-react";  // Mosque/minaret icon for non-Ramadan
import { getIslamicPhase, getNextIslamicEvent, isRamadanSeason } from "@/lib/islamic-calendar";
import { generalHadiths } from "@/lib/hadith-data";
import type { IslamicPhase } from "@/lib/types";
```

- [ ] **Step 2: Add phase-aware quick access items**

After the existing `quickAccessItems` array, add:

```typescript
const yearRoundQuickAccessItems = [
  {
    title: "مواقيت الصلاة",
    description: "أوقات الصلاة اليومية لمدينتك",
    icon: Clock,
    href: "/prayer-times",
  },
  {
    title: "القرآن الكريم",
    description: "تلاوة وتصفح المصحف الشريف",
    icon: BookOpen,
    href: "/quran",
  },
  {
    title: "الأذكار والأدعية",
    description: "أذكار الصباح والمساء والأدعية اليومية",
    icon: Heart,
    href: "/adhkar",
  },
  {
    title: "حاسبة الزكاة",
    description: "احسب زكاة مالك بسهولة",
    icon: Calculator,
    href: "/zakat",
  },
  {
    title: "صيام السنّة",
    description: "تتبع صيام الإثنين والخميس وأيام البيض",
    icon: CalendarDays,
    href: "/tracker",
  },
];
```

- [ ] **Step 3: Update the HomePage component state**

In the `HomePage` component, after the existing state declarations, add:

```typescript
  const currentPhase = mounted ? getIslamicPhase() : ("normal" as IslamicPhase);
  const isRamadanTime = currentPhase === "ramadan" || currentPhase === "before-ramadan";
  const isEid = currentPhase === "eid-al-fitr" || currentPhase === "eid-al-adha";

  const activeQuickAccess = isRamadanTime ? quickAccessItems : yearRoundQuickAccessItems;

  const dailyHadith = useMemo(() => {
    const source = isRamadanTime ? ramadanHadiths : generalHadiths;
    return source[getDailyHadithIndex() % source.length];
  }, [isRamadanTime]);
```

Remove the old `dailyHadith` useMemo.

- [ ] **Step 4: Update Hero Section**

Replace the hero section (between `{/* ===================== HERO SECTION ===================== */}` and the countdown section) with phase-aware rendering:

The key changes:
- When `isRamadanTime`: render current hero (Moon icon, "رمضان كريم", Ramadan subtitle) — keep existing code exactly
- When `isEid` and `currentPhase === "eid-al-fitr"`: render "عيد الفطر مبارك" with "لا تنسوا صيام ست من شوال" subtitle
- When `isEid` and `currentPhase === "eid-al-adha"`: render "عيد الأضحى مبارك" with "تقبل الله منا ومنكم" subtitle
- Otherwise (`normal`, `shawwal-fasting`, `dhul-hijjah`): render `Landmark` icon, "إسلام لبنان" heading, "رفيقك الإسلامي الرقمي" subtitle

Use the same motion animations, gradient styles, and star decorations for all variants.

- [ ] **Step 5: Update Countdown Section**

Replace the countdown section with phase-aware logic:

- `before-ramadan`: Same as current `before` (countdown to Ramadan, label "الوقت المتبقي لشهر رمضان المبارك")
- `ramadan`: Same as current `during` (day counter + iftar countdown)
- `eid-al-fitr` / `eid-al-adha`: Same celebration display as current `after`, but with appropriate Eid message
- `shawwal-fasting`, `dhul-hijjah`, `normal`: Show countdown to next event with the event name above. Use `getNextIslamicEvent()` to get the event name and display "الوقت المتبقي حتى {eventName}".

Replace `phase === "after"` checks with `isEid` and `phase !== "after"` with appropriate phase checks.

- [ ] **Step 6: Update Quick Access Grid**

Replace `quickAccessItems.map(` with `activeQuickAccess.map(`.

- [ ] **Step 7: Update Info Banner**

Replace the hardcoded Ramadan dates in the info banner with:

```typescript
{isRamadanTime ? (
  <p ...>رمضان 2026 يبدأ يوم الأربعاء 18 فبراير 2026 وينتهي يوم الخميس 19 مارس 2026</p>
) : (
  <p ...>{(() => {
    const next = getNextIslamicEvent();
    return `الحدث القادم: ${next.name} — ${next.hijriDate}`;
  })()}</p>
)}
```

- [ ] **Step 8: Run the dev server and verify**

Run: `npx next dev`
Verify: The home page shows "إسلام لبنان" hero (since today is after Eid), general hadith, year-round quick access, and next event countdown.

- [ ] **Step 9: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: phase-aware home page with year-round Islamic dashboard"
```

---

## Task 7: Adhkar Page — General Duas Tab

**Files:**
- Modify: `src/app/adhkar/page.tsx`

- [ ] **Step 1: Update imports**

Add at the top:
```typescript
import { isRamadanSeason } from "@/lib/islamic-calendar";
import { useHydrated } from "@/hooks/use-hydrated";
```

- [ ] **Step 2: Add phase-aware data selection**

After the existing data constants (`morningAdhkar`, `eveningAdhkar`, `ramadanDuas`), add:

```typescript
const generalDuasList = adhkarData.generalDuas.items;
```

Inside the component, add:
```typescript
  const mounted = useHydrated();
  const showRamadanDuas = mounted ? isRamadanSeason() : true;
  const thirdTabData = showRamadanDuas ? ramadanDuas : generalDuasList;
  const thirdTabLabel = showRamadanDuas ? "أدعية رمضان" : "أدعية عامة";
  const thirdTabIcon = showRamadanDuas ? BookOpen : Sparkles;
```

- [ ] **Step 3: Update the Tabs component**

Find the third `TabsTrigger` and `TabsContent` that reference Ramadan duas. Replace:
- The tab trigger label with `{thirdTabLabel}`
- The tab trigger icon with the `thirdTabIcon`
- The data source with `thirdTabData` instead of `ramadanDuas`

Also update the `allAdhkar` computation to be dynamic:
```typescript
const allAdhkar = [...morningAdhkar, ...eveningAdhkar, ...thirdTabData];
```

- [ ] **Step 4: Run dev server and verify**

Open `/adhkar` — the third tab should show "أدعية عامة" with general duas.

- [ ] **Step 5: Commit**

```bash
git add src/app/adhkar/page.tsx
git commit -m "feat: swap Ramadan duas tab for general duas outside Ramadan"
```

---

## Task 8: Fasting Tracker — Dual-Mode (Ramadan + Sunnah)

**Files:**
- Modify: `src/app/tracker/page.tsx`
- Modify: `src/lib/date-utils.ts` (add getSunnahFastingDays)

This is the most complex UI change. The tracker page needs two completely different views.

- [ ] **Step 1: Add Sunnah fasting day helpers to date-utils.ts**

Add at the bottom of `src/lib/date-utils.ts`:

```typescript
/**
 * Get recommended Sunnah fasting days for a Gregorian month.
 * Returns an array of day numbers (1-based) that are Mondays or Thursdays.
 */
export function getSunnahFastingDays(year: number, month: number): number[] {
  const days: number[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    // Monday = 1, Thursday = 4
    if (dow === 1 || dow === 4) days.push(d);
  }
  return days;
}
```

- [ ] **Step 2: Add Sunnah fasting mode to tracker page**

In `src/app/tracker/page.tsx`, add imports:
```typescript
import { getIslamicPhase, isRamadanSeason } from "@/lib/islamic-calendar";
import { getSunnahFastingDays } from "@/lib/date-utils";
import { RAMADAN_SPIRITUAL_GOALS, GENERAL_SPIRITUAL_GOALS } from "@/config/spiritual-goals";
```

Add state for month navigation:
```typescript
const [viewDate, setViewDate] = useState(() => new Date());
const viewYear = viewDate.getFullYear();
const viewMonth = viewDate.getMonth() + 1; // 1-based
const yearMonth = `${viewYear}-${String(viewMonth).padStart(2, "0")}`;
const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();

const isRamadanMode = mounted ? (getIslamicPhase() === "ramadan" || getIslamicPhase() === "before-ramadan") : true;
const sunnahDays = getSunnahFastingDays(viewYear, viewMonth);

// Sunnah store
const sunnahFasting = useRamadanStore((s) => s.sunnahFasting);
const toggleSunnahFasting = useRamadanStore((s) => s.toggleSunnahFasting);
const monthFasting = sunnahFasting[yearMonth] ?? Array(daysInMonth).fill(false);

// General goals
const generalDailyGoals = useRamadanStore((s) => s.generalDailyGoals);
const toggleGeneralGoal = useRamadanStore((s) => s.toggleGeneralGoal);
const today = new Date().toISOString().slice(0, 10);
const activeGoals = isRamadanMode ? RAMADAN_SPIRITUAL_GOALS : GENERAL_SPIRITUAL_GOALS;
```

- [ ] **Step 3: Build the Sunnah monthly calendar grid**

Create a `SunnahCalendarGrid` component inside the tracker file (or extract later):

```typescript
function SunnahCalendarGrid({
  daysInMonth,
  firstDayOfWeek,
  monthFasting,
  sunnahDays,
  onToggle,
}: {
  daysInMonth: number;
  firstDayOfWeek: number;
  monthFasting: boolean[];
  sunnahDays: number[];
  onToggle: (dayIndex: number) => void;
}) {
  const weekDays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const fasted = monthFasting[i] ?? false;
          const isSunnah = sunnahDays.includes(dayNum);
          return (
            <button
              key={dayNum}
              onClick={() => onToggle(i)}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                fasted
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : isSunnah
                    ? "border border-[#d4a574]/30 text-[#d4a574]/70 hover:bg-[#d4a574]/10"
                    : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              {toArabicNumerals(dayNum)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add month navigation and conditional rendering**

In the `TrackerPage` return statement, wrap the main content in a conditional:

```typescript
{isRamadanMode ? (
  // === EXISTING RAMADAN TRACKER (keep all current JSX exactly as-is) ===
  ...
) : (
  // === SUNNAH FASTING MODE ===
  <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
    <PageHeader title="صيام السنّة" subtitle="تتبع صيام الإثنين والخميس وأيام البيض" />

    {/* Month navigation */}
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={() => setViewDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}>
        السابق
      </Button>
      <h3 className="text-lg font-semibold" style={{ color: "#d4a574" }}>
        {ARABIC_MONTHS[viewMonth - 1]} {toArabicNumerals(viewYear)}
      </h3>
      <Button variant="ghost" onClick={() => setViewDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}>
        التالي
      </Button>
    </div>

    {/* Stats cards */}
    <div className="grid grid-cols-2 gap-3">
      <Card className="border-0 bg-[rgba(45,106,79,0.1)]">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: "#d4a574" }}>
            {toArabicNumerals(monthFasting.filter(Boolean).length)}
          </p>
          <p className="text-sm text-muted-foreground">أيام صيام هذا الشهر</p>
        </CardContent>
      </Card>
      <Card className="border-0 bg-[rgba(45,106,79,0.1)]">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: "#d4a574" }}>
            {toArabicNumerals(sunnahDays.length)}
          </p>
          <p className="text-sm text-muted-foreground">أيام السنّة هذا الشهر</p>
        </CardContent>
      </Card>
    </div>

    {/* Calendar grid */}
    <Card className="border-0 bg-[rgba(212,165,116,0.06)]" style={{ borderColor: "rgba(212,165,116,0.15)", borderWidth: "1px" }}>
      <CardContent className="p-4">
        <SunnahCalendarGrid
          daysInMonth={daysInMonth}
          firstDayOfWeek={firstDayOfWeek}
          monthFasting={monthFasting}
          sunnahDays={sunnahDays}
          onToggle={(i) => toggleSunnahFasting(yearMonth, i, daysInMonth)}
        />
      </CardContent>
    </Card>

    {/* Legend */}
    <div className="flex gap-4 justify-center text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded border border-[#d4a574]/30" />
        <span>يوم سنّة</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
        <span>تم الصيام</span>
      </div>
    </div>

    {/* Spiritual goals */}
    <Card className="border-0 bg-[rgba(212,165,116,0.06)]" style={{ borderColor: "rgba(212,165,116,0.15)", borderWidth: "1px" }}>
      <CardHeader>
        <CardTitle className="text-lg" style={{ color: "#d4a574" }}>الأهداف اليومية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activeGoals.map((goal, i) => {
          const todayGoals = generalDailyGoals[today] ?? Array(activeGoals.length).fill(false);
          const done = todayGoals[i] ?? false;
          return (
            <button
              key={i}
              onClick={() => toggleGeneralGoal(today, i, activeGoals.length)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                done ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span>{goal}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  </div>
)}
```

- [ ] **Step 5: Import ARABIC_MONTHS**

Add to imports:
```typescript
import { ARABIC_MONTHS } from "@/lib/constants";
```

- [ ] **Step 6: Run dev server and verify**

Navigate to `/tracker` — should show the Sunnah fasting monthly calendar with Monday/Thursday highlighting, stats, and general spiritual goals.

- [ ] **Step 7: Commit**

```bash
git add src/lib/date-utils.ts src/app/tracker/page.tsx
git commit -m "feat: dual-mode fasting tracker with Sunnah monthly calendar"
```

---

## Task 9: Contact Form — Adaptive Page Selector

**Files:**
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 1: Update the page selector to use visible nav items**

In `src/app/contact/page.tsx`:

1. Add imports:
```typescript
import { getVisibleNavItems } from "@/config/navigation";
import { getIslamicPhase } from "@/lib/islamic-calendar";
import { useHydrated } from "@/hooks/use-hydrated";
```

2. Replace the static `PAGE_OPTIONS` with a dynamic computation inside the component:
```typescript
const mounted = useHydrated();
const pageOptions = mounted
  ? [
      ...getVisibleNavItems(getIslamicPhase())
        .filter((item) => item.href !== "/contact") // Exclude contact itself
        .map((item) => ({ value: item.href.replace("/", "") || "home", label: item.label })),
      { value: "other", label: "أخرى" },
    ]
  : PAGE_OPTIONS; // SSR fallback
```

Keep the static `PAGE_OPTIONS` as the SSR fallback.

- [ ] **Step 2: Run dev server and verify**

Navigate to `/contact` — the page selector dropdown should not include "التقويم" (calendar) since we're outside Ramadan.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: adaptive contact form page selector based on visible pages"
```

---

## Task 10: Final Verification & Cleanup

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run the production build**

Run: `npx next build`
Expected: Build succeeds with no type errors

- [ ] **Step 3: Run the dev server and manually verify all pages**

Check each page:
- `/` — Year-round dashboard with "إسلام لبنان" hero, next event countdown, general hadith
- `/prayer-times` — Unchanged, works
- `/quran` — Unchanged, works
- `/ayat-al-kursi` — Unchanged, works
- `/adhkar` — Third tab shows "أدعية عامة" with general duas
- `/tracker` — Sunnah fasting monthly calendar with Monday/Thursday highlights
- `/zakat` — Unchanged, works
- `/calendar` — Still accessible via direct URL (not in nav)
- `/contact` — Page selector adapts (no calendar option)

Check navigation:
- Header nav hides calendar, tracker shows "صيام السنّة"
- Bottom nav tracker shows "السنّة"
- Mobile drawer also uses filtered items

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```

- [ ] **Step 5: Final commit (if no fixes needed)**

All done. The app is now a year-round Islamic companion.
