import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "ختمة القرآن | إسلام لبنان",
  description: "تتبع ختمة القرآن الكريم في شهر رمضان المبارك - جزء يومياً لإتمام الختمة",
};

export default function QuranLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
