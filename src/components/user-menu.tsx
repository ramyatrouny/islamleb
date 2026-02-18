"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, User, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const openModal = useAuthModal((s) => s.open);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => openModal("login")}
        className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/15 hover:border-primary/50 hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">تسجيل الدخول</span>
      </button>
    );
  }

  const initial = (user.displayName ?? user.email ?? "؟")[0].toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-transparent transition-all duration-200 hover:bg-primary/25 hover:ring-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-label="قائمة المستخدم"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute start-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-border/60 bg-card shadow-xl"
          >
            <div className="border-b border-border/30 px-4 py-3">
              <p className="text-sm font-medium text-foreground truncate">
                {user.displayName ?? "مستخدم"}
              </p>
              <p className="text-xs text-muted-foreground truncate" dir="ltr">
                {user.email}
              </p>
            </div>
            <div className="p-1.5">
              <button
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-all duration-150 hover:bg-red-400/10 hover:text-red-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
