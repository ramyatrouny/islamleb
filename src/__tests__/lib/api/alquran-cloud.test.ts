import { describe, it, expect, vi, afterEach } from "vitest";

describe("alquran-cloud API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("fetchJuzText calls apiFetch with correct URL and 30min cache", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: {} });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchJuzText } = await import("@/lib/api/alquran-cloud");
    await fetchJuzText(5);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.stringContaining("juz/5/quran-uthmani"),
      expect.objectContaining({ cacheTTL: 1800000 }),
    );
  });

  it("fetchJuzText passes signal", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: {} });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchJuzText } = await import("@/lib/api/alquran-cloud");
    const controller = new AbortController();
    await fetchJuzText(1, controller.signal);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it("fetchJuzAudio calls apiFetch with alafasy edition", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ code: 200, data: {} });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchJuzAudio } = await import("@/lib/api/alquran-cloud");
    await fetchJuzAudio(10);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.stringContaining("juz/10/ar.alafasy"),
      expect.objectContaining({ cacheTTL: 1800000 }),
    );
  });
});
