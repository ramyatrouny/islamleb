import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@/components/error-boundary";

// A component that throws
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Test error");
  return <div>Normal content</div>;
}

// Suppress console.error for error boundary tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  it("renders children normally when no error", () => {
    render(
      <ErrorBoundary>
        <div>Hello</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders default fallback UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("حدث خطأ غير متوقع")).toBeInTheDocument();
    expect(screen.getByText("إعادة المحاولة")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
  });

  it("retry button clears error and re-renders children", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function ConditionalThrow() {
      if (shouldThrow) throw new Error("Test");
      return <div>Recovered</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("حدث خطأ غير متوقع")).toBeInTheDocument();

    // Stop throwing before retry
    shouldThrow = false;
    await user.click(screen.getByText("إعادة المحاولة"));

    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });
});
