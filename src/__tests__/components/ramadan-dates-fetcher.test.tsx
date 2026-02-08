import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";

describe("RamadanDatesFetcher", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("renders nothing (returns null)", async () => {
    vi.doMock("@/lib/api-fetchers", () => ({
      fetchRamadanDates: vi.fn().mockResolvedValue({
        start: new Date(2026, 1, 18),
        end: new Date(2026, 2, 19),
        eid: new Date(2026, 2, 20),
        totalDays: 30,
      }),
    }));

    const { RamadanDatesFetcher } = await import("@/components/ramadan-dates-fetcher");
    const { container } = render(<RamadanDatesFetcher />);
    expect(container.innerHTML).toBe("");
  });

  it("calls fetchRamadanDates on mount", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      start: new Date(2026, 1, 18),
      end: new Date(2026, 2, 19),
      eid: new Date(2026, 2, 20),
      totalDays: 30,
    });

    vi.doMock("@/lib/api-fetchers", () => ({
      fetchRamadanDates: mockFetch,
    }));

    const { RamadanDatesFetcher } = await import("@/components/ramadan-dates-fetcher");
    render(<RamadanDatesFetcher />);

    // Wait for useEffect
    await new Promise((r) => setTimeout(r, 50));

    expect(mockFetch).toHaveBeenCalledWith(1447, expect.any(Object));
  });
});
