import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/header";

// Mock UserMenu to avoid Firebase initialization in header tests
vi.mock("@/components/user-menu", () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

// Mock useAuth to avoid AuthProvider requirement
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: null, loading: false, signOut: vi.fn() }),
}));

// Mock useAuthModal store
vi.mock("@/hooks/use-auth-modal", () => ({
  useAuthModal: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ open: vi.fn(), close: vi.fn(), isOpen: false, tab: "login", setTab: vi.fn() }),
}));

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

// Mock framer-motion to render static elements
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === "div") return ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children as React.ReactNode}</div>;
        return ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children as React.ReactNode}</div>;
      },
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Header", () => {
  it("renders site name", () => {
    render(<Header />);
    expect(screen.getByText("إسلام لبنان")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getAllByText("الرئيسية").length).toBeGreaterThan(0);
  });

  it("renders mobile menu button", () => {
    render(<Header />);
    expect(screen.getByLabelText("فتح القائمة")).toBeInTheDocument();
  });

  it("mobile menu button opens drawer", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("فتح القائمة"));
    expect(screen.getByLabelText("إغلاق القائمة")).toBeInTheDocument();
  });

  it("close button closes mobile drawer", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByLabelText("فتح القائمة"));
    await user.click(screen.getByLabelText("إغلاق القائمة"));

    // After closing, the close button should not be present
    expect(screen.queryByLabelText("إغلاق القائمة")).not.toBeInTheDocument();
  });
});
