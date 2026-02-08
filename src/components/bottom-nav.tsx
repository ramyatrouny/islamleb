"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/config/navigation";
import { isNavActive } from "@/lib/navigation-utils";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => isNavActive(href, pathname);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/90 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span
                className={`text-xs leading-tight ${
                  active ? "font-semibold" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
