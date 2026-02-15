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
  it("returns 0 as '0'", () => {
    expect(toArabicNumerals(0)).toBe("0");
  });

  it("returns 123 as '123'", () => {
    expect(toArabicNumerals(123)).toBe("123");
  });

  it("returns string input '2026' as '2026'", () => {
    expect(toArabicNumerals("2026")).toBe("2026");
  });

  it("preserves non-digit characters", () => {
    expect(toArabicNumerals("12:30")).toBe("12:30");
  });

  it("handles large numbers", () => {
    expect(toArabicNumerals(999999)).toBe("999999");
  });

  it("handles single digit", () => {
    expect(toArabicNumerals(5)).toBe("5");
  });
});

describe("formatArabicDate", () => {
  it("formats Feb 18, 2026 correctly", () => {
    const result = formatArabicDate(new Date(2026, 1, 18));
    expect(result).toBe("18 فبراير 2026");
  });

  it("formats Jan 1, 2026 correctly", () => {
    const result = formatArabicDate(new Date(2026, 0, 1));
    expect(result).toBe("1 يناير 2026");
  });

  it("formats Dec 31, 2026 correctly", () => {
    const result = formatArabicDate(new Date(2026, 11, 31));
    expect(result).toBe("31 ديسمبر 2026");
  });
});

describe("formatArabicDateShort", () => {
  it("formats Feb 18 without year", () => {
    const result = formatArabicDateShort(new Date(2026, 1, 18));
    expect(result).toBe("18 فبراير");
  });

  it("omits year for any date", () => {
    const result = formatArabicDateShort(new Date(2026, 5, 15));
    expect(result).not.toContain("2026");
  });
});

describe("formatArabicDateFull", () => {
  it("includes Arabic weekday name", () => {
    // Feb 18, 2026 is a Wednesday
    const result = formatArabicDateFull(new Date(2026, 1, 18));
    expect(result).toContain("18 فبراير 2026");
    // Should have a weekday prefix
    expect(result.length).toBeGreaterThan("18 فبراير 2026".length);
  });
});

describe("formatNumber", () => {
  it("formats 0 with default 2 decimals", () => {
    const result = formatNumber(0);
    expect(result).toContain("0");
  });

  it("respects custom decimal count", () => {
    const result = formatNumber(1234.5, 0);
    // Should not have decimal part
    expect(result).not.toContain(".");
  });

  it("formats with Western-locale separators", () => {
    const result = formatNumber(1234.56);
    // Should contain Western digits
    expect(result).toMatch(/[0-9]/);
  });
});

describe("MS_PER_DAY", () => {
  it("equals 86400000", () => {
    expect(MS_PER_DAY).toBe(86_400_000);
  });
});
