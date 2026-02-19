"use client";

import { type ReactNode } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Loader2, ShieldX } from "lucide-react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#d4a574]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <ShieldX className="size-16 text-red-400" />
        <h1 className="text-2xl font-semibold text-white">Access Denied</h1>
        <p className="text-neutral-400">
          You do not have permission to view this page.
        </p>
        <a
          href="/"
          className="mt-4 rounded-lg bg-[#d4a574] px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-[#c4955f]"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
