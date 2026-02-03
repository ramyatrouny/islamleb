import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/page-header";
import { Calculator } from "lucide-react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: () => {
        return ({ children, ...props }: Record<string, unknown>) => (
          <header {...props}>{children as React.ReactNode}</header>
        );
      },
    },
  ),
}));

describe("PageHeader", () => {
  it("renders title text", () => {
    render(<PageHeader title="حاسبة الزكاة" />);
    expect(screen.getByText("حاسبة الزكاة")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<PageHeader title="Title" subtitle="Subtitle text" />);
    expect(screen.getByText("Subtitle text")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(<PageHeader title="Title" />);
    const paragraphs = container.querySelectorAll("p");
    // Should not have a subtitle paragraph
    expect(paragraphs.length).toBe(0);
  });
});
