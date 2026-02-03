import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conflicting Tailwind classes", () => {
    // twMerge should resolve conflicts, keeping the last one
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });

  it("handles undefined/null/false values", () => {
    const result = cn("foo", undefined, null, false, "bar");
    expect(result).toBe("foo bar");
  });
});
