# Ramadan 2026 - Website Blueprint & Research Document

---

## 1. Overview

**Ramadan 2026 (1447 AH)** is expected to begin on **Wednesday, February 18, 2026** (or Thursday, February 19 depending on moon sighting) and end around **Thursday, March 19, 2026**, with **Eid al-Fitr** on **Friday, March 20, 2026**.

- **Target Audience:** Arabic-speaking Muslims worldwide
- **Language:** Formal Arabic (RTL layout)
- **Goal:** A comprehensive, spiritually enriching, and practical Ramadan companion website

---

## 2. Core Features

### 2.1 Ramadan Countdown & Dashboard (العد التنازلي ولوحة المعلومات)

- Live countdown timer to the start of Ramadan
- Once Ramadan begins: countdown to Iftar/Suhoor based on user location
- Daily Ramadan day indicator (e.g., "Day 15 of 30")
- Hijri and Gregorian date display
- Dynamic greeting based on time of day (صباح الخير / مساء الخير)
- Special banner for the last 10 nights and Laylat al-Qadr

### 2.2 Prayer Times (مواقيت الصلاة)

- Accurate prayer times based on geolocation (auto-detect or manual city selection)
- Support for multiple calculation methods (Muslim World League, Umm al-Qura, ISNA, etc.)
- Visual timeline showing current prayer window
- Suhoor end time (Imsak) and Iftar time prominently displayed
- Notification/alert system for prayer times
- Downloadable/printable monthly Ramadan timetable

### 2.3 Quran Section (القرآن الكريم)

- **Full Quran text** with Uthmani script
- **Audio recitations** from popular Qari (Mishary Rashid, Abdul Basit, Al-Husary, etc.)
- **Khatma Tracker (ختمة رمضان):**
  - 30-day reading plan (1 Juz per day)
  - Progress bar and daily checkmarks
  - Option for double/triple Khatma
  - Reading suggestions: 4 pages after each prayer = 1 Juz/day
- **Tafsir** (interpretation) toggle for each ayah
- **Bookmarking** to save where user left off
- **Search** by surah name, ayah number, or keyword

### 2.4 Daily Adhkar & Dua (الأذكار والأدعية)

- Morning adhkar (أذكار الصباح)
- Evening adhkar (أذكار المساء)
- Post-prayer adhkar
- Ramadan-specific duas:
  - Dua for breaking fast (دعاء الإفطار)
  - Dua for Laylat al-Qadr
  - Dua for each of the three Ashras (عشرات رمضان):
    - First 10 days: Mercy (رحمة)
    - Second 10 days: Forgiveness (مغفرة)
    - Third 10 days: Protection from Hellfire (عتق من النار)
- Digital Tasbih counter (تسبيح إلكتروني)

### 2.5 Fasting Tracker (متتبع الصيام)

- Daily fasting log (check off each day)
- Track missed fasts with makeup counter
- Fasting tips and health advice
- Suhoor and Iftar time reminders
- Visual calendar showing completed/missed/remaining days

### 2.6 Ramadan Calendar (التقويم الرمضاني)

- Full 30-day interactive calendar
- Each day shows:
  - Prayer times for that day
  - Quran reading assignment (which Juz)
  - Daily hadith or Islamic reminder
  - Suggested good deed of the day
- Special markers for:
  - Laylat al-Qadr nights (الليالي الوتر في العشر الأواخر)
  - Last 10 nights
  - Eid al-Fitr

### 2.7 Qibla Compass (اتجاه القبلة)

- Browser-based Qibla direction finder
- Uses device compass + geolocation
- Visual compass UI with Kaaba indicator
- Distance to Mecca display

### 2.8 Zakat Calculator (حاسبة الزكاة)

- Comprehensive Zakat calculator supporting:
  - Zakat al-Mal (زكاة المال)
  - Zakat al-Fitr (زكاة الفطر)
