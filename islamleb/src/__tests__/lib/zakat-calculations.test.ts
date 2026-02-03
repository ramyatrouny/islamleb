import { describe, it, expect } from "vitest";
import { calculateMal, calculateFitr, calculateFidya, ZAKAT_RATE } from "@/lib/zakat-calculations";
import type { AssetField } from "@/lib/zakat-calculations";

const FIELDS: AssetField[] = [
  { key: "cash" },
  { key: "gold" },
  { key: "silver" },
  { key: "stocks" },
  { key: "business" },
  { key: "debtsOwed" },
  { key: "debtsYouOwe", subtract: true },
];

describe("calculateMal", () => {
  it("sums assets and subtracts debts", () => {
    const assets = {
      cash: 5000,
      gold: 2000,
      silver: 500,
      stocks: 1000,
      business: 0,
      debtsOwed: 500,
      debtsYouOwe: 1000,
    };
    const result = calculateMal(assets, FIELDS, 5000);
    // 5000 + 2000 + 500 + 1000 + 0 + 500 - 1000 = 8000
    expect(result.total).toBe(8000);
    expect(result.belowNisab).toBe(false);
    expect(result.zakat).toBeCloseTo(8000 * ZAKAT_RATE);
  });

  it("returns belowNisab=true when total is below nisab", () => {
    const assets = { cash: 100, gold: 0, silver: 0, stocks: 0, business: 0, debtsOwed: 0, debtsYouOwe: 0 };
    const result = calculateMal(assets, FIELDS, 5000);
    expect(result.belowNisab).toBe(true);
    expect(result.zakat).toBe(0);
  });

  it("floors negative totals to 0", () => {
    const assets = { cash: 100, gold: 0, silver: 0, stocks: 0, business: 0, debtsOwed: 0, debtsYouOwe: 5000 };
    const result = calculateMal(assets, FIELDS, 1000);
    expect(result.total).toBe(0);
    expect(result.belowNisab).toBe(true);
  });

  it("handles zero total", () => {
    const assets = { cash: 0, gold: 0, silver: 0, stocks: 0, business: 0, debtsOwed: 0, debtsYouOwe: 0 };
    const result = calculateMal(assets, FIELDS, 5000);
    expect(result.total).toBe(0);
    expect(result.zakat).toBe(0);
    expect(result.belowNisab).toBe(true);
  });

  it("calculates at nisab boundary", () => {
    const assets = { cash: 5000, gold: 0, silver: 0, stocks: 0, business: 0, debtsOwed: 0, debtsYouOwe: 0 };
    // total = nisab exactly → NOT below nisab
    const result = calculateMal(assets, FIELDS, 5000);
    expect(result.belowNisab).toBe(false);
    expect(result.zakat).toBeCloseTo(5000 * ZAKAT_RATE);
  });
});

describe("calculateFitr", () => {
  it("returns familySize * fitrPerPerson", () => {
    expect(calculateFitr(4, 10)).toBe(40);
  });

  it("handles single person", () => {
    expect(calculateFitr(1, 15)).toBe(15);
  });
});

describe("calculateFidya", () => {
  it("returns days * costPerMeal * 2", () => {
    expect(calculateFidya(10, 5)).toBe(100);
  });

  it("returns 0 for 0 days", () => {
    expect(calculateFidya(0, 5)).toBe(0);
  });
});
