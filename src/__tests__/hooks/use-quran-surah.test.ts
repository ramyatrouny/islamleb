import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useQuranSurahs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("fetches and returns chapters data", async () => {
    const mockChapters = [
      { id: 1, name_arabic: "الفاتحة", verses_count: 7 },
      { id: 2, name_arabic: "البقرة", verses_count: 286 },
    ];

    vi.doMock("@/lib/api/quran-com", () => ({
      fetchChapters: vi.fn().mockResolvedValue({ chapters: mockChapters }),
    }));

    const { useQuranSurahs } = await import("@/hooks/use-quran-surah");
    const { result } = renderHook(() => useQuranSurahs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockChapters);
  });

  it("sets error on failure", async () => {
    vi.doMock("@/lib/api/quran-com", () => ({
      fetchChapters: vi.fn().mockRejectedValue(new Error("Failed")),
    }));

    const { useQuranSurahs } = await import("@/hooks/use-quran-surah");
    const { result } = renderHook(() => useQuranSurahs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed");
  });
});
