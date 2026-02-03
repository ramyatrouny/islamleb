import type { PrayerTimings, HijriDate, GregorianDate } from "@/lib/types";

// ---------------------------------------------------------------------------
// Aladhan API
// ---------------------------------------------------------------------------

/** Single-day response from /v1/timingsByCity */
export interface AladhanTimingsResponse {
  code: number;
  data: {
    timings: PrayerTimings;
    date: {
      hijri: HijriDate;
      gregorian: GregorianDate;
    };
  };
}

/** Single day in the hijri calendar array */
export interface AladhanCalendarDay {
  timings: PrayerTimings;
  date: {
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
}

/** Response from /v1/hijriCalendar/{month}/{year} */
export interface AladhanHijriCalendarResponse {
  code: number;
  data: AladhanCalendarDay[];
}

// ---------------------------------------------------------------------------
// Al-Quran Cloud API
// ---------------------------------------------------------------------------

export interface AlQuranAyah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface AlQuranJuzData {
  number: number;
  ayahs: AlQuranAyah[];
}

/** Response from /v1/juz/{n}/{edition} */
export interface AlQuranJuzResponse {
  code: number;
  status: string;
  data: AlQuranJuzData;
}

// ---------------------------------------------------------------------------
// Quran.com API v4
// ---------------------------------------------------------------------------

export interface QuranComChapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

/** Response from /api/v4/chapters */
export interface QuranComChaptersResponse {
  chapters: QuranComChapter[];
}
