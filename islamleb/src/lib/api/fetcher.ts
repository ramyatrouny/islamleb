/**
 * Shared fetch wrapper with in-memory cache, retry, and AbortSignal support.
 * All API clients in this directory use this as their foundation.
 */

const cache = new Map<string, { data: unknown; expiry: number }>();

interface FetchOptions {
  /** Cache time-to-live in milliseconds (default: 5 minutes) */
  cacheTTL?: number;
  /** Number of retries on failure (default: 1) */
  retries?: number;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}

export async function apiFetch<T>(
  url: string,
  options?: FetchOptions,
): Promise<T> {
  const { cacheTTL = 5 * 60 * 1000, retries = 1, signal } = options ?? {};

  // Check cache
  const cached = cache.get(url);
  if (cached && cached.expiry > Date.now()) {
    return cached.data as T;
  }

  // Fetch with retry
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: T = await res.json();
      cache.set(url, { data, expiry: Date.now() + cacheTTL });
      return data;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") throw err;
      lastError = err as Error;
    }
  }

  throw lastError;
}
