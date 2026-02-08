import type { Metadata } from "next";
import { Amiri, Noto_Naskh_Arabic } from "next/font/google";

import "./globals.css";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";
import { RamadanDatesFetcher } from "@/components/ramadan-dates-fetcher";

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "إسلام لبنان | رمضان ٢٠٢٦",
  description:
    "رفيقك الرقمي في شهر رمضان المبارك ٢٠٢٦ - مواقيت الصلاة، القرآن الكريم، الأذكار، متتبع الصيام، حاسبة الزكاة والمزيد",
  keywords: "رمضان, رمضان 2026, مواقيت الصلاة, قرآن, أذكار, زكاة, لبنان, إسلام",
  openGraph: {
    title: "إسلام لبنان | رمضان ٢٠٢٦",
    description: "رفيقك الرقمي في شهر رمضان المبارك ٢٠٢٦",
    locale: "ar_LB",
    type: "website",
    url: "https://islamleb.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark overflow-x-clip">
      <body
        className={`${notoNaskhArabic.variable} ${amiri.variable} font-(family-name:--font-noto-naskh-arabic) antialiased overflow-x-clip`}
      >
        <RamadanDatesFetcher />
        <Header />
        <main className="min-h-screen pb-20 md:pb-0 overflow-x-clip">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
