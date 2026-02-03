import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useApiFetch } from "@/hooks/use-api-fetch";

describe("useApiFetch", () => {
  it("sets loading=true initially", () => {
    const fetchFn = vi.fn(() => new Promise<string>(() => {})); // never resolves
    const { result } = renderHook(() => useApiFetch(fetchFn, []));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets data and loading=false on success", async () => {
    const fetchFn = vi.fn(() => Promise.resolve({ value: 42 }));
    const { result } = renderHook(() => useApiFetch(fetchFn, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ value: 42 });
    expect(result.current.error).toBeNull();
  });

  it("sets error and loading=false on failure", async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error("API Error")));
    const { result } = renderHook(() => useApiFetch(fetchFn, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("API Error");
    expect(result.current.data).toBeNull();
  });

  it("uses fallback data initially when provided", () => {
    const fetchFn = vi.fn(() => new Promise<string>(() => {}));
    const { result } = renderHook(() => useApiFetch(fetchFn, [], "fallback"));
    expect(result.current.data).toBe("fallback");
  });

  it("handles AbortError silently", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    const fetchFn = vi.fn(() => Promise.reject(abortError));
    const { result } = renderHook(() => useApiFetch(fetchFn, []));

    // Wait a tick
    await new Promise((r) => setTimeout(r, 50));

    // AbortError should not set error state
    expect(result.current.error).toBeNull();
  });

  it("refetch() triggers a new fetch", async () => {
    let callCount = 0;
    const fetchFn = vi.fn(() => {
      callCount++;
      return Promise.resolve(`result-${callCount}`);
    });
    const { result } = renderHook(() => useApiFetch(fetchFn, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBe("result-1");

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toBe("result-2");
    });
  });

  it("sets generic Arabic error for non-Error rejections", async () => {
    const fetchFn = vi.fn(() => Promise.reject("string error"));
    const { result } = renderHook(() => useApiFetch(fetchFn, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("حدث خطأ غير متوقّع");
  });
});
