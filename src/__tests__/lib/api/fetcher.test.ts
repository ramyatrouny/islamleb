import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to re-import apiFetch fresh for each test to clear the in-memory cache.
// Since the cache is module-level, we use vi.resetModules().
let apiFetch: typeof import("@/lib/api/fetcher").apiFetch;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("@/lib/api/fetcher");
  apiFetch = mod.apiFetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiFetch", () => {
  it("returns parsed JSON on successful fetch", async () => {
    const mockData = { result: "ok" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await apiFetch("https://api.example.com/data");
    expect(result).toEqual(mockData);
  });

  it("caches response and returns cached on second call", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ value: 1 }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("https://api.example.com/cached");
    const result = await apiFetch("https://api.example.com/cached");

    expect(result).toEqual({ value: 1 });
    expect(mockFetch).toHaveBeenCalledTimes(1); // Only fetched once
  });

  it("does not use expired cache entries", async () => {
    vi.useFakeTimers();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ value: "fresh" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await apiFetch("https://api.example.com/expiring", { cacheTTL: 1000 });

    // Advance past TTL
    vi.advanceTimersByTime(2000);

    await apiFetch("https://api.example.com/expiring", { cacheTTL: 1000 });
    expect(mockFetch).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("retries once on failure by default", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ recovered: true }),
      });
    vi.stubGlobal("fetch", mockFetch);

    const result = await apiFetch("https://api.example.com/retry");
    expect(result).toEqual({ recovered: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws after all retries exhausted", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Permanent failure"));
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      apiFetch("https://api.example.com/fail", { retries: 1 }),
    ).rejects.toThrow("Permanent failure");
    expect(mockFetch).toHaveBeenCalledTimes(2); // initial + 1 retry
  });

  it("respects retries=0 (no retry)", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Fail"));
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      apiFetch("https://api.example.com/no-retry", { retries: 0 }),
    ).rejects.toThrow("Fail");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("throws AbortError immediately without retrying", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    const mockFetch = vi.fn().mockRejectedValue(abortError);
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      apiFetch("https://api.example.com/abort"),
    ).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("handles HTTP error status codes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    await expect(
      apiFetch("https://api.example.com/404", { retries: 0 }),
    ).rejects.toThrow("HTTP 404");
  });

  it("passes signal to fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal("fetch", mockFetch);
    const controller = new AbortController();

    await apiFetch("https://api.example.com/signal", {
      signal: controller.signal,
    });

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/signal", {
      signal: controller.signal,
    });
  });
});
