import { describe, it, expect } from "vitest";
import {
  staggerContainer,
  fastStaggerContainer,
  fadeUpItem,
  scaleUpItem,
  sectionReveal,
} from "@/lib/animations";

describe("animation variants", () => {
  it("staggerContainer has hidden and visible states", () => {
    expect(staggerContainer.hidden).toBeDefined();
    expect(staggerContainer.visible).toBeDefined();
  });

  it("fastStaggerContainer has faster stagger than staggerContainer", () => {
    const fast = (fastStaggerContainer.visible as Record<string, unknown>).transition as Record<string, number>;
    const normal = (staggerContainer.visible as Record<string, unknown>).transition as Record<string, number>;
    expect(fast.staggerChildren).toBeLessThan(normal.staggerChildren);
  });

  it("fadeUpItem starts hidden with y offset", () => {
    const hidden = fadeUpItem.hidden as Record<string, number>;
    expect(hidden.opacity).toBe(0);
    expect(hidden.y).toBeGreaterThan(0);
  });

  it("scaleUpItem starts with scale < 1", () => {
    const hidden = scaleUpItem.hidden as Record<string, number>;
    expect(hidden.scale).toBeLessThan(1);
  });

  it("sectionReveal has hidden and visible states", () => {
    expect(sectionReveal.hidden).toBeDefined();
    expect(sectionReveal.visible).toBeDefined();
  });
});
