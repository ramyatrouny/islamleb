# Year-Round Islamic Companion Transformation

**Date:** 2026-03-21
**Status:** Approved
**Goal:** Transform IslamLeb from a Ramadan-only app into a year-round Islamic companion that remains useful after Ramadan and Eid, while preserving the full Ramadan experience during Ramadan.

---

## 1. Phase System & Islamic Calendar

### Current State
- 3 hardcoded phases: `before` | `during` | `after` in `src/lib/countdown.ts`
- All date logic tied to `RAMADAN_2026` constants in `src/lib/constants.ts`

### Design

**New file: `src/lib/islamic-calendar.ts`**

Introduces a seasonal phase detection system with 7 phases:

| Phase | Period | Description |
|---|---|---|
| `before-ramadan` | 30 days before Ramadan start | Countdown to Ramadan |
| `ramadan` | 1-29/30 Ramadan | Active Ramadan (current behavior) |
| `eid-al-fitr` | 1-3 Shawwal | Eid celebration period |
| `shawwal-fasting` | 4-30 Shawwal | Shawwal sunnah fasting promotion |
| `dhul-hijjah` | 1-10 Dhul Hijjah | Countdown to Arafah/Eid al-Adha |
| `eid-al-adha` | 10-13 Dhul Hijjah | Eid al-Adha celebration |
| `normal` | Everything else | General Islamic dashboard |

**Exports:**
- `type IslamicPhase` — union of the 7 phase strings
- `getIslamicPhase(now?: Date): IslamicPhase` — determines current phase
- `getNextIslamicEvent(now?: Date): { name: string; date: Date; hijriDate: string }` — returns next upcoming event for countdown
- `isRamadanSeason(): boolean` — true during `before-ramadan`, `ramadan`, or `eid-al-fitr`

**`src/lib/constants.ts` changes:**
- Add `ISLAMIC_EVENTS` object with approximate Gregorian dates for 1447-1448 AH key events (Shawwal start, Dhul Hijjah start, etc.)
- Existing `RAMADAN_2026` stays unchanged

**`src/lib/countdown.ts` changes:**
- `CountdownState.phase` type expands from `"before" | "during" | "after"` to `IslamicPhase`
- `CountdownState.ramadanDay` field renamed to `eventDay: number`:
  - During `ramadan`: current day of Ramadan (1-30), same as current behavior
  - During `before-ramadan`: days until Ramadan (for display)
  - During all other phases: **0** (consumers must check phase before rendering)
- `computeCountdownState()` delegates to `getIslamicPhase()` for phase detection
- During `ramadan` phase: behavior identical to current `during` phase
- During `before-ramadan`: countdown to Ramadan start (current `before` behavior)
- During other phases: countdown to next Islamic event via `getNextIslamicEvent()`

