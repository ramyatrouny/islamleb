import { describe, it, expect, vi, afterEach } from "vitest";

describe("aladhan API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("fetchPrayerTimes calls apiFetch with correct URL", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: {} });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchPrayerTimes } = await import("@/lib/api/aladhan");
    await fetchPrayerTimes("Beirut", "Lebanon");

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.stringContaining("timingsByCity?city=Beirut&country=Lebanon&method=2"),
      expect.objectContaining({ cacheTTL: 300000 }),
    );
  });

  it("fetchPrayerTimes passes custom method", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: {} });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchPrayerTimes } = await import("@/lib/api/aladhan");
    await fetchPrayerTimes("Mecca", "Saudi Arabia", 4);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.stringContaining("method=4"),
      expect.any(Object),
    );
  });

  it("fetchPrayerTimes passes signal", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: {} });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchPrayerTimes } = await import("@/lib/api/aladhan");
    const controller = new AbortController();
    await fetchPrayerTimes("Beirut", "Lebanon", 2, controller.signal);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it("fetchHijriCalendar calls apiFetch with correct URL", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: [] });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchHijriCalendar } = await import("@/lib/api/aladhan");
    await fetchHijriCalendar(9, 1447);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.stringContaining("hijriCalendar/9/1447"),
      expect.objectContaining({ cacheTTL: 3600000 }),
    );
  });
});
