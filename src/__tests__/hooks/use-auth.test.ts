import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";

// Mock Firebase to prevent initialization errors in tests
vi.mock("@/lib/firebase/config", () => ({
  auth: {},
  db: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth: unknown, cb: (user: null) => void) => {
    cb(null);
    return vi.fn();
  }),
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase/auth", () => ({
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
}));

import { AuthContext, type AuthContextValue } from "@/providers/auth-provider";
import { useAuth } from "@/hooks/use-auth";

const noop = async () => {};
const noopWithArgs = async (..._args: string[]) => {};

function createMockValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
    loading: false,
    signIn: noopWithArgs as AuthContextValue["signIn"],
    signUp: noopWithArgs as AuthContextValue["signUp"],
    signInGoogle: noop,
    signOut: noop,
    ...overrides,
  };
}

function wrapper(value: AuthContextValue) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(AuthContext.Provider, { value }, children);
  };
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when used outside AuthProvider", () => {
    // Suppress console.error from React for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
    spy.mockRestore();
  });

  it("returns null user when not authenticated", () => {
    const mockValue = createMockValue();
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper(mockValue),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("returns loading=true when auth is resolving", () => {
    const mockValue = createMockValue({ loading: true });
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper(mockValue),
    });

    expect(result.current.loading).toBe(true);
  });

  it("returns user when authenticated", () => {
    const mockUser = { uid: "abc123", email: "test@test.com" } as AuthContextValue["user"];
    const mockValue = createMockValue({ user: mockUser });
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper(mockValue),
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.uid).toBe("abc123");
  });

  it("exposes all auth methods", () => {
    const mockValue = createMockValue();
    const { result } = renderHook(() => useAuth(), {
      wrapper: wrapper(mockValue),
    });

    expect(typeof result.current.signIn).toBe("function");
    expect(typeof result.current.signUp).toBe("function");
    expect(typeof result.current.signInGoogle).toBe("function");
    expect(typeof result.current.signOut).toBe("function");
  });
});
