import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BottomNav from "@/components/bottom-nav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("BottomNav", () => {
  it("renders 5 navigation items", () => {
    render(<BottomNav />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
  });

  it("renders correct labels", () => {
    render(<BottomNav />);
    expect(screen.getByText("الرئيسية")).toBeInTheDocument();
    expect(screen.getByText("الصلاة")).toBeInTheDocument();
    expect(screen.getByText("القرآن")).toBeInTheDocument();
    expect(screen.getByText("الأذكار")).toBeInTheDocument();
    expect(screen.getByText("المتتبع")).toBeInTheDocument();
  });

  it("links have correct hrefs", () => {
    render(<BottomNav />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/prayer-times");
    expect(hrefs).toContain("/quran");
    expect(hrefs).toContain("/adhkar");
    expect(hrefs).toContain("/tracker");
  });
});
