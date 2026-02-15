import { ARABIC_NUMERALS, ARABIC_MONTHS } from "./constants";

/** Return the value as a Western-numeral string (e.g. 123 → "123") */
export function toArabicNumerals(value: number | string): string {
  return String(value);
}

/** Format a Date to "DD MonthName YYYY" */
export function formatArabicDate(date: Date): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Format a Date to short "DD MonthName" */
export function formatArabicDateShort(date: Date): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  return `${day} ${month}`;
}

/** Format a Date to "WeekdayName DD MonthName YYYY" in Arabic */
export function formatArabicDateFull(date: Date): string {
  const weekday = date.toLocaleDateString("ar", { weekday: "long" });
  return `${weekday} ${formatArabicDate(date)}`;
}

/** Format number with locale separators (e.g. 1,234.56) */
export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Milliseconds in one calendar day */
export const MS_PER_DAY = 1000 * 60 * 60 * 24;