- Input fields for: cash, gold, silver, investments, business goods, debts
- Nisab threshold display (updated with current gold/silver prices)
- Clear breakdown of amount owed
- Fidya and Kaffarah calculator for those unable to fast

### 2.9 Hadith of the Day (حديث اليوم)

- Daily rotating hadith related to Ramadan, fasting, and good deeds
- Source attribution (Bukhari, Muslim, Tirmidhi, etc.)
- Share functionality for social media

### 2.10 Ramadan Recipes (وصفات رمضانية)

- Curated Iftar and Suhoor recipes
- Categories: appetizers, main dishes, drinks, desserts, healthy options
- Nutritional tips for maintaining energy during fasting
- Suhoor recommendations for sustained energy
- Traditional recipes from different Arabic/Muslim cultures

---

## 3. Enhanced Features

### 3.1 Daily Spiritual Goals (الأهداف الروحية اليومية)

- Customizable daily checklist:
  - [ ] Prayed all 5 prayers on time
  - [ ] Prayed Taraweeh
  - [ ] Read today's Juz
  - [ ] Made morning/evening adhkar
  - [ ] Gave sadaqah today
  - [ ] Made specific dua
  - [ ] Avoided backbiting and negativity
- Progress tracking over the month
- Streak counter for motivation

### 3.2 Taraweeh Tracker (متتبع صلاة التراويح)

- Track nightly Taraweeh attendance
- Which Juz was recited in Taraweeh tonight
- Notes section for reflections

### 3.3 Charity & Donation Hub (مركز التبرعات والصدقات)

- Links to verified charitable organizations
- Daily Sadaqah suggestions and ideas
- Sadaqah jar concept (small daily giving amounts)
- Track total charitable giving for the month

### 3.4 Islamic Knowledge Section (المعرفة الإسلامية)

- Articles about the virtues of Ramadan
- Fiqh of fasting (rules and rulings)
- What breaks the fast and what doesn't
- Special rulings for travelers, the sick, pregnant women, etc.
- Etiquette of fasting (آداب الصيام)
- The significance of Laylat al-Qadr

### 3.5 Children's Section (ركن الأطفال)

- Simplified Ramadan lessons for kids
- Ramadan coloring activities
- Kids' dua memorization with audio
- Fasting badges and rewards for young fasters
- Ramadan stories and prophetic stories

### 3.6 Community Features (ميزات المجتمع)

- Shared Khatma (ختمة جماعية): users collectively complete the Quran
- Share daily progress on social media
- Ramadan greeting cards generator
- Eid Mubarak card creator

### 3.7 Eid Preparation Section (التحضير للعيد)

- Appears in the last 10 days
- Eid prayer times and locations
- Zakat al-Fitr reminder and calculator
- Eid Takbeer text and audio
- Eid greeting templates

---

## 4. Technical Architecture

### 4.1 Recommended Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | Next.js 15 (App Router) | SSR/SSG, excellent performance, great RTL support |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS v4 | Built-in RTL support via `rtl:` variant, utility-first |
| **UI Components** | Shadcn/ui + Radix | Accessible, customizable, RTL-compatible |
| **Animations** | Framer Motion | Smooth, performant animations |
| **State Management** | Zustand or React Context | Lightweight, sufficient for this scope |
| **Data Storage** | localStorage + IndexedDB | No backend needed for personal tracking |
| **Prayer Times API** | Aladhan API (free) | Reliable, supports all calculation methods |
| **Quran API** | Quran.com API or Al-Quran Cloud API | Free, comprehensive, includes audio |
| **Deployment** | Vercel | Edge network, great for MENA region |
| **PWA** | next-pwa | Offline support, installable on mobile |
| **Fonts** | IBM Plex Arabic / Amiri / Noto Naskh Arabic | Beautiful Arabic typography |

### 4.2 RTL Implementation Strategy

