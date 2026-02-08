<div align="center">

# Ramadan 2026 - Islam Leb

### A comprehensive Ramadan companion web application for the Muslim community

**Ramadan 1447H | February 18 - March 19, 2026**

Built with Next.js 16 | React 19 | TypeScript | Tailwind CSS v4

---

[Features](#features) | [Tech Stack](#tech-stack) | [Getting Started](#getting-started) | [Project Structure](#project-structure) | [Pages](#pages) | [Architecture](#architecture)

</div>

## Overview

Islam Leb is a fully Arabic, RTL-first Ramadan companion application designed for the Muslim community with a focus on Lebanese cities. It provides prayer times, Quran tracking, adhkar, fasting management, a Ramadan calendar, and a zakat calculator -- all wrapped in a polished dark-mode UI with Islamic-inspired design elements.

All user data is persisted locally in the browser via `localStorage`. No accounts, no tracking, no cookies.

## Features

- **Live Prayer Times** -- Fetches accurate prayer times from the [Aladhan API](https://aladhan.com/prayer-times-api) for 12 Lebanese cities + Mecca, Medina, and Jerusalem
- **Quran Khatma Tracker** -- Track progress through all 30 juz with a visual progress ring, daily reading plan, and estimated completion date
- **Adhkar & Duas** -- Morning/evening adhkar with repetition counters, Ramadan-specific duas, and a tasbih counter with haptic feedback
- **Fasting Tracker** -- 30-day grid with streak tracking, daily spiritual goals checklist (11 items), and detailed statistics
- **Ramadan Calendar** -- Visual 30-day calendar organized by Ashra (Mercy, Forgiveness, Protection), with daily deed suggestions and Laylat al-Qadr highlighting
- **Zakat Calculator** -- Zakat al-Mal (wealth), Zakat al-Fitr, Fidya & Kaffarah calculators with multi-currency support (USD, LBP, EUR, SAR, AED)
- **Countdown Timer** -- Live countdown to Ramadan start with automatic phase detection (before / during / Eid)
- **Daily Hadith** -- Rotating collection of Ramadan-related hadiths displayed on the home dashboard
- **Eastern Arabic Numerals** -- All numbers rendered as ٠١٢٣٤٥٦٧٨٩ throughout the app
- **Fully Responsive** -- Mobile-first with bottom navigation, desktop header, and adaptive grid layouts

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4, CSS logical properties |
| Components | Shadcn/ui + Radix UI primitives |
| Animations | Framer Motion 12 |
| State | Zustand 5 with localStorage persistence |
| Icons | Lucide React |
| Dates | date-fns 4 |
| API | Aladhan (prayer times) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd islamleb

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (RTL, fonts, dark mode)
│   ├── globals.css             # Theme variables & global styles
│   ├── page.tsx                # Home dashboard & countdown
│   ├── prayer-times/page.tsx   # Prayer times with city selector
│   ├── quran/page.tsx          # Khatma tracker & reading plan
│   ├── adhkar/page.tsx         # Adhkar, duas & tasbih counter
│   ├── tracker/page.tsx        # Fasting tracker & daily goals
│   ├── calendar/page.tsx       # 30-day Ramadan calendar
│   └── zakat/page.tsx          # Zakat & fidya calculators
│
├── components/
│   ├── header.tsx              # Desktop navigation + mobile drawer
│   ├── bottom-nav.tsx          # Mobile bottom tab bar
│   ├── footer.tsx              # Desktop footer
│   ├── page-header.tsx         # Reusable page title component
│   └── ui/                     # Shadcn/ui components (card, button,
│                               #   dialog, tabs, progress, etc.)
│
├── lib/
│   ├── store.ts                # Zustand store (fasting, juz, goals, tasbih)
│   ├── types.ts                # TypeScript interfaces
│   ├── constants.ts            # Ramadan dates & app constants
│   ├── date-utils.ts           # Date helpers & Ramadan day detection
│   ├── formatters.ts           # Arabic numeral conversion & date formatting
│   ├── animations.ts           # Framer Motion animation presets
│   ├── adhkar-data.ts          # Morning/evening adhkar & Ramadan duas
│   └── hadith-data.ts          # Daily hadith collection
│
├── hooks/
│   ├── use-hydrated.ts         # SSR hydration guard
│   ├── use-countdown.ts        # Countdown timer logic
│   └── use-ramadan-date.ts     # Current Ramadan day & date info
│
└── config/
    ├── navigation.ts           # Nav items for header & bottom bar
    ├── cities.ts               # 12 Lebanese + 3 holy cities
    ├── spiritual-goals.ts      # 11 daily checklist items
    └── daily-deeds.ts          # 30 daily good deed suggestions
```

## Pages

### Home Dashboard (`/`)
The landing page features a live countdown timer to Ramadan (or within Ramadan, to Iftar), quick-access cards to all sections, a daily rotating hadith, and Ramadan date information. The UI adapts across three phases: pre-Ramadan countdown, active Ramadan dashboard, and Eid celebration.

### Prayer Times (`/prayer-times`)
Fetches real-time prayer times from the Aladhan API based on a selectable city. Displays all 8 prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Imsak, Midnight) in a responsive grid with Iftar/Suhoor highlighting and a live clock with Hijri date.

### Quran (`/quran`)
A khatma (complete Quran reading) tracker with a 30-juz toggle grid, circular progress ring, reading statistics, and suggested daily reading based on the current Ramadan day. Includes quick links to popular surahs on Quran.com.

### Adhkar & Duas (`/adhkar`)
Tabbed interface with morning adhkar, evening adhkar, Ramadan-specific duas, and an interactive tasbih counter. Each dhikr card shows the text, required repetitions, a progress bar, and its hadith source. The tasbih counter provides haptic feedback on mobile.

### Fasting Tracker (`/tracker`)
A 30-day visual grid for marking fasted days, streak counter with celebration animations, four statistics cards, and an 11-item daily spiritual goals checklist covering prayers, Taraweeh, Quran reading, adhkar, charity, and character.

### Calendar (`/calendar`)
The full 30-day Ramadan calendar organized by the three Ashras (Mercy, Forgiveness, Protection from Hellfire). Each day card shows the juz suggestion, daily deed, Gregorian date, and special indicators for today, the last 10 nights, and Laylat al-Qadr.

### Zakat Calculator (`/zakat`)
Three calculators in one: Zakat al-Mal (2.5% on wealth above nisab with 7 asset categories), Zakat al-Fitr (per family member), and Fidya/Kaffarah. Includes educational cards on the 7 conditions of zakat and the 8 eligible recipient categories.

## Architecture

### State Management

Zustand manages all persistent user state in a single store at `src/lib/store.ts`:

```
fastingDays: boolean[30]        -- Fasting status for each day
completedJuz: number[]          -- List of completed juz numbers
dailyGoals: Record<day, bool[]> -- Per-day spiritual goal completion
tasbihCount: number             -- Lifetime tasbih counter
selectedCity: string            -- Preferred city for prayer times
```

All state is automatically persisted to `localStorage` under the key `islamleb-ramadan-2026` and survives page refreshes.

### RTL & Arabic-First Design

- Root `<html>` element uses `lang="ar" dir="rtl"`
- Tailwind CSS logical properties (`text-start`, `ms-*`, `me-*`) for directional styles
- Two Arabic font families: **Noto Naskh Arabic** (body) and **Amiri** (Quran text)
- Eastern Arabic numerals via a custom `toArabicNumerals()` formatter
- All UI copy is in Arabic

### Theming

The app ships with a Ramadan-inspired dark theme as default:
- Deep navy background (`#0a0a0f`)
- Gold primary accent (`#d4a574`)
- Emerald green secondary (`#2d6a4f`)
- Light mode available with cream/navy palette

### Animation System

Framer Motion presets defined in `src/lib/animations.ts` provide consistent motion across the app:
- `staggerContainer` / `fastStaggerContainer` -- staggered child reveals
- `fadeUpItem` -- fade + slide up entrance
- `scaleUpItem` -- fade + scale entrance
- `sectionReveal` -- section-level entrance

### API Integration

The only external API call is to **Aladhan** for prayer times:
```
GET https://api.aladhan.com/v1/timingsByCity?city={city}&country={country}&method=2
```
All other data (adhkar, hadiths, daily deeds, spiritual goals) is bundled statically.

## Deployment

The app is optimized for deployment on [Vercel](https://vercel.com):

```bash
npm run build
```

Alternatively, deploy to any platform that supports Node.js or static hosting with SSR support.

## Privacy

- No user accounts or authentication
- No analytics, tracking, or cookies
- All data stored locally in the browser
- Only outbound network request: Aladhan API for prayer times

## License

This project is private. All rights reserved.
