import type { LucideIcon } from "lucide-react";

/** Navigation link item */
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Dhikr / Dua entry */
export interface Dhikr {
  id: string;
  text: string;
  count: number;
  source: string;
}

/** Prayer timing keys from Aladhan API */
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

/** Hijri date from Aladhan API */
export interface HijriDate {
  date: string;
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
}

/** Gregorian date from Aladhan API */
export interface GregorianDate {
  date: string;
  day: string;
  month: { number: number; en: string };
  year: string;
  weekday: { en: string };
}

/** City for prayer times */
export interface CityInfo {
  arabic: string;
  english: string;
  country: string;
}

/** Countdown time remaining */
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Ramadan hadith */
export interface RamadanHadith {
  id: number;
  text: string;
  source: string;
  topic: string;
}