```
- Set `dir="rtl"` and `lang="ar"` on the HTML root
- Use CSS Logical Properties (margin-inline-start, padding-inline-end)
- Tailwind's `rtl:` modifier for directional overrides
- Arabic web fonts with proper font-feature-settings
- Text alignment: start (not left/right)
- Mirrored icons where appropriate (arrows, navigation)
```

### 4.3 Performance Targets

- Lighthouse score: 95+ on all metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Full PWA support for offline usage
- Lazy loading for Quran audio and images

### 4.4 Progressive Web App (PWA)

Making the site a PWA is critical because:
- Users can install it on their phone like a native app
- Offline access to prayer times, Quran text, and adhkar
- Push notifications for prayer times and Iftar/Suhoor
- Works without internet once cached

---

## 5. Design Direction

### 5.1 Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Deep Royal Purple / Navy | `#1a1a2e` or `#16213e` |
| Secondary | Gold / Amber | `#d4a574` or `#c9a96e` |
| Accent | Emerald Green | `#2d6a4f` |
| Background | Dark: `#0a0a0f` / Light: `#faf8f5` | |
| Text | Warm White: `#f5f0eb` / Dark: `#1a1a1a` | |
| Ramadan Glow | Soft Gold Gradient | `#d4a574` -> `#8b6914` |

### 5.2 Typography

- **Headings:** Amiri or Scheherazade (traditional Naskh style)
- **Body:** IBM Plex Arabic or Noto Naskh Arabic (clean, readable)
- **Numbers:** Tabular Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
- **Quran text:** KFGQPC Uthmani Hafs or Amiri Quran (special Quranic font)

### 5.3 Visual Elements

- Islamic geometric patterns as subtle backgrounds
- Crescent moon and lantern (فانوس) motifs
- Mosque silhouette in hero sections
- Star and arabesque decorations
- Subtle particle animations (floating stars/lanterns)
- Dark mode as default (since much of Ramadan is spent at night)
- Light mode toggle available

### 5.4 UI/UX Principles

- Mobile-first responsive design (most users will access on phones)
- Large, readable Arabic text (min 18px body text)
- Bottom navigation bar for mobile (thumb-friendly)
- Minimal clicks to reach prayer times and Quran
- Smooth transitions and micro-interactions
- Accessible (WCAG 2.1 AA compliant)

---

## 6. Site Map / Page Structure

```
ramadan2026.com/
├── / (Home - Dashboard & Countdown)
├── /prayer-times (مواقيت الصلاة)
├── /quran (القرآن الكريم)
│   ├── /quran/[surah] (صفحة السورة)
│   └── /quran/khatma (ختمة رمضان)
├── /adhkar (الأذكار والأدعية)
├── /calendar (التقويم الرمضاني)
├── /tracker (متتبع العبادات)
│   ├── Fasting tracker
│   ├── Prayer tracker
│   └── Daily goals
├── /zakat (حاسبة الزكاة)
├── /qibla (اتجاه القبلة)
├── /recipes (وصفات رمضانية)
├── /knowledge (المعرفة الإسلامية)
├── /kids (ركن الأطفال)
├── /eid (عيد الفطر)
└── /settings (الإعدادات)
    ├── Location
    ├── Calculation method
    ├── Theme (dark/light)
    └── Notifications
```

---

## 7. Monetization (Optional)

Since this is a Ramadan website for the Muslim community, monetization should be ethical and non-intrusive:

- **No ads** (preserves the spiritual atmosphere)
- **Sadaqah Jariyah model:** Accept voluntary donations to keep the site running
- **Sponsored charity links:** Partner with verified Islamic charities
- **Premium features (optional):** Advanced analytics, personalized plans
- **Affiliate links** for Islamic books, prayer mats, etc.

---

## 8. Development Phases

### Phase 1 - Foundation (MVP)
- Home page with countdown and daily info
- Prayer times with geolocation
- Basic Quran reader with Khatma tracker
- Fasting tracker
- Adhkar and Duas section
- RTL layout and Arabic typography
- PWA setup

