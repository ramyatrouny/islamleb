"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Menu, X, User, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { isNavActive } from "@/lib/navigation-utils";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const openModal = useAuthModal((s) => s.open);

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
                islamleb.com
              </span>
            </div>
          </Link>

          {/* Desktop Navigation + User Menu */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1">
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
            <div className="ms-2 border-s border-border/50 ps-3">
              <UserMenu />
            </div>
          </div>

          {/* Mobile: User Menu + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <UserMenu />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
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
              className="fixed inset-y-0 end-0 z-50 w-72 bg-background border-s border-border shadow-2xl flex flex-col"
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

              {/* User Section */}
              <div className="border-b border-border px-4 py-4">
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        (user.displayName ?? user.email ?? "؟")[0].toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.displayName ?? "مستخدم"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openModal("login");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors active:bg-primary/15"
                  >
                    <User className="h-5 w-5" />
                    تسجيل الدخول / إنشاء حساب
                  </button>
                )}
              </div>

              {/* Drawer Nav Links */}
              <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
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
              <div className="border-t border-border px-4 py-4">
                {user && (
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 mb-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10 active:bg-red-400/15"
                  >
                    <LogOut className="h-5 w-5" />
                    تسجيل الخروج
                  </button>
                )}
                <p className="text-center text-xs text-muted-foreground">
                  islamleb.com
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
