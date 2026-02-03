"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Flame,
  CalendarDays,
  Target,
  TrendingUp,
  RotateCcw,
  Star,
  Download,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { RAMADAN_2026 } from "@/lib/constants";
import { toArabicNumerals, formatArabicDateShort } from "@/lib/formatters";
import { getRamadanDate, getRamadanDayIndex } from "@/lib/date-utils";
import { sectionReveal } from "@/lib/animations";
import { useRamadanStore } from "@/lib/store";
import { useRamadanDate } from "@/hooks/use-ramadan-date";
import { SPIRITUAL_GOALS } from "@/config/spiritual-goals";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/ui/progress-ring";

// ─── Page-specific helpers ──────────────────────────────────────────────────

function calculateStreak(fasting: boolean[]): number {
  let streak = 0;
  const todayIdx = getRamadanDayIndex();
  const lastChecked = todayIdx >= 0 ? todayIdx : RAMADAN_2026.TOTAL_DAYS - 1;
  for (let i = lastChecked; i >= 0; i--) {
    if (fasting[i]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function TrackerPage() {
  // ── Store state ─────────────────────────────────────────────────────────
  const fastingDays = useRamadanStore((s) => s.fastingDays);
  const toggleFastingDay = useRamadanStore((s) => s.toggleFastingDay);
  const dailyGoals = useRamadanStore((s) => s.dailyGoals);
  const toggleGoal = useRamadanStore((s) => s.toggleGoal);

  // ── Hydration guard ─────────────────────────────────────────────────────
  const mounted = useHydrated();
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Wraps toggleFastingDay with streak-celebration logic (event-driven, no effect)
  const handleToggleFasting = (dayIndex: number) => {
    const oldStreak = calculateStreak(fastingDays);
    toggleFastingDay(dayIndex);
    // Check streak after toggle — since Zustand updates synchronously,
    // we can compute the new streak from the toggled array directly.
    const next = [...fastingDays];
    next[dayIndex] = !next[dayIndex];
    const newStreak = calculateStreak(next);
    if (newStreak > oldStreak) {
      setShowCelebration(true);
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
      celebrationTimer.current = setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  // Clean up celebration timer on unmount
  useEffect(() => {
    return () => {
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    };
  }, []);

  // ── Reduced-motion preference ──────────────────────────────────────────
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── File input ref for import ─────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Ramadan date info ───────────────────────────────────────────────────
  const { dayIndex: todayIndex, daysRemaining } = useRamadanDate();

  // ─── Derived state ─────────────────────────────────────────────────────

  const daysFasted = useMemo(() => fastingDays.filter(Boolean).length, [fastingDays]);

  const remainingDays = useMemo(() => {
    if (todayIndex < 0) return RAMADAN_2026.TOTAL_DAYS;
    return daysRemaining;
  }, [todayIndex, daysRemaining]);

  const completionPercent = useMemo(
    () => Math.round((daysFasted / RAMADAN_2026.TOTAL_DAYS) * 100),
    [daysFasted]
  );

  const missedDays = useMemo(() => {
    if (todayIndex < 0) return 0;
    let count = 0;
    for (let i = 0; i < todayIndex; i++) {
      if (!fastingDays[i]) count++;
    }
    return count;
  }, [fastingDays, todayIndex]);

  const streak = useMemo(() => calculateStreak(fastingDays), [fastingDays]);

  const activeDayIndex = todayIndex >= 0 ? todayIndex : 0;

  const currentDayGoals = useMemo(() => {
    return dailyGoals[activeDayIndex] || new Array(SPIRITUAL_GOALS.length).fill(false);
  }, [dailyGoals, activeDayIndex]);

  const goalsCompleted = useMemo(
    () => currentDayGoals.filter(Boolean).length,
    [currentDayGoals]
  );

  const overallProgress = useMemo(() => {
    if (todayIndex < 0) return 0;
    return Math.round(((todayIndex + 1) / RAMADAN_2026.TOTAL_DAYS) * 100);
  }, [todayIndex]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">
          جاري التحميل...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Page Header ─────────────────────────────────────────── */}
        <PageHeader
          title="متتبع العبادات"
          subtitle="تتبع صيامك وعباداتك في رمضان"
        />

        {/* ─── Statistics Dashboard ─────────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {/* Days Fasted */}
          <Card className="border-[#2d6a4f]/30 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4 text-[#2d6a4f]" />
                أيام الصيام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#2d6a4f]">
                {toArabicNumerals(daysFasted)}
                <span className="text-base text-muted-foreground font-normal">
                  /{toArabicNumerals(30)}
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Remaining Days */}
          <Card className="border-[#d4a574]/30 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="size-4 text-[#d4a574]" />
                الأيام المتبقية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4a574]">
                {toArabicNumerals(remainingDays)}
              </p>
            </CardContent>
          </Card>

          {/* Completion Percentage */}
          <Card className="border-[#d4a574]/30 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="size-4 text-[#d4a574]" />
                نسبة الإنجاز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d4a574] mb-2">
                {toArabicNumerals(completionPercent)}٪
              </p>
              <Progress
                value={completionPercent}
                className="h-2 bg-[#d4a574]/20 [&>[data-slot=progress-indicator]]:bg-[#d4a574]"
              />
            </CardContent>
          </Card>

          {/* Missed Days */}
          <Card className="border-destructive/30 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="size-4 text-destructive" />
                أيام القضاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">
                {toArabicNumerals(missedDays)}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Streak Counter ──────────────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-[#d4a574]/20 bg-card/80 backdrop-blur-sm overflow-hidden relative">
            <CardContent className="py-6 flex flex-col items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={
                    showCelebration
                      ? {
                          scale: [1, 1.4, 1],
                          rotate: [0, -10, 10, -10, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                  className="text-5xl"
                >
                  <Flame
                    className={`size-12 ${
                      streak > 0
                        ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <AnimatePresence>
                  {showCelebration && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: 0,
                            scale: 1,
                            x: Math.cos((i * Math.PI * 2) / 8) * 60,
                            y: Math.sin((i * Math.PI * 2) / 8) * 60,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" as const }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                          <Star className="size-4 text-[#d4a574]" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-xl font-semibold text-foreground">
                سلسلة الصيام:{" "}
                <span className="text-[#d4a574]">
                  {toArabicNumerals(streak)}
                </span>{" "}
                أيام متتالية
              </p>
              {streak >= 7 && (
                <Badge className="bg-[#d4a574]/20 text-[#d4a574] border-[#d4a574]/40">
                  ما شاء الله! استمر على هذا النهج
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Fasting Calendar Grid ───────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center gold-gradient-text font-(family-name:--font-amiri)">
                تقويم الصيام - رمضان ١٤٤٧
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
                {Array.from({ length: RAMADAN_2026.TOTAL_DAYS }, (_, i) => {
                  const isFasted = fastingDays[i];
                  const isToday = i === todayIndex;
                  const isPast =
                    todayIndex >= 0 ? i < todayIndex : false;

                  return (
                    <motion.button
                      key={i}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.3,
                        ...(prefersReducedMotion ? {} : { delay: i * 0.03 }),
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleFasting(i)}
                      aria-pressed={isFasted}
                      aria-label={`اليوم ${i + 1}`}
                      className={`
                        relative flex flex-col items-center justify-center gap-1
                        rounded-xl p-3 transition-colors duration-200
                        cursor-pointer select-none min-h-[90px]
                        ${
                          isFasted
                            ? "bg-[#2d6a4f]/20 border-2 border-[#2d6a4f]/50 text-[#2d6a4f]"
                            : "bg-muted/30 border-2 border-transparent text-muted-foreground hover:border-muted-foreground/20"
                        }
                        ${isToday ? "!border-[#d4a574] ring-2 ring-[#d4a574]/30 shadow-[0_0_12px_rgba(212,165,116,0.25)]" : ""}
                        ${isPast && !isFasted ? "opacity-60" : ""}
                      `}
                    >
                      {/* Day number */}
                      <span className="text-lg font-bold leading-none">
                        {toArabicNumerals(i + 1)}
                      </span>

                      {/* Date label */}
                      <span className="text-[10px] leading-tight opacity-70">
                        {formatArabicDateShort(getRamadanDate(i))}
                      </span>

                      {/* Check / Circle icon */}
                      <div className="mt-1">
                        {isFasted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 15,
                            }}
                          >
                            <CheckCircle2 className="size-5 text-[#2d6a4f]" />
                          </motion.div>
                        ) : (
                          <Circle className="size-5 opacity-40" />
                        )}
                      </div>

                      {/* Today badge */}
                      {isToday && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#d4a574] text-[#0a0a0f] text-[9px] px-1.5 py-0">
                          اليوم
                        </Badge>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Daily Spiritual Goals Checklist ─────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-[#2d6a4f]/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl gold-gradient-text font-(family-name:--font-amiri)">
                  الأهداف الروحية اليومية
                </CardTitle>
                <Badge
                  variant="outline"
                  className="border-[#2d6a4f]/40 text-[#2d6a4f]"
                >
                  اليوم {toArabicNumerals(activeDayIndex + 1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                أنجزت{" "}
                <span className="text-[#2d6a4f] font-semibold">
                  {toArabicNumerals(goalsCompleted)}
                </span>{" "}
                من {toArabicNumerals(SPIRITUAL_GOALS.length)} هدفاً
              </p>
              <Progress
                value={(goalsCompleted / SPIRITUAL_GOALS.length) * 100}
                className="h-2 mt-1 bg-[#2d6a4f]/20 [&>[data-slot=progress-indicator]]:bg-[#2d6a4f]"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {SPIRITUAL_GOALS.map((goal, gi) => {
                  const checked = currentDayGoals[gi];
                  return (
                    <motion.div
                      key={gi}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: gi * 0.04 }}
                    >
                      <Button
                        variant="ghost"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggleGoal(activeDayIndex, gi, SPIRITUAL_GOALS.length)}
                        className={`
                          w-full justify-start gap-3 h-auto py-3 px-4 rounded-lg
                          transition-colors duration-200 text-base
                          ${
                            checked
                              ? "bg-[#2d6a4f]/10 text-[#2d6a4f] hover:bg-[#2d6a4f]/15"
                              : "text-foreground hover:bg-muted/50"
                          }
                        `}
                      >
                        <div
                          className={`
                            flex-shrink-0 size-5 rounded-md border-2 flex items-center justify-center
                            transition-colors duration-200
                            ${
                              checked
                                ? "bg-[#2d6a4f] border-[#2d6a4f]"
                                : "border-muted-foreground/40"
                            }
                          `}
                        >
                          {checked && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 15,
                              }}
                              viewBox="0 0 12 12"
                              className="size-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2.5 6.5L5 9L9.5 3.5" />
                            </motion.svg>
                          )}
                        </div>
                        <span
                          className={
                            checked ? "line-through opacity-70" : ""
                          }
                        >
                          {goal}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Monthly Overview ─────────────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-[#d4a574]/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center gold-gradient-text font-(family-name:--font-amiri)">
                ملخص شهر رمضان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {/* Progress Rings */}
                <div className="relative">
                  <ProgressRing
                    progress={(daysFasted / RAMADAN_2026.TOTAL_DAYS) * 100}
                    size={192}
                    strokeWidth={12}
                    color="#2d6a4f"
                    bgColor="rgba(255,255,255,0.1)"
                    delay={0.6}
                  >
                    <span className="text-3xl font-bold text-[#2d6a4f]">
                      {toArabicNumerals(daysFasted)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      من {toArabicNumerals(RAMADAN_2026.TOTAL_DAYS)} يوم
                    </span>
                  </ProgressRing>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md text-center">
                  <div className="rounded-lg bg-[#2d6a4f]/10 p-4">
                    <p className="text-2xl font-bold text-[#2d6a4f]">
                      {toArabicNumerals(completionPercent)}٪
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      نسبة الصيام المنجز
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#d4a574]/10 p-4">
                    <p className="text-2xl font-bold text-[#d4a574]">
                      {toArabicNumerals(overallProgress)}٪
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      تقدم شهر رمضان
                    </p>
                  </div>
                </div>

                {/* Overall progress bar */}
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>بداية رمضان</span>
                    <span>نهاية رمضان</span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 right-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(to left, #2d6a4f, #d4a574)",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1, delay: 0.7, ease: "easeOut" as const }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ─── Data Export / Import ──────────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-center gold-gradient-text font-(family-name:--font-amiri)">
                إدارة البيانات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 border-[#2d6a4f]/40 text-[#2d6a4f] hover:bg-[#2d6a4f]/10"
                    aria-label="تصدير البيانات كملف JSON"
                    onClick={() => {
                      const data = localStorage.getItem("islamleb-ramadan-2026");
                      if (!data) return;
                      const blob = new Blob([data], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "islamleb-ramadan-2026.json";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="size-4" />
                    تصدير البيانات
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2 border-[#d4a574]/40 text-[#d4a574] hover:bg-[#d4a574]/10"
                    aria-label="استيراد البيانات من ملف JSON"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4" />
                    استيراد البيانات
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const text = event.target?.result as string;
                          JSON.parse(text); // validate JSON
                          localStorage.setItem("islamleb-ramadan-2026", text);
                          window.location.reload();
                        } catch {
                          alert("الملف غير صالح. يرجى اختيار ملف JSON صحيح.");
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = "";
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  تنبيه: الاستيراد سيحل محل جميع البيانات الحالية
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
