import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "مواقيت الصلاة | إسلام لبنان",
  description: "مواقيت الصلاة اليومية لجميع المدن اللبنانية مع أوقات الإمساك والإفطار في رمضان ١٤٤٧",
};

export default function PrayerTimesLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
