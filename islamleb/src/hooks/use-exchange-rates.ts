"use client";

import { useMemo } from "react";
import { useApiFetch } from "./use-api-fetch";
import {
  fetchExchangeRates,
  fetchGoldPricePerGram,
  fetchSilverPricePerGram,
} from "@/lib/api-fetchers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CurrencyRate {
  code: string;
  symbol: string;
  label: string;
  rate: number;
}

export interface ZakatFinancialData {
  currencies: CurrencyRate[];
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldNisabUsd: number;
  silverNisabUsd: number;
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;

const CURRENCY_META: { code: string; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "دولار أمريكي" },
  { code: "LBP", symbol: "ل.ل", label: "ليرة لبنانية" },
  { code: "EUR", symbol: "€", label: "يورو" },
  { code: "SAR", symbol: "ر.س", label: "ريال سعودي" },
  { code: "AED", symbol: "د.إ", label: "درهم إماراتي" },
];

/** Fallback rates in case the API is unavailable */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  LBP: 89500,
  EUR: 0.92,
  SAR: 3.75,
  AED: 3.67,
};

const FALLBACK_GOLD_PER_GRAM = 64.65; // ~$2010/oz ÷ 31.1035
const FALLBACK_SILVER_PER_GRAM = 0.76; // ~$23.5/oz ÷ 31.1035

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useZakatFinancialData(): ZakatFinancialData {
  // Fetch exchange rates
  const rates = useApiFetch(
    (signal) => fetchExchangeRates(signal),
    [],
  );

  // Fetch gold price per gram (USD)
  const gold = useApiFetch(
    (signal) => fetchGoldPricePerGram(signal),
    [],
  );

  // Fetch silver price per gram (USD)
  const silver = useApiFetch(
    (signal) => fetchSilverPricePerGram(signal),
    [],
  );

  const loading = rates.loading || gold.loading || silver.loading;
  const error = rates.error || gold.error || silver.error;

  // Memoize derived values to prevent infinite re-render loops
  return useMemo(() => {
    const apiRates = rates.data?.rates;
    const goldPricePerGram = gold.data ?? FALLBACK_GOLD_PER_GRAM;
    const silverPricePerGram = silver.data ?? FALLBACK_SILVER_PER_GRAM;

    const currencies: CurrencyRate[] = CURRENCY_META.map((meta) => ({
      ...meta,
      rate: apiRates?.[meta.code] ?? FALLBACK_RATES[meta.code] ?? 1,
    }));

    const goldNisabUsd = Math.round(goldPricePerGram * GOLD_NISAB_GRAMS);
    const silverNisabUsd = Math.round(silverPricePerGram * SILVER_NISAB_GRAMS);

    const lastUpdated = rates.data?.time_last_update_utc
      ? new Date(rates.data.time_last_update_utc).toLocaleDateString("ar-LB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    return {
      currencies,
      goldPricePerGram,
      silverPricePerGram,
      goldNisabUsd,
      silverNisabUsd,
      lastUpdated,
      loading,
      error,
    };
  }, [rates.data, gold.data, silver.data, loading, error]);
}
