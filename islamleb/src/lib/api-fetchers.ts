/**
 * API fetcher utilities for live financial and calendar data.
 * All fetchers include localStorage-based caching with TTLs to avoid rate limits.
 *
 * - Exchange rates: open.er-api.com (free, no key, daily updates) → cached 6h
 * - Gold/Silver prices: api.gold-api.com (free, no key) → cached 1h
 * - Ramadan dates: api.aladhan.com (free, no key) → cached 24h
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExchangeRatesResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}

export interface MetalPriceResponse {
  price: number;
  currency: string;
  metal: string;
  timestamp: number;
}

export interface HijriCalendarDay {
  hijri: { day: string; month: { number: number; en: string; ar: string } };
  gregorian: { date: string; day: string; month: { number: number; en: string } };
}

export interface RamadanDatesResult {
  start: Date;
  end: Date;
  eid: Date;
  totalDays: number;
}

// ---------------------------------------------------------------------------
// Cache utilities
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_KEYS = {
  EXCHANGE_RATES: "islamleb-cache-exchange-rates",
  GOLD_PRICE: "islamleb-cache-gold-price",
  SILVER_PRICE: "islamleb-cache-silver-price",
  RAMADAN_DATES: "islamleb-cache-ramadan-dates",
} as const;

const TTL = {
  EXCHANGE_RATES: 6 * 60 * 60 * 1000, // 6 hours
  METAL_PRICES: 1 * 60 * 60 * 1000,   // 1 hour
  RAMADAN_DATES: 24 * 60 * 60 * 1000,  // 24 hours
} as const;

function getCached<T>(key: string, ttl: number): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Exchange Rates
// ---------------------------------------------------------------------------

export async function fetchExchangeRates(
  signal?: AbortSignal,
): Promise<ExchangeRatesResponse> {
  const cached = getCached<ExchangeRatesResponse>(
    CACHE_KEYS.EXCHANGE_RATES,
    TTL.EXCHANGE_RATES,
  );
  if (cached) return cached;

  const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal });
  if (!res.ok) throw new Error("فشل في تحميل أسعار الصرف");
  const data: ExchangeRatesResponse = await res.json();
  setCache(CACHE_KEYS.EXCHANGE_RATES, data);
  return data;
}

// ---------------------------------------------------------------------------
// Gold & Silver Prices (USD per troy ounce → convert to per gram)
// ---------------------------------------------------------------------------

const TROY_OZ_TO_GRAMS = 31.1035;

export async function fetchGoldPricePerGram(
  signal?: AbortSignal,
): Promise<number> {
  const cached = getCached<number>(CACHE_KEYS.GOLD_PRICE, TTL.METAL_PRICES);
  if (cached !== null) return cached;

  const res = await fetch("https://api.gold-api.com/price/XAU", { signal });
  if (!res.ok) throw new Error("فشل في تحميل سعر الذهب");
  const data: MetalPriceResponse = await res.json();
  const pricePerGram = data.price / TROY_OZ_TO_GRAMS;
  setCache(CACHE_KEYS.GOLD_PRICE, pricePerGram);
  return pricePerGram;
}

export async function fetchSilverPricePerGram(
  signal?: AbortSignal,
): Promise<number> {
  const cached = getCached<number>(CACHE_KEYS.SILVER_PRICE, TTL.METAL_PRICES);
  if (cached !== null) return cached;

  const res = await fetch("https://api.gold-api.com/price/XAG", { signal });
  if (!res.ok) throw new Error("فشل في تحميل سعر الفضة");
  const data: MetalPriceResponse = await res.json();
  const pricePerGram = data.price / TROY_OZ_TO_GRAMS;
  setCache(CACHE_KEYS.SILVER_PRICE, pricePerGram);
  return pricePerGram;
}

// ---------------------------------------------------------------------------
// Ramadan Dates (Hijri-to-Gregorian via Aladhan)
// ---------------------------------------------------------------------------

interface RamadanDatesSerialized {
  start: string;
  end: string;
  eid: string;
  totalDays: number;
}

export async function fetchRamadanDates(
  hijriYear = 1447,
  signal?: AbortSignal,
): Promise<RamadanDatesResult> {
  // Check cache (dates are serialized as ISO strings)
  const cached = getCached<RamadanDatesSerialized>(
    CACHE_KEYS.RAMADAN_DATES,
    TTL.RAMADAN_DATES,
  );
  if (cached) {
    return {
      start: new Date(cached.start),
      end: new Date(cached.end),
      eid: new Date(cached.eid),
      totalDays: cached.totalDays,
    };
  }

  const res = await fetch(
    `https://api.aladhan.com/v1/hToGCalendar/9/${hijriYear}`,
    { signal },
  );
  if (!res.ok) throw new Error("فشل في تحميل تواريخ رمضان");
  const json = await res.json();
  const days: HijriCalendarDay[] = json.data;

  if (!days || days.length === 0) {
    throw new Error("لم يتم العثور على بيانات تواريخ رمضان");
  }

  const firstDay = days[0].gregorian.date; // DD-MM-YYYY
  const lastDay = days[days.length - 1].gregorian.date;

  const parseAladhanDate = (dateStr: string): Date => {
    const [dd, mm, yyyy] = dateStr.split("-").map(Number);
    return new Date(yyyy, mm - 1, dd);
  };

  const start = parseAladhanDate(firstDay);
  const end = parseAladhanDate(lastDay);
  const eid = new Date(end);
  eid.setDate(eid.getDate() + 1);

  // Cache as serialized ISO strings
  setCache<RamadanDatesSerialized>(CACHE_KEYS.RAMADAN_DATES, {
    start: start.toISOString(),
    end: end.toISOString(),
    eid: eid.toISOString(),
    totalDays: days.length,
  });

  return { start, end, eid, totalDays: days.length };
}
