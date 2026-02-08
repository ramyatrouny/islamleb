# Testing Guide — IslamLeb (Ramadan 2026)

## Overview

This project uses **Vitest** as the test runner with **React Testing Library** for component tests and **happy-dom** as the browser environment. The test suite covers utilities, state management, API layer, business logic, custom hooks, and React components.

**Total: 18 test files, 156 tests**

## Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Architecture

### Framework & Tools

| Tool | Purpose |
|------|---------|
| **Vitest 4.x** | Test runner, assertions, mocking (`vi.fn()`, `vi.mock()`) |
| **@vitejs/plugin-react** | JSX/TSX transform for test files |
| **happy-dom** | Lightweight DOM environment (faster than jsdom) |
| **@testing-library/react** | React component rendering & `renderHook` |
| **@testing-library/jest-dom** | DOM matchers (`toBeInTheDocument()`, etc.) |
| **@testing-library/user-event** | User interaction simulation |
| **msw** | Mock Service Worker (available for API mocking) |

### Configuration Files

- **`vitest.config.ts`** — Vitest config with `@/` alias, happy-dom, setup file
- **`src/__tests__/setup.ts`** — Global setup: jest-dom matchers, localStorage mock, auto-cleanup

### File Organization

Tests are organized in a dedicated `__tests__/` directory that mirrors the source tree structure. All imports use the `@/` alias to reference source files.

```
src/
├── __tests__/
│   ├── setup.ts                          ← global test setup
│   ├── lib/
│   │   ├── date-utils.test.ts            ← tests @/lib/date-utils
│   │   ├── formatters.test.ts            ← tests @/lib/formatters
│   │   ├── utils.test.ts                 ← tests @/lib/utils
│   │   ├── navigation-utils.test.ts      ← tests @/lib/navigation-utils
│   │   ├── constants.test.ts             ← tests @/lib/constants
│   │   ├── store.test.ts                 ← tests @/lib/store
│   │   ├── countdown.test.ts             ← tests @/lib/countdown
│   │   ├── streak.test.ts                ← tests @/lib/streak
│   │   ├── zakat-calculations.test.ts    ← tests @/lib/zakat-calculations
│   │   ├── api-fetchers.test.ts          ← tests @/lib/api-fetchers
│   │   └── api/
│   │       └── fetcher.test.ts           ← tests @/lib/api/fetcher
│   ├── hooks/
│   │   ├── use-hydrated.test.ts          ← tests @/hooks/use-hydrated
│   │   ├── use-api-fetch.test.ts         ← tests @/hooks/use-api-fetch
│   │   └── use-ramadan-date.test.ts      ← tests @/hooks/use-ramadan-date
│   └── components/
│       ├── error-boundary.test.tsx        ← tests @/components/error-boundary
│       ├── header.test.tsx                ← tests @/components/header
│       ├── bottom-nav.test.tsx            ← tests @/components/bottom-nav
│       └── page-header.test.tsx           ← tests @/components/page-header
├── lib/                                   ← source files
├── hooks/
└── components/
```

## Test Breakdown by Layer

### 1. Pure Utilities (67 tests)

| File | Tests | What's Covered |
|------|-------|---------------|
| `date-utils.test.ts` | 32 | `getTimeRemaining`, `getRamadanDay`, `getRamadanDayIndex`, `getDaysRemaining`, `isRamadan`, `getRamadanDate`, `getTodayIftar` — all with date boundary edge cases |
| `formatters.test.ts` | 16 | `toArabicNumerals`, `formatArabicDate`, `formatArabicDateShort`, `formatArabicDateFull`, `formatNumber`, `MS_PER_DAY` |
| `constants.test.ts` | 10 | `RAMADAN_2026` dates validation, `ARABIC_NUMERALS`, `ARABIC_MONTHS`, `STORAGE_KEYS` |
| `navigation-utils.test.ts` | 6 | `isNavActive` — home path special case, prefix matching, sub-paths |
| `utils.test.ts` | 3 | `cn()` — class merging, Tailwind conflict resolution, falsy values |

### 2. Store & API Layer (36 tests)

