"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Error Boundary State & Props                                       */
/* ------------------------------------------------------------------ */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/* ------------------------------------------------------------------ */
/*  ErrorBoundary – Class Component                                    */
/* ------------------------------------------------------------------ */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4">
          {/* Subtle radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#d4a574] opacity-[0.04] blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            {/* Icon */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-[#d4a574]/20 blur-xl" />
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-[#d4a574]/30 bg-[#d4a574]/10">
                <AlertCircle className="w-10 h-10 text-[#d4a574]" />
              </div>
            </div>

            {/* Message */}
            <h2 className="text-2xl font-bold font-(family-name:--font-amiri) text-[#d4a574] mb-3 leading-relaxed">
              حدث خطأ غير متوقع
            </h2>

            {/* Divider */}
            <div className="w-16 h-px bg-linear-to-l from-transparent via-[#d4a574]/60 to-transparent mb-4" />

            <p className="text-sm text-muted-foreground font-(family-name:--font-amiri) mb-8 leading-relaxed">
              نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.
            </p>

            {/* Retry button */}
            <Button
              onClick={this.handleReset}
              size="lg"
              className="gap-2 bg-[#2d6a4f]/15 text-[#2d6a4f] border border-[#2d6a4f]/30 hover:bg-[#2d6a4f]/25 hover:border-[#2d6a4f]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(45,106,79,0.2)]"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  withErrorBoundary – HOC wrapper                                    */
/* ------------------------------------------------------------------ */
function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

  const WithErrorBoundary = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}

export { ErrorBoundary, withErrorBoundary };
