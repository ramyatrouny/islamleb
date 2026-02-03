import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "متتبع العبادات | إسلام لبنان",
  description: "تتبع صيامك وأهدافك الروحية اليومية خلال شهر رمضان المبارك ١٤٤٧",
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
