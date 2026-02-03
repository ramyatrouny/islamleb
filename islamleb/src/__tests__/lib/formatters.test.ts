import { describe, it, expect } from "vitest";
import {
  toArabicNumerals,
  formatArabicDate,
  formatArabicDateShort,
  formatArabicDateFull,
  formatNumber,
  MS_PER_DAY,
} from "@/lib/formatters";

describe("toArabicNumerals", () => {
  it("converts 0 to ٠", () => {
    expect(toArabicNumerals(0)).toBe("٠");
  });

  it("converts 123 to ١٢٣", () => {
    expect(toArabicNumerals(123)).toBe("١٢٣");
  });

  it("converts string input '2026' to ٢٠٢٦", () => {
    expect(toArabicNumerals("2026")).toBe("٢٠٢٦");
  });

  it("preserves non-digit characters", () => {
    expect(toArabicNumerals("12:30")).toBe("١٢:٣٠");
  });

  it("handles large numbers", () => {
    expect(toArabicNumerals(999999)).toBe("٩٩٩٩٩٩");
  });

  it("handles single digit", () => {
    expect(toArabicNumerals(5)).toBe("٥");
  });
});

describe("formatArabicDate", () => {
  it("formats Feb 18, 2026 correctly", () => {
    const result = formatArabicDate(new Date(2026, 1, 18));
    expect(result).toBe("١٨ فبراير ٢٠٢٦");
  });

  it("formats Jan 1, 2026 correctly", () => {
    const result = formatArabicDate(new Date(2026, 0, 1));
    expect(result).toBe("١ يناير ٢٠٢٦");
  });

  it("formats Dec 31, 2026 correctly", () => {
    const result = formatArabicDate(new Date(2026, 11, 31));
    expect(result).toBe("٣١ ديسمبر ٢٠٢٦");
  });
});

describe("formatArabicDateShort", () => {
  it("formats Feb 18 without year", () => {
    const result = formatArabicDateShort(new Date(2026, 1, 18));
    expect(result).toBe("١٨ فبراير");
  });

  it("omits year for any date", () => {
    const result = formatArabicDateShort(new Date(2026, 5, 15));
    expect(result).not.toContain("٢٠٢٦");
  });
});

describe("formatArabicDateFull", () => {
  it("includes Arabic weekday name", () => {
    // Feb 18, 2026 is a Wednesday
    const result = formatArabicDateFull(new Date(2026, 1, 18));
    expect(result).toContain("١٨ فبراير ٢٠٢٦");
    // Should have a weekday prefix
    expect(result.length).toBeGreaterThan("١٨ فبراير ٢٠٢٦".length);
  });
});

describe("formatNumber", () => {
  it("formats 0 with default 2 decimals", () => {
    const result = formatNumber(0);
    expect(result).toContain("٠");
  });

  it("respects custom decimal count", () => {
    const result = formatNumber(1234.5, 0);
    // Should not have decimal part
    expect(result).not.toContain(".");
  });

  it("formats with Arabic-locale separators", () => {
    const result = formatNumber(1234.56);
    // Should contain Arabic digits
    expect(result).toMatch(/[٠-٩]/);
  });
});

describe("MS_PER_DAY", () => {
  it("equals 86400000", () => {
    expect(MS_PER_DAY).toBe(86_400_000);
  });
});
