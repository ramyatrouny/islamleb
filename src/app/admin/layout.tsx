"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { AdminGuard } from "@/components/admin-guard";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen" dir="ltr">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-[#0d0d14]">
      <div className="border-b border-white/10 p-5">
        <h1 className="text-lg font-semibold text-[#d4a574]">Admin Panel</h1>
        {user?.displayName && (
          <p className="mt-1 truncate text-xs text-neutral-400">
            {user.displayName}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#d4a574]/15 text-[#d4a574]"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
