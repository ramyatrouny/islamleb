import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

describe("useQuranJuz", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("starts with empty juzData and no loading", async () => {
    vi.doMock("@/lib/api/alquran-cloud", () => ({
      fetchJuzText: vi.fn(),
    }));

    const { useQuranJuz } = await import("@/hooks/use-quran-juz");
    const { result } = renderHook(() => useQuranJuz());

    expect(result.current.juzData).toEqual({});
    expect(result.current.loadingJuz).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("loadJuz fetches and extracts surah ranges", async () => {
    const mockData = {
      code: 200,
      status: "OK",
      data: {
        number: 1,
        ayahs: [
          {
            number: 1,
            text: "test",
            surah: { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
            numberInSurah: 1,
            juz: 1,
            page: 1,
          },
          {
            number: 7,
            text: "test",
            surah: { number: 1, name: "الفاتحة", englishName: "Al-Fatiha", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
            numberInSurah: 7,
            juz: 1,
            page: 1,
          },
          {
            number: 8,
            text: "test",
            surah: { number: 2, name: "البقرة", englishName: "Al-Baqara", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
            numberInSurah: 1,
            juz: 1,
            page: 2,
          },
        ],
      },
    };

    vi.doMock("@/lib/api/alquran-cloud", () => ({
      fetchJuzText: vi.fn().mockResolvedValue(mockData),
    }));

    const { useQuranJuz } = await import("@/hooks/use-quran-juz");
    const { result } = renderHook(() => useQuranJuz());

    await act(async () => {
      await result.current.loadJuz(1);
    });

    await waitFor(() => {
      expect(result.current.juzData[1]).toBeDefined();
    });

    const ranges = result.current.juzData[1];
    expect(ranges).toHaveLength(2);
    expect(ranges[0].surahNumber).toBe(1);
    expect(ranges[0].surahName).toBe("الفاتحة");
    expect(ranges[0].fromAyah).toBe(1);
    expect(ranges[0].toAyah).toBe(7);
    expect(ranges[1].surahNumber).toBe(2);
  });

  it("sets error on fetch failure", async () => {
    vi.doMock("@/lib/api/alquran-cloud", () => ({
      fetchJuzText: vi.fn().mockRejectedValue(new Error("Network error")),
    }));

    const { useQuranJuz } = await import("@/hooks/use-quran-juz");
    const { result } = renderHook(() => useQuranJuz());

    await act(async () => {
      await result.current.loadJuz(1);
    });

    await waitFor(() => {
      expect(result.current.error).toBe("تعذّر تحميل بيانات الجزء");
    });
  });

  it("skips fetch if juz already loaded", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      code: 200,
      status: "OK",
      data: { number: 1, ayahs: [] },
    });

    vi.doMock("@/lib/api/alquran-cloud", () => ({
      fetchJuzText: mockFetch,
    }));

    const { useQuranJuz } = await import("@/hooks/use-quran-juz");
    const { result } = renderHook(() => useQuranJuz());

    await act(async () => {
      await result.current.loadJuz(1);
    });

    // Call again — should not re-fetch
    await act(async () => {
      await result.current.loadJuz(1);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