### Phase 2 - Enhancement
- Zakat calculator
- Qibla compass
- Ramadan calendar with daily content
- Recipes section
- Hadith of the day
- Daily spiritual goals tracker

### Phase 3 - Community & Polish
- Social sharing features
- Shared Khatma
- Children's section
- Eid preparation section
- Push notifications
- Performance optimization
- Accessibility audit

---

## 9. API Resources (Free)

| API | Purpose | URL |
|-----|---------|-----|
| **Aladhan** | Prayer times, Hijri calendar | https://aladhan.com/prayer-times-api |
| **Al-Quran Cloud** | Quran text, audio, translations | https://alquran.cloud/api |
| **Quran.com API** | Quran text, tafsir, recitations | https://api-docs.quran.com |
| **Fixer.io** | Currency rates for Zakat calc | https://fixer.io |

---

## 10. Competitive Analysis

| Feature | Our Site | Muslim Pro | IslamicFinder | Ramadan360 |
|---------|----------|------------|---------------|------------|
| Full Arabic UI | Yes | Partial | Partial | No |
| Khatma Tracker | Yes | No | No | Partial |
| Fasting Tracker | Yes | Yes | No | No |
| Zakat Calculator | Yes | No | Yes | No |
| Recipes | Yes | No | No | No |
| Daily Goals | Yes | Partial | No | Yes |
| Qibla Compass | Yes | Yes | Yes | No |
| PWA / Offline | Yes | App only | No | No |
| Children's Section | Yes | No | No | No |
| 100% Free | Yes | Freemium | Partial | Partial |
| Open Source | Possible | No | No | No |

---

## 11. Success Metrics

- **User Engagement:** Daily active users during Ramadan
- **Khatma Completion Rate:** % of users who complete their reading plan
- **Fasting Tracker Usage:** Daily check-in rate
- **Time on Site:** Average session duration
- **PWA Installs:** Number of users who install the web app
- **Return Rate:** Users who come back daily throughout Ramadan
- **Lighthouse Score:** 95+ across all metrics

---

## Sources

- [Aladhan - Ramadan Calendar 2026](https://aladhan.com/ramadan-calendar/2026)
- [IslamicFinder - Ramadan 2026](https://www.islamicfinder.org/special-islamic-days/ramadan-2026/)
- [Khaleej Times - Ramadan 2026 Start Date](https://www.khaleejtimes.com/uae/ramadan-2026-start-date-astronomical-calculations)
- [Human Relief Foundation - When is Ramadan 2026](https://www.hrf.org.uk/media-centre/blog/when-is-ramadan-2026/)
- [Muslim Aid - When is Ramadan 2026](https://www.muslimaid.org/what-we-do/religious-dues/when-is-ramadan/)
- [Ramadan360 - Online Ramadan Community](https://ramadan360.org/)
- [Greentech Apps - Best Ramadan Apps 2026](https://gtaf.org/blog/best-apps-for-ramadan-for-android-and-ios/)
- [DXB Apps - Must-Have Apps for Ramadan 2026](https://dxbapps.com/blog/apps-for-ramadan)
- [Islam Hashtag - Quran Reading Chart](https://islamhashtag.com/a-ramadan-quran-reading-chart-to-complete-quran-in-30-days/)
- [Madrasat El-Quran - Ramadan Reading Schedule](https://madrasatelquran.com/ramadan-quran-reading-schedule/)
- [StarteleLogic - Best Tech Stack 2026](https://startelelogic.com/blog/best-technology-stack-for-web-development-2026/)
- [5ly - Frontend Technologies 2026](https://5ly.co/blog/front-end-technologies-list/)
- [DEV Community - Arabic RTL Chat Platform](https://dev.to/m_aryan_d2012176e8527826/building-a-real-time-arabic-chat-platform-technical-challenges-and-solutions-2o07)

---

> **Next Step:** Once you approve this blueprint, we can begin building Phase 1 (MVP) of the website.
