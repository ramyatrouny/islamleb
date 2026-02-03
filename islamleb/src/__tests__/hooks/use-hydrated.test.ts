import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHydrated } from "@/hooks/use-hydrated";

describe("useHydrated", () => {
  it("returns true on client (happy-dom environment)", () => {
    const { result } = renderHook(() => useHydrated());
    expect(result.current).toBe(true);
  });

  it("returns consistent value across re-renders", () => {
    const { result, rerender } = renderHook(() => useHydrated());
    expect(result.current).toBe(true);
    rerender();
    expect(result.current).toBe(true);
  });
});
