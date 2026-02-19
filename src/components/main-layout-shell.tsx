"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";

export function MainLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <BottomNav />
    </>
  );
}
