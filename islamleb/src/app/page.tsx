"use client";

import { useState, useEffect, useMemo } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Clock,
  BookOpen,
  Heart,
  CalendarDays,
  Calculator,
  Calendar,
  Star,
  Quote,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RAMADAN_2026 } from "@/lib/constants";
import { getTimeRemaining, getRamadanDay, getTodayIftar, isRamadan } from "@/lib/date-utils";
import { fetchPrayerTimes } from "@/lib/api/aladhan";
import { ramadanHadiths } from "@/lib/hadith-data";
import type { TimeRemaining } from "@/lib/types";

// --- Quick Access Items (page-specific UI config) ---
const quickAccessItems = [
  {
    title: "مواقيت الصلاة",
    description: "أوقات الصلاة والإمساكية اليومية",
    icon: Clock,
    href: "/prayer-times",
  },
  {
    title: "القرآن الكريم",
    description: "تلاوة وتصفح المصحف الشريف",
    icon: BookOpen,
    href: "/quran",
  },
  {
    title: "الأذكار والأدعية",
    description: "أذكار الصباح والمساء وأدعية رمضان",
    icon: Heart,
    href: "/adhkar",
  },
  {
    title: "متتبع العبادات",
    description: "تتبع صلاتك وصيامك وقراءتك",
    icon: CalendarDays,
    href: "/tracker",
  },
  {
    title: "حاسبة الزكاة",
    description: "احسب زكاة مالك بسهولة",
    icon: Calculator,
    href: "/zakat",
  },
  {
    title: "التقويم الرمضاني",
    description: "التقويم الكامل لشهر رمضان المبارك",
    icon: Calendar,
    href: "/calendar",
  },
];

// --- Compute countdown state using shared utilities ---
function computeCountdownState(maghribTime?: string | null): {
  phase: "before" | "during" | "after";
  timeLeft: TimeRemaining;
  ramadanDay: number;
} {
  const now = new Date();
  if (now < RAMADAN_2026.START) {
    return {
      phase: "before",
      timeLeft: getTimeRemaining(RAMADAN_2026.START),
      ramadanDay: 1,
    };
  } else if (isRamadan(now)) {
    const iftar = getTodayIftar(maghribTime ?? undefined);
    return {
      phase: "during",
      timeLeft: now < iftar ? getTimeRemaining(iftar) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
      ramadanDay: getRamadanDay(now),
    };
  }
  return {
    phase: "after",
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    ramadanDay: 1,
  };
}

// --- Helper: pick a daily hadith based on day-of-year ---
function getDailyHadithIndex(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return dayOfYear % ramadanHadiths.length;
}

// --- Floating star for hero background ---
function HeroStar({
  size,
  x,
  y,
  delay,
  repeatDelay,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
  repeatDelay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0.3, 0.7, 0],
        scale: [0, 1, 0.8, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay,
      }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
          fill="#d4a574"
          fillOpacity={0.5}
        />
      </svg>
    </motion.div>
  );
}

const HERO_STARS = [
  { size: 8, x: "8%", y: "20%", delay: 0.5, repeatDelay: 2.1 },
  { size: 6, x: "15%", y: "35%", delay: 1.2, repeatDelay: 3.4 },
  { size: 10, x: "82%", y: "18%", delay: 0.2, repeatDelay: 1.8 },
  { size: 7, x: "88%", y: "40%", delay: 1.8, repeatDelay: 2.7 },
  { size: 5, x: "25%", y: "12%", delay: 2.3, repeatDelay: 3.1 },
  { size: 9, x: "72%", y: "10%", delay: 0.8, repeatDelay: 2.4 },
  { size: 6, x: "50%", y: "8%", delay: 3.0, repeatDelay: 1.5 },
  { size: 7, x: "38%", y: "42%", delay: 1.5, repeatDelay: 3.8 },
];

