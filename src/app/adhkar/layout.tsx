import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأذكار والأدعية | إسلام لبنان",
  description: "أذكار الصباح والمساء وأدعية رمضان مع عدّاد التسبيح الرقمي",
};

export default function AdhkarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
