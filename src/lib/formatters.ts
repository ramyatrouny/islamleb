import { ARABIC_NUMERALS, ARABIC_MONTHS } from "./constants";

/** Convert a number or numeric string to Eastern Arabic numerals (e.g. 123 → ١٢٣) */
export function toArabicNumerals(value: number | string): string {
  return String(value)
    .split("")
    .map((char) => {
      const digit = parseInt(char);
      return isNaN(digit) ? char : ARABIC_NUMERALS[digit];
    })
    .join("");
}

/** Format a Date to "DD MonthName YYYY" in Arabic numerals */
export function formatArabicDate(date: Date): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${toArabicNumerals(day)} ${month} ${toArabicNumerals(year)}`;
}

/** Format a Date to short "DD MonthName" in Arabic numerals */
export function formatArabicDateShort(date: Date): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  return `${toArabicNumerals(day)} ${month}`;
}

/** Format a Date to "WeekdayName DD MonthName YYYY" in Arabic */
export function formatArabicDateFull(date: Date): string {
  const weekday = date.toLocaleDateString("ar", { weekday: "long" });
  return `${weekday} ${formatArabicDate(date)}`;
}

/** Format number with Arabic-locale separators (e.g. ١٬٢٣٤٫٥٦) */
export function formatNumber(n: number, decimals = 2): string {
  const formatted = n.toLocaleString("ar-SA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatted;
}

/** Milliseconds in one calendar day */
export const MS_PER_DAY = 1000 * 60 * 60 * 24;