**Phase priority in `getIslamicPhase()`:** When date ranges overlap or Hijri date estimates are off by 1-2 days, phases are checked in this strict priority order:
1. `ramadan` (checked first — if we're in Ramadan, nothing else matters)
2. `eid-al-fitr` (3 days after Ramadan)
3. `eid-al-adha` (10-13 Dhul Hijjah)
4. `dhul-hijjah` (1-9 Dhul Hijjah, before Eid)
5. `shawwal-fasting` (4-30 Shawwal)
6. `before-ramadan` (30 days before Ramadan start)
7. `normal` (fallback — if no other phase matches)

**`src/lib/date-utils.ts` changes:**
- Existing Ramadan-specific functions stay unchanged (they return -1 outside Ramadan already)
- Add `getCurrentHijriMonth()` helper (fetches from Aladhan or estimates)
- Add `getSunnahFastingDays(year: number, month: number): number[]` — returns recommended fasting days for a Gregorian month
- Add `getAyyamAlBeed(year: number, month: number): number[]` — fetches the Hijri calendar for the given Gregorian month from Aladhan API (`/gToHCalendar/{month}/{year}`), finds dates where the Hijri day is 13, 14, or 15, and returns the corresponding Gregorian day numbers. Falls back to a simple estimation algorithm if the API is unavailable. Results are cached in localStorage with a 7-day TTL per month.

---

## 2. Home Page Transformation

### File: `src/app/page.tsx`

The home page becomes phase-aware with conditional rendering:

**Hero Section:**
- During `ramadan` / `before-ramadan`: Current behavior (crescent moon, "رمضان كريم", Ramadan subtitle)
- During `eid-al-fitr`: Eid Mubarak celebration with "لا تنسوا صيام ست من شوال" reminder
- During `eid-al-adha`: Eid al-Adha celebration message
- During all other phases: "إسلام لبنان" heading with a generic Islamic icon, subtitle "رفيقك الإسلامي الرقمي"

**Countdown Section:**
- During `ramadan`: Countdown to Iftar (current behavior)
- During `before-ramadan`: Countdown to Ramadan (current behavior)
- During `eid-al-fitr` / `eid-al-adha`: Celebration display (no countdown)
- During other phases: Countdown to next Islamic event with event name displayed

**Quick Access Grid:**
- During Ramadan: Current 6 items unchanged
- Outside Ramadan: Reordered — Prayer Times, Quran, Adhkar, Zakat Calculator first. Tracker card label changes to "صيام السنّة". Calendar card hidden.

**Daily Hadith:**
- During Ramadan: Uses `ramadanHadiths` (current behavior)
- Outside Ramadan: Uses new `generalHadiths` array

**Info Banner (bottom):**
- During Ramadan: Current Ramadan dates info
- Outside Ramadan: Shows next Islamic event info

---

## 3. Navigation Visibility

### Files: `src/config/navigation.ts`, `src/components/header.tsx`, `src/components/bottom-nav.tsx`

**`navigation.ts` changes:**
- Add `getVisibleNavItems(phase: IslamicPhase): NavItem[]` function
- During Ramadan: All current items visible
- Outside Ramadan: Calendar page hidden, Tracker label changes to "صيام السنّة"
- Static `NAV_ITEMS` and `BOTTOM_NAV_ITEMS` arrays remain as the full superset

**`header.tsx` and `bottom-nav.tsx` changes:**
- Import `getIslamicPhase` and `getVisibleNavItems`
- Use filtered nav items instead of static arrays
- Bottom nav items stay the same 5 (all are year-round features), but tracker label adapts

---

## 4. Fasting Tracker — Year-Round Sunnah Fasting

### Files: `src/app/tracker/page.tsx`, `src/lib/store.ts`, `src/config/spiritual-goals.ts`

**Dual-mode tracker page:**

During Ramadan: Exact current behavior — 30-day grid, streak tracking, spiritual goals checklist.

Outside Ramadan — Sunnah Fasting Mode:
- **Monthly calendar grid** showing the current Gregorian month
- Each day cell is tappable to mark as fasted
- Auto-highlighted recommended days (visual indicators, not auto-toggled):
  - Mondays & Thursdays: gold border
  - Ayyam al-Beed (13th, 14th, 15th Hijri): emerald border
  - 6 days of Shawwal (during Shawwal): special gold+emerald badge
  - Day of Arafah (9 Dhul Hijjah): gold star indicator
  - Day of Ashura (10 Muharram) + adjacent day: gold indicator
- Month navigation (previous/next month buttons)
- Statistics cards adapt: "أيام صيام هذا الشهر", "أيام صيام هذه السنة", "أيام السنّة المتبقية"
- Streak tracking works across months

**Store changes (`src/lib/store.ts`):**
- Add `sunnahFasting: Record<string, boolean[]>` — keyed by `"YYYY-MM"`, each value is boolean array for that month's days
- Add `toggleSunnahFasting(yearMonth: string, dayIndex: number): void`
- Add `getSunnahFastingForMonth(yearMonth: string): boolean[]`
- Add `generalDailyGoals: Record<string, boolean[]>` — keyed by `"YYYY-MM-DD"` (ISO date string), avoids collision with Ramadan's `dailyGoals` which is keyed by day index 0-29
- Add `toggleGeneralGoal(dateKey: string, goalIndex: number, totalGoals: number): void`
- Update `setSyncData` to include `sunnahFasting` and `generalDailyGoals` fields for cloud sync
- **Store version bump:** Increment persist version from 1 to 2. Add a `migrate` function:
  ```
  migrate(persisted, version) {
    if (version === 1) {
      return { ...persisted, sunnahFasting: {}, generalDailyGoals: {} }
    }
    return persisted
  }
  ```
  This ensures returning users with v1 localStorage data get the new fields initialized without data loss.
- Existing `fastingDays` (30-element Ramadan array) stays unchanged

**Spiritual goals adaptation (`src/config/spiritual-goals.ts`):**
- Export two arrays: `RAMADAN_SPIRITUAL_GOALS` (current list) and `GENERAL_SPIRITUAL_GOALS`
- `GENERAL_SPIRITUAL_GOALS` removes: "صلاة التراويح", "قراءة الجزء اليومي"
- `GENERAL_SPIRITUAL_GOALS` adds: "صيام السنّة", "صلاة الضحى"
- Keeps: 5 daily prayers, morning/evening adhkar, charity, avoiding gossip

---

## 5. Adhkar Page — General Duas Tab

### Files: `src/app/adhkar/page.tsx`, `src/lib/adhkar-data.ts`

**During Ramadan:** No changes — morning adhkar, evening adhkar, Ramadan duas tabs.

**Outside Ramadan:** Third tab changes from "أدعية رمضان" to "أدعية عامة" (General Duas).

**New data in `adhkar-data.ts`:**
- Add `generalDuas` collection with ~10-12 daily-life duas:
  - Entering/leaving the mosque
  - Before sleeping / upon waking
  - Before/after eating
  - Entering/leaving the house
  - Travel dua
  - Istikharah
  - For parents
  - For the deceased
  - For rain
  - When in distress
- Each dua has: `id`, `text`, `count`, `source` (same `Dhikr` type)

**`adhkar/page.tsx` changes:**
- Tab label and data source switch based on `isRamadanSeason()`
- Morning and evening tabs: unchanged
- Tasbih counter: unchanged

---

## 6. Hadith Data Expansion

### File: `src/lib/hadith-data.ts`

**Add `generalHadiths: RamadanHadith[]`** array (~30 entries) covering:
- Virtues of the 5 daily prayers
- Charity and generosity
- Good character and manners (akhlaq)
- Patience and gratitude
- Seeking knowledge
- Remembrance of Allah (dhikr)
- Rights of neighbors
- Rights of parents
- Brotherhood and community
- Sincerity (ikhlas)

Note: Reuses existing `RamadanHadith` type (consider renaming to `Hadith` since it's now general — but type alias can be added without breaking changes).

**`src/app/page.tsx` change:**
- Import both `ramadanHadiths` and `generalHadiths`
- Select source based on phase: Ramadan phases use `ramadanHadiths`, others use `generalHadiths`

---

## 7. SEO & Metadata

### Files: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

**`layout.tsx`:**
- Metadata already says "رفيقك الإسلامي الرقمي الشامل" — keep as-is
- Keywords already include general terms — no change needed
- `<RamadanDatesFetcher />` stays (it only runs during Ramadan season, already has TTL caching)

**`sitemap.ts`:**
- Calendar page (`/calendar`) is **always included** in the sitemap (since it's a valid route year-round and sitemaps are generated at build time, not per-request — a runtime `isRamadanSeason()` check would only reflect the build date)
- Navigation visibility handles hiding the calendar link from the UI outside Ramadan, but the route itself remains accessible via direct URL

**No changes to `robots.ts`** — already correct.

---

## 8. Contact Form

### File: `src/app/contact/page.tsx`

- Remove any Ramadan-specific wording in category labels or descriptions
- Keep the 4 categories: general inquiry, bug report, suggestion, contribute
- Page selector in the form adapts to show only currently visible pages (uses `getVisibleNavItems()`)

---

## Architecture Principles

1. **Phase-gated, not destructive:** All changes are conditional on the current `IslamicPhase`. During Ramadan, the app behaves exactly as it does today. Zero risk to existing Ramadan experience.

2. **Additive store changes with migration:** New `sunnahFasting` and `generalDailyGoals` slices sit alongside existing data. Store version bumps from 1 to 2 with a `migrate` function that initializes new fields as empty objects, preserving all existing user data.

3. **Single source of truth for phase:** `getIslamicPhase()` is the one function everything consults. No scattered date checks.

4. **Existing patterns preserved:** Same component structure, same styling system (gold #d4a574 + emerald #2d6a4f), same animation patterns, same RTL approach.

5. **SSR hydration safety:** All phase-dependent rendering must be guarded by the existing `useHydrated()` hook. Since `getIslamicPhase()` uses `new Date()`, server and client can produce different phases at phase boundaries. The pattern is: compute phase client-side only, render a neutral skeleton on first server render. This is the same pattern already used for the countdown, extended to all 7 phases.

6. **Event calendar rollover:** `getNextIslamicEvent()` must handle the case where all events in the current year (1447-1448 AH) have passed. In that case, it wraps around to estimate the first event of the next Hijri year. The estimation adds 354 days (approximate lunar year) to the corresponding event from the current year. This ensures the countdown always has a target.

## Unchanged Pages

- **`/ayat-al-kursi`** — stays unchanged year-round (universal Islamic content, no Ramadan-specific elements)
- **`/quran`** — Khatma tracker stays as-is. It's already useful year-round (users can track Quran completion anytime). No changes needed for this iteration. The `completedJuz` and `resetKhatma` store methods work independently of Ramadan phase.

---

## Files to Create
- `src/lib/islamic-calendar.ts` — phase detection + Islamic event dates

## Files to Modify
- `src/lib/constants.ts` — add `ISLAMIC_EVENTS`
- `src/lib/countdown.ts` — expand phase type, delegate to `getIslamicPhase()`
- `src/lib/date-utils.ts` — add Hijri month + Sunnah fasting day helpers
- `src/lib/store.ts` — add `sunnahFasting` + `generalDailyGoals` slices, version bump v1→v2 with migrate, update `setSyncData`
- `src/lib/types.ts` — update `CountdownState` phase type, add Hadith alias if needed
- `src/lib/hadith-data.ts` — add `generalHadiths` array
- `src/lib/adhkar-data.ts` — add `generalDuas` collection
- `src/config/spiritual-goals.ts` — split into Ramadan + general arrays
- `src/config/navigation.ts` — add `getVisibleNavItems()` function
- `src/app/page.tsx` — phase-aware hero, countdown, quick access, hadith, banner
- `src/app/tracker/page.tsx` — dual-mode (Ramadan grid vs monthly Sunnah calendar)
- `src/app/adhkar/page.tsx` — swap Ramadan duas tab for general duas outside Ramadan
- `src/app/contact/page.tsx` — remove Ramadan-specific wording
- `src/app/sitemap.ts` — no changes needed (calendar always included; build-time constraint)
- `src/components/header.tsx` — use filtered nav items
- `src/components/bottom-nav.tsx` — adaptive tracker label
