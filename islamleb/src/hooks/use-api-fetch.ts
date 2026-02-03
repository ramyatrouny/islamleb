"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic React hook for API data fetching with loading/error states.
 * Supports AbortSignal for cleanup and optional fallback data on error.
 */
export function useApiFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  fallback?: T,
): UseApiFetchResult<T> {
  const [data, setData] = useState<T | null>(fallback ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchRef
      .current(controller.signal)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "حدث خطأ غير متوقّع",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchRef
      .current(new AbortController().signal)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "حدث خطأ غير متوقّع",
        );
        setLoading(false);
      });
  }, []);

  return { data, loading, error, refetch };
}
