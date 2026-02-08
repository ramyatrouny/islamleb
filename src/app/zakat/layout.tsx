import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة الزكاة | إسلام لبنان",
  description: "احسب زكاة المال وزكاة الفطر والفدية والكفارة بدقة وفق الشريعة الإسلامية",
};

export default function ZakatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
