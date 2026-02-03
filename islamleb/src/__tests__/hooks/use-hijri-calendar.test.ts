import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useHijriCalendar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("fetches and returns calendar data for given month/year", async () => {
    const mockDays = [
      { timings: {}, date: { hijri: { day: "1" }, gregorian: { date: "18-02-2026" } } },
    ];

    vi.doMock("@/lib/api/aladhan", () => ({
      fetchHijriCalendar: vi.fn().mockResolvedValue({ code: 200, data: mockDays }),
    }));

    const { useHijriCalendar } = await import("@/hooks/use-hijri-calendar");
    const { result } = renderHook(() => useHijriCalendar(9, 1447));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockDays);
  });

  it("sets error on failure", async () => {
    vi.doMock("@/lib/api/aladhan", () => ({
      fetchHijriCalendar: vi.fn().mockRejectedValue(new Error("API down")),
    }));

    const { useHijriCalendar } = await import("@/hooks/use-hijri-calendar");
    const { result } = renderHook(() => useHijriCalendar(9, 1447));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("API down");
  });
});