// --- Animated countdown digit ---
function CountdownDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <Card
      className="border-0"
      style={{
        backgroundColor: "rgba(212,165,116,0.08)",
        borderColor: "rgba(212,165,116,0.15)",
        borderWidth: "1px",
      }}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-3xl font-bold tabular-nums md:text-5xl"
            style={{ color: "#d4a574" }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
        <span
          className="mt-1 text-sm md:text-base"
          style={{ color: "rgba(212,165,116,0.6)" }}
        >
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [maghribTime, setMaghribTime] = useState<string | null>(null);
  const [countdownState, setCountdownState] = useState(() => computeCountdownState());
  const mounted = useHydrated();

  const { phase, timeLeft, ramadanDay } = countdownState;

  const dailyHadith = useMemo(() => ramadanHadiths[getDailyHadithIndex()], []);

  // Fetch today's Maghrib time from Aladhan API
  useEffect(() => {
    const controller = new AbortController();
    fetchPrayerTimes("Beirut", "Lebanon", 2, controller.signal)
      .then((res) => {
        const maghrib = res.data?.timings?.Maghrib;
        if (maghrib) setMaghribTime(maghrib);
      })
      .catch(() => {
        // Silently fall back to default iftar time
      });
    return () => controller.abort();
  }, []);

  // Update countdown every second, using fetched Maghrib time when available
  useEffect(() => {
    setCountdownState(computeCountdownState(maghribTime));
    const interval = setInterval(() => setCountdownState(computeCountdownState(maghribTime)), 1000);
    return () => clearInterval(interval);
  }, [maghribTime]);

  const countdownUnits = [
    { label: "يوم", value: timeLeft.days },
    { label: "ساعة", value: timeLeft.hours },
    { label: "دقيقة", value: timeLeft.minutes },
    { label: "ثانية", value: timeLeft.seconds },
  ];

  return (
    <div
      className="overflow-x-clip"
      style={{
        backgroundColor: "#0a0a0f",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(45,106,79,0.05) 0%, transparent 50%)",
      }}
    >
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-16 pb-8 text-center overflow-hidden">
        {/* Geometric pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #d4a574 12%, transparent 12.5%, transparent 87%, #d4a574 87.5%, #d4a574),
              linear-gradient(150deg, #d4a574 12%, transparent 12.5%, transparent 87%, #d4a574 87.5%, #d4a574),
              linear-gradient(30deg, #d4a574 12%, transparent 12.5%, transparent 87%, #d4a574 87.5%, #d4a574),
              linear-gradient(150deg, #d4a574 12%, transparent 12.5%, transparent 87%, #d4a574 87.5%, #d4a574),
              linear-gradient(60deg, #2d6a4f 25%, transparent 25.5%, transparent 75%, #2d6a4f 75%, #2d6a4f),
              linear-gradient(60deg, #2d6a4f 25%, transparent 25.5%, transparent 75%, #2d6a4f 75%, #2d6a4f)
            `,
            backgroundSize: "80px 140px",
            backgroundPosition:
              "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
          }}
        />

        {/* Ambient glow behind moon */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 w-[300px] h-[300px] rounded-full bg-[#d4a574] blur-[80px] pointer-events-none"
        />

        {/* Floating hero stars */}
        {HERO_STARS.map((star, i) => (
          <HeroStar key={i} {...star} />
        ))}

        {/* Animated crescent moon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-6 relative"
        >
          <motion.div
            animate={{ rotate: [0, 8, -8, 4, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Moon glow ring */}
            <motion.div
              animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#d4a574]/15 blur-2xl scale-150"
            />
            <Moon
              size={72}
              style={{ color: "#d4a574" }}
              strokeWidth={1.5}
              fill="rgba(212,165,116,0.15)"
              className="relative"
            />
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mb-4 text-6xl font-bold md:text-7xl"
          style={{
            background: "linear-gradient(135deg, #d4a574, #f0d6a8, #c2955a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          رمضان كريم
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="w-24 h-px bg-linear-to-l from-transparent via-[#d4a574]/50 to-transparent mb-4"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-xl md:text-2xl"
          style={{ color: "rgba(212,165,116,0.7)" }}
        >
          رمضان ٢٠٢٦ | ١٤٤٧ هـ
        </motion.p>
      </section>

      {/* ===================== COUNTDOWN SECTION ===================== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mx-auto max-w-3xl px-4 py-8 text-center"
      >
        {phase === "before" && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-2xl font-semibold md:text-3xl"
            style={{ color: "#d4a574" }}
          >
            الوقت المتبقي لشهر رمضان المبارك
          </motion.h2>
        )}

        {phase === "during" && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-2xl font-semibold md:text-3xl"
            style={{ color: "#d4a574" }}
          >
            اليوم {mounted ? ramadanDay : "..."} من رمضان
            <span
              className="mt-2 block text-lg font-normal"
              style={{ color: "rgba(212,165,116,0.6)" }}
            >
              الوقت المتبقي حتى الإفطار
            </span>
          </motion.h2>
        )}

        {phase === "after" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="py-8"
          >
            <h2
              className="mb-2 text-4xl font-bold md:text-5xl"
              style={{
                background:
                  "linear-gradient(135deg, #d4a574, #f0d6a8, #c2955a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              عيد مبارك
            </h2>
            <p style={{ color: "rgba(212,165,116,0.7)" }} className="text-lg">
              تقبّل الله منّا ومنكم صالح الأعمال
            </p>
          </motion.div>
        )}

        {phase !== "after" && mounted && (
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {countdownUnits.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
              >
                <CountdownDigit value={unit.value} label={unit.label} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ===================== QUICK ACCESS GRID ===================== */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center text-2xl font-semibold"
          style={{ color: "#e8e8ed" }}
        >
          الوصول السريع
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {quickAccessItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.5,
                delay: 0.08 * i,
                ease: "easeOut",
              }}
            >
              <Link href={item.href} className="block h-full">
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                  <Card
                    className="h-full cursor-pointer border border-[rgba(45,106,79,0.2)] bg-[rgba(45,106,79,0.1)] transition-all duration-300 hover:bg-[rgba(45,106,79,0.18)] hover:border-[rgba(212,165,116,0.3)] hover:shadow-[0_8px_30px_rgba(212,165,116,0.08)]"
                  >
                    <CardHeader className="items-center gap-3 pb-0 text-center">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon
                          size={32}
                          style={{ color: "#d4a574" }}
                          strokeWidth={1.5}
                        />
                      </motion.div>
                      <CardTitle
                        className="text-base md:text-lg"
                        style={{ color: "#e8e8ed" }}
                      >
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(232,232,237,0.5)" }}
                      >
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== DAILY HADITH CARD ===================== */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl px-4 py-8"
      >
        <Card
          className="border-0 relative overflow-hidden"
          style={{
            backgroundColor: "rgba(212,165,116,0.06)",
            borderColor: "rgba(212,165,116,0.25)",
            borderWidth: "1px",
          }}
        >
          {/* Shimmer glow behind hadith */}
          <motion.div
            animate={{ opacity: [0, 0.08, 0], x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-[#d4a574] to-transparent pointer-events-none"
          />

          <CardHeader className="items-center gap-2 text-center relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Quote
                size={28}
                style={{ color: "#d4a574", opacity: 0.6 }}
                strokeWidth={1.5}
              />
            </motion.div>
            <CardTitle
              className="text-lg"
              style={{ color: "rgba(212,165,116,0.7)" }}
            >
              حديث اليوم
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center relative">
            <p
              className="mb-4 text-xl font-semibold leading-loose md:text-2xl"
              style={{ color: "#e8e8ed" }}
            >
              &laquo; {dailyHadith.text} &raquo;
            </p>
            <p
              className="text-sm"
              style={{ color: "rgba(212,165,116,0.6)" }}
            >
              {dailyHadith.source}
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* ===================== RAMADAN INFO BANNER ===================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-4 pb-16 pt-4"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center justify-center gap-3 rounded-xl px-6 py-5 text-center"
          style={{
            backgroundColor: "rgba(45,106,79,0.12)",
            borderColor: "rgba(45,106,79,0.25)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star
              size={22}
              style={{ color: "#d4a574", flexShrink: 0 }}
              strokeWidth={1.5}
              fill="rgba(212,165,116,0.3)"
            />
          </motion.div>
          <p
            className="text-sm leading-relaxed md:text-base"
            style={{ color: "rgba(232,232,237,0.75)" }}
          >
            رمضان ٢٠٢٦ يبدأ يوم الأربعاء ١٨ فبراير ٢٠٢٦ وينتهي يوم الخميس
            ١٩ مارس ٢٠٢٦
          </p>
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star
              size={22}
              style={{ color: "#d4a574", flexShrink: 0 }}
              strokeWidth={1.5}
              fill="rgba(212,165,116,0.3)"
            />
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