| File | Tests | What's Covered |
|------|-------|---------------|
| `store.test.ts` | 22 | All Zustand actions: `toggleFastingDay`, `toggleJuz`, `resetKhatma`, `toggleGoal`, `incrementTasbih`, `resetTasbih`, `setTasbihCount`, `setSelectedCity` + initial state |
| `api/fetcher.test.ts` | 9 | `apiFetch` — caching, TTL expiry, retry, AbortError passthrough, HTTP errors, signal forwarding |
| `api-fetchers.test.ts` | 5 | localStorage caching via `fetchExchangeRates`, `fetchGoldPricePerGram`, `fetchRamadanDates` — cache hit/miss/expiry |

### 3. Extracted Business Logic (24 tests)

| File | Tests | What's Covered |
|------|-------|---------------|
| `countdown.test.ts` | 8 | `computeCountdownState` — 3-phase detection (before/during/after), iftar countdown, null maghribTime |
| `streak.test.ts` | 7 | `calculateStreak` — consecutive fasting, gaps, outside Ramadan fallback, all/none fasted |
| `zakat-calculations.test.ts` | 9 | `calculateMal` (asset summing, debt subtraction, nisab boundary, negative floor), `calculateFitr`, `calculateFidya` |

### 4. Custom Hooks (14 tests)

| File | Tests | What's Covered |
|------|-------|---------------|
| `use-hydrated.test.ts` | 2 | Returns `true` on client, consistent across re-renders |
| `use-api-fetch.test.ts` | 7 | Loading/success/error states, fallback data, AbortError silencing, `refetch()`, generic error message |
| `use-ramadan-date.test.ts` | 5 | `currentDay`, `dayIndex`, `daysRemaining`, `isInRamadan` — during and outside Ramadan |

### 5. Components (15 tests)

| File | Tests | What's Covered |
|------|-------|---------------|
| `error-boundary.test.tsx` | 4 | Normal render, error fallback UI, custom fallback, retry button recovery |
| `header.test.tsx` | 5 | Site name, nav links, mobile menu open/close |
| `bottom-nav.test.tsx` | 3 | 5 items rendered, correct labels, correct hrefs |
| `page-header.test.tsx` | 3 | Title, subtitle (present/absent) |

## Mocking Strategies

### Date/Time
Tests that depend on the current date use `vi.useFakeTimers()` and `vi.setSystemTime()`:
```ts
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("works during Ramadan", () => {
  vi.setSystemTime(new Date(2026, 1, 25)); // Feb 25
  // ...
});
```

### Fetch API
Unit tests use `vi.stubGlobal("fetch", mockFn)`:
```ts
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: "..." }),
}));
```

### Zustand Store
Reset to initial state between tests:
```ts
beforeEach(() => {
  useRamadanStore.setState({ fastingDays: Array(30).fill(false), ... });
});
```

### Next.js
Mock `next/navigation` and `next/link`:
```ts
vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }));
vi.mock("next/link", () => ({ default: ({ children, href }) => <a href={href}>{children}</a> }));
```

### Framer Motion
Mock to static elements for component tests:
```ts
vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (props) => <div {...props} /> }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));
```

## Refactoring for Testability

Three functions were extracted from page components into standalone modules to enable isolated testing:

| Extracted To | From | Functions |
|-------------|------|-----------|
| `src/lib/countdown.ts` | `src/app/page.tsx` | `computeCountdownState()` |
| `src/lib/streak.ts` | `src/app/tracker/page.tsx` | `calculateStreak()` |
| `src/lib/zakat-calculations.ts` | `src/app/zakat/page.tsx` | `calculateMal()`, `calculateFitr()`, `calculateFidya()` |

The original page files now import from these modules, keeping the same behavior.

## Key Edge Cases Covered

- **Date boundaries**: Feb 17 (before Ramadan), Feb 18 (day 1), Mar 19 (day 30), Mar 20 (Eid)
- **Arabic numerals**: 0, multi-digit, time strings with colons, large numbers
- **API failures**: Network errors, HTTP status codes, retry exhaustion, AbortError
- **Cache**: TTL expiry, localStorage unavailability, stale data cleanup
- **Store**: Toggle operations, array immutability, out-of-bounds safety
- **Zakat**: Below nisab, at nisab boundary, negative totals, zero assets
- **Streak**: All fasted, none fasted, gaps, single day, outside Ramadan
