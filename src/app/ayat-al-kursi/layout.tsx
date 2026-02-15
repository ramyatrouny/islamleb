import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "آية الكرسي | إسلام لبنان",
  description: "آية الكرسي — أعظم آية في كتاب الله — سورة البقرة الآية ٢٥٥ مع فضائلها",
};

export default function AyatAlKursiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
