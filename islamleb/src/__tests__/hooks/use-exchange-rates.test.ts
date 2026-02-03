import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useZakatFinancialData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("returns financial data with currencies and nisab values", async () => {
    vi.doMock("@/lib/api-fetchers", () => ({
      fetchExchangeRates: vi.fn().mockResolvedValue({
        result: "success",
        base_code: "USD",
        rates: { USD: 1, LBP: 89500, EUR: 0.92, SAR: 3.75, AED: 3.67 },
        time_last_update_utc: "2026-02-18T00:00:00Z",
      }),
      fetchGoldPricePerGram: vi.fn().mockResolvedValue(64.65),
      fetchSilverPricePerGram: vi.fn().mockResolvedValue(0.76),
    }));

    const { useZakatFinancialData } = await import("@/hooks/use-exchange-rates");
    const { result } = renderHook(() => useZakatFinancialData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currencies).toHaveLength(5);
    expect(result.current.currencies[0].code).toBe("USD");
    expect(result.current.currencies[0].rate).toBe(1);
    expect(result.current.goldPricePerGram).toBe(64.65);
    expect(result.current.silverPricePerGram).toBe(0.76);
    // Nisab: 85g * 64.65 = 5495.25, rounded = 5495
    expect(result.current.goldNisabUsd).toBe(Math.round(64.65 * 85));
    // Nisab: 595g * 0.76 = 452.2, rounded = 452
    expect(result.current.silverNisabUsd).toBe(Math.round(0.76 * 595));
    expect(result.current.lastUpdated).not.toBeNull();
  });

  it("uses fallback values when APIs fail", async () => {
    vi.doMock("@/lib/api-fetchers", () => ({
      fetchExchangeRates: vi.fn().mockRejectedValue(new Error("fail")),
      fetchGoldPricePerGram: vi.fn().mockRejectedValue(new Error("fail")),
      fetchSilverPricePerGram: vi.fn().mockRejectedValue(new Error("fail")),
    }));

    const { useZakatFinancialData } = await import("@/hooks/use-exchange-rates");
    const { result } = renderHook(() => useZakatFinancialData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still have currencies with fallback rates
    expect(result.current.currencies).toHaveLength(5);
    expect(result.current.currencies[0].rate).toBe(1); // USD fallback
    // Should use fallback metal prices
    expect(result.current.goldPricePerGram).toBeCloseTo(64.65, 1);
    expect(result.current.silverPricePerGram).toBeCloseTo(0.76, 1);
    expect(result.current.error).not.toBeNull();
  });

  it("returns loading=true while fetching", async () => {
    vi.doMock("@/lib/api-fetchers", () => ({
      fetchExchangeRates: vi.fn(() => new Promise(() => {})),
      fetchGoldPricePerGram: vi.fn(() => new Promise(() => {})),
      fetchSilverPricePerGram: vi.fn(() => new Promise(() => {})),
    }));

    const { useZakatFinancialData } = await import("@/hooks/use-exchange-rates");
    const { result } = renderHook(() => useZakatFinancialData());

    expect(result.current.loading).toBe(true);
  });
});
