import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "التقويم الرمضاني | إسلام لبنان",
  description: "التقويم الرمضاني لعام 1447 هجري - 30 يوماً من العبادة مع الأعمال اليومية",
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
