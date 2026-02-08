import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// getCached and setCache are not exported, so we test them indirectly through
// the exported fetchers. However, we can test localStorage caching behavior
// via the exported functions.

describe("localStorage caching (via fetchExchangeRates)", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            result: "success",
            base_code: "USD",
            rates: { USD: 1, LBP: 89500 },
            time_last_update_utc: "2026-02-18T00:00:00Z",
          }),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("fetches from API when no cache exists", async () => {
    const { fetchExchangeRates } = await import("@/lib/api-fetchers");
    const result = await fetchExchangeRates();
    expect(result.result).toBe("success");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("uses cached data within TTL", async () => {
    // Pre-populate cache
    const cached = {
      data: {
        result: "cached",
        base_code: "USD",
        rates: { USD: 1 },
        time_last_update_utc: "",
      },
      timestamp: Date.now(),
    };
    localStorage.setItem("islamleb-cache-exchange-rates", JSON.stringify(cached));

    vi.resetModules();
    const { fetchExchangeRates } = await import("@/lib/api-fetchers");
    const result = await fetchExchangeRates();
    expect(result.result).toBe("cached");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches fresh data when cache is expired", async () => {
    // Pre-populate cache with expired timestamp (7 hours ago, TTL is 6h)
    const expired = {
      data: {
        result: "stale",
        base_code: "USD",
        rates: { USD: 1 },
        time_last_update_utc: "",
      },
      timestamp: Date.now() - 7 * 60 * 60 * 1000,
    };
    localStorage.setItem("islamleb-cache-exchange-rates", JSON.stringify(expired));

    vi.resetModules();
    const { fetchExchangeRates } = await import("@/lib/api-fetchers");
    const result = await fetchExchangeRates();
    expect(result.result).toBe("success"); // fresh from API
  });
});

describe("fetchGoldPricePerGram", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("converts troy ounce to grams", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            price: 2000, // $2000/oz
            currency: "USD",
            metal: "XAU",
            timestamp: Date.now(),
          }),
      }),
    );

    vi.resetModules();
    const { fetchGoldPricePerGram } = await import("@/lib/api-fetchers");
    const result = await fetchGoldPricePerGram();
    // 2000 / 31.1035 ≈ 64.30
    expect(result).toBeCloseTo(2000 / 31.1035, 2);
  });
});

describe("fetchRamadanDates", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("parses Aladhan calendar response correctly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                hijri: { day: "1", month: { number: 9, en: "Ramadan", ar: "رمضان" } },
                gregorian: { date: "18-02-2026", day: "18", month: { number: 2, en: "February" } },
              },
              // ... 28 more days would normally be here ...
              {
                hijri: { day: "30", month: { number: 9, en: "Ramadan", ar: "رمضان" } },
                gregorian: { date: "19-03-2026", day: "19", month: { number: 3, en: "March" } },
              },
            ],
          }),
      }),
    );

    vi.resetModules();
    const { fetchRamadanDates } = await import("@/lib/api-fetchers");
    const result = await fetchRamadanDates();

    expect(result.start.getMonth()).toBe(1); // Feb
    expect(result.start.getDate()).toBe(18);
    expect(result.end.getMonth()).toBe(2); // Mar
    expect(result.end.getDate()).toBe(19);
    expect(result.eid.getDate()).toBe(20); // Day after end
    expect(result.totalDays).toBe(2); // Only 2 items in our mock
  });
});
