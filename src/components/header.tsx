"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { isNavActive } from "@/lib/navigation-utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => isNavActive(href, pathname);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Site Name */}
          <Link href="/" className="flex items-center gap-2">
            <Moon className="h-7 w-7 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight text-foreground">
                إسلام لبنان
              </span>
              <span className="text-[10px] leading-tight text-muted-foreground">
                رمضان 2026 | 1447 هـ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer - slides from right for RTL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 end-0 z-50 w-72 bg-background border-s border-border shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <div className="flex items-center gap-2">
                  <Moon className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold text-foreground">
                    إسلام لبنان
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  aria-label="إغلاق القائمة"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="flex flex-col gap-1 p-4">
                {NAV_ITEMS.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="absolute bottom-0 start-0 end-0 border-t border-border px-4 py-4">
                <p className="text-center text-xs text-muted-foreground">
                  رمضان 2026 | 1447 هـ
                </p>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  تقبل الله منا ومنكم
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
