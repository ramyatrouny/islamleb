import { describe, it, expect } from "vitest";
import { isNavActive } from "@/lib/navigation-utils";
import { getVisibleNavItems } from "@/config/navigation";

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

describe("getVisibleNavItems", () => {
  it("includes calendar during ramadan", () => {
    const items = getVisibleNavItems("ramadan");
    expect(items.some((i) => i.href === "/calendar")).toBe(true);
  });

  it("hides calendar during normal phase", () => {
    const items = getVisibleNavItems("normal");
    expect(items.some((i) => i.href === "/calendar")).toBe(false);
  });

  it("renames tracker outside Ramadan", () => {
    const items = getVisibleNavItems("normal");
    const tracker = items.find((i) => i.href === "/tracker");
    expect(tracker?.label).toBe("صيام السنّة");
  });

  it("renames tracker during eid-al-fitr (Eid is not Ramadan)", () => {
    const items = getVisibleNavItems("eid-al-fitr");
    const tracker = items.find((i) => i.href === "/tracker");
    expect(tracker?.label).toBe("صيام السنّة");
  });
});
