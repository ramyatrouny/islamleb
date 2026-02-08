import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا | إسلام لبنان",
  description: "تواصل مع فريق التطوير، أبلغ عن مشكلة، أو ساهم في تطوير المشروع",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
