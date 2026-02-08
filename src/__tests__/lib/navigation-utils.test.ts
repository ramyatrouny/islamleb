import { describe, it, expect } from "vitest";
import { isNavActive } from "@/lib/navigation-utils";

describe("isNavActive", () => {
  it('returns true for "/" when pathname is "/"', () => {
    expect(isNavActive("/", "/")).toBe(true);
  });

  it('returns false for "/" when pathname is "/prayer-times"', () => {
    expect(isNavActive("/", "/prayer-times")).toBe(false);
  });

  it('returns true for "/prayer-times" when pathname matches exactly', () => {
    expect(isNavActive("/prayer-times", "/prayer-times")).toBe(true);
  });

  it("returns true for a sub-path of the href", () => {
    expect(isNavActive("/prayer-times", "/prayer-times/settings")).toBe(true);
  });

  it("returns false for unrelated paths", () => {
    expect(isNavActive("/quran", "/prayer-times")).toBe(false);
  });

  it("returns false for a partial match that isn't a prefix", () => {
    expect(isNavActive("/tracker", "/")).toBe(false);
  });
});
