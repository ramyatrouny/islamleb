import { describe, it, expect } from "vitest";
import { RAMADAN_2026, ARABIC_NUMERALS, ARABIC_MONTHS, STORAGE_KEYS } from "@/lib/constants";

describe("RAMADAN_2026", () => {
  it("START is Feb 18, 2026", () => {
    expect(RAMADAN_2026.START.getFullYear()).toBe(2026);
    expect(RAMADAN_2026.START.getMonth()).toBe(1); // Feb = 1
    expect(RAMADAN_2026.START.getDate()).toBe(18);
  });

  it("END is Mar 19, 2026", () => {
    expect(RAMADAN_2026.END.getMonth()).toBe(2); // Mar = 2
    expect(RAMADAN_2026.END.getDate()).toBe(19);
  });

  it("EID is Mar 20, 2026", () => {
    expect(RAMADAN_2026.EID.getMonth()).toBe(2);
    expect(RAMADAN_2026.EID.getDate()).toBe(20);
  });

  it("TOTAL_DAYS is 30", () => {
    expect(RAMADAN_2026.TOTAL_DAYS).toBe(30);
  });
});

describe("ARABIC_NUMERALS", () => {
  it("has exactly 10 entries (0-9)", () => {
    expect(ARABIC_NUMERALS).toHaveLength(10);
  });

  it("maps 0 to ٠ and 9 to ٩", () => {
    expect(ARABIC_NUMERALS[0]).toBe("٠");
    expect(ARABIC_NUMERALS[9]).toBe("٩");
  });
});

describe("ARABIC_MONTHS", () => {
  it("has exactly 12 entries", () => {
    expect(ARABIC_MONTHS).toHaveLength(12);
  });

  it("first month is يناير (January)", () => {
    expect(ARABIC_MONTHS[0]).toBe("يناير");
  });

  it("last month is ديسمبر (December)", () => {
    expect(ARABIC_MONTHS[11]).toBe("ديسمبر");
  });
});

describe("STORAGE_KEYS", () => {
  it("STORE key is islamleb-store", () => {
    expect(STORAGE_KEYS.STORE).toBe("islamleb-store");
  });
});
