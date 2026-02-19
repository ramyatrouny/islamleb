import type { Metadata } from "next";
import { Amiri, Noto_Naskh_Arabic } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { RamadanDatesFetcher } from "@/components/ramadan-dates-fetcher";
import { AuthProvider } from "@/providers/auth-provider";
import { FirestoreSyncInitializer } from "@/components/firestore-sync-initializer";
import { AuthModal } from "@/components/auth-modal";
import { MainLayoutShell } from "@/components/main-layout-shell";

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
  metadataBase: new URL("https://islamleb.com"),
  title: "إسلام لبنان | islamleb.com",
  description:
    "رفيقك الرقمي في شهر رمضان المبارك - مواقيت الصلاة، القرآن الكريم، الأذكار، متتبع الصيام، حاسبة الزكاة والمزيد",
  keywords: "رمضان, مواقيت الصلاة, قرآن, أذكار, زكاة, لبنان, إسلام, islamleb",
  openGraph: {
    title: "إسلام لبنان | islamleb.com",
    description:
      "رفيقك الرقمي في شهر رمضان المبارك - مواقيت الصلاة، القرآن الكريم، الأذكار، متتبع الصيام، حاسبة الزكاة والمزيد",
    locale: "ar_LB",
    type: "website",
    url: "https://islamleb.com",
    siteName: "إسلام لبنان",
  },
  twitter: {
    card: "summary_large_image",
    title: "إسلام لبنان | islamleb.com",
    description:
      "رفيقك الرقمي في شهر رمضان المبارك - مواقيت الصلاة، القرآن الكريم، الأذكار، متتبع الصيام، حاسبة الزكاة والمزيد",
  },
  other: {
    "theme-color": "#0a0a0f",
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
        <AuthProvider>
          <FirestoreSyncInitializer />
          <RamadanDatesFetcher />
          <AuthModal />
          <MainLayoutShell>
            <main className="min-h-screen pb-20 md:pb-0 overflow-x-clip">{children}</main>
          </MainLayoutShell>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-GNLB11NC30" />
    </html>
  );
}
