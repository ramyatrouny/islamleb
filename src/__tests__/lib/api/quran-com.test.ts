import { describe, it, expect, vi, afterEach } from "vitest";

describe("quran-com API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("fetchChapters calls apiFetch with correct URL and 1h cache", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ chapters: [] });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchChapters } = await import("@/lib/api/quran-com");
    await fetchChapters();

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.stringContaining("chapters?language=ar"),
      expect.objectContaining({ cacheTTL: 3600000 }),
    );
  });

  it("fetchChapters passes signal", async () => {
    const mockApiFetch = vi.fn().mockResolvedValue({ chapters: [] });
    vi.doMock("@/lib/api/fetcher", () => ({ apiFetch: mockApiFetch }));

    const { fetchChapters } = await import("@/lib/api/quran-com");
    const controller = new AbortController();
    await fetchChapters(controller.signal);

    expect(mockApiFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal }),
    );
  });
});
