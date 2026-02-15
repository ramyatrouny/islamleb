"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, BookOpen, Moon, Sparkles, Gift, Loader2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRamadanDay, getRamadanDate } from "@/lib/date-utils";
import { RAMADAN_2026 } from "@/lib/constants";
import { toArabicNumerals, formatArabicDate, formatArabicDateFull } from "@/lib/formatters";
import { fastStaggerContainer, scaleUpItem, sectionReveal } from "@/lib/animations";
import { DAILY_DEEDS } from "@/config/daily-deeds";
import { PageHeader } from "@/components/page-header";
import { useHijriCalendar } from "@/hooks/use-hijri-calendar";

// --- Ashra Data (page-specific) ---
const ashraData = [
  {
    id: 1,
    title: "العشر الأولى",
    subtitle: "الرحمة",
    days: "1 - 10",
    dua: "اللّهمّ ارحمني يا أرحم الراحمين",
    icon: Moon,
    color: "from-sky-500/20 to-sky-900/20",
    borderColor: "border-sky-500/40",
    textColor: "text-sky-400",
    badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  {
    id: 2,
    title: "العشر الثانية",
    subtitle: "المغفرة",
    days: "11 - 20",
    dua: "اللّهمّ اغفر لي ذنوبي يا ربّ العالمين",
    icon: Sparkles,
    color: "from-[#2d6a4f]/30 to-emerald-900/20",
    borderColor: "border-[#2d6a4f]/50",
    textColor: "text-emerald-400",
    badgeClass: "bg-[#2d6a4f]/20 text-emerald-300 border-[#2d6a4f]/40",
  },
  {
    id: 3,
    title: "العشر الأخيرة",
    subtitle: "العتق من النار",
    days: "21 - 30",
    dua: "اللّهمّ أجرني من النار وأدخلني الجنة يا عزيز يا غفّار",
    icon: Star,
    color: "from-[#d4a574]/20 to-amber-900/20",
    borderColor: "border-[#d4a574]/50",
    textColor: "text-[#d4a574]",
    badgeClass: "bg-[#d4a574]/20 text-[#d4a574] border-[#d4a574]/40",
  },
];

// --- Page-specific helpers ---
const getAshraForDay = (day: number) => {
  if (day <= 10) return 1;
  if (day <= 20) return 2;
  return 3;
};

const isLastTenNights = (day: number) => day >= 21;
const isLaylatAlQadrCandidate = (day: number) => [21, 23, 25, 27, 29].includes(day);
const isLaylatAlQadrMostLikely = (day: number) => day === 27;

export default function CalendarPage() {
  const [todayDay] = useState<number>(() => getRamadanDay());
  const [activeAshra, setActiveAshra] = useState<number>(() => {
    const current = getRamadanDay();
    if (current >= 21) return 3;
    if (current >= 11) return 2;
    return 1;
  });

  // Aladhan Hijri Calendar API — Ramadan (month 9) 1447 AH
  const { data: hijriCalendar, loading: hijriLoading } = useHijriCalendar(9, 1447);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <PageHeader
          title="التقويم الرمضاني"
          subtitle="30 يوماً من العبادة والتقرب إلى الله"
          icon={Calendar}
        />

        {/* Ashra Indicator */}
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 sm:mb-14"
        >
          {ashraData.map((ashra) => {
            const isActive = activeAshra === ashra.id;
            const IconComp = ashra.icon;
            return (
              <motion.div
                key={ashra.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveAshra(ashra.id)}
                className="cursor-pointer"
              >
                <Card
                  className={`relative overflow-hidden border-2 transition-all duration-300 bg-gradient-to-br ${ashra.color} ${
                    isActive
                      ? `${ashra.borderColor} shadow-lg`
                      : "border-white/10"
                  }`}
                >
                  <CardContent className="p-5 text-center">
                    {isActive && (
                      <div className="absolute top-2 left-2">
                        <span className="relative flex h-3 w-3">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              ashra.id === 1
                                ? "bg-sky-400"
                                : ashra.id === 2
                                ? "bg-emerald-400"
                                : "bg-[#d4a574]"
                            }`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-3 w-3 ${
                              ashra.id === 1
                                ? "bg-sky-500"
                                : ashra.id === 2
                                ? "bg-emerald-500"
                                : "bg-[#d4a574]"
                            }`}
                          />
                        </span>
                      </div>
                    )}
                    <IconComp
                      className={`w-8 h-8 mx-auto mb-3 ${ashra.textColor}`}
                    />
                    <h3 className={`text-xl font-bold mb-1 ${ashra.textColor}`}>
                      {ashra.title}
                    </h3>
                    <Badge
                      className={`mb-3 ${ashra.badgeClass} border`}
                    >
                      {ashra.subtitle}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-2">
                      الأيام: {ashra.days}
                    </p>
                    <p className="text-sm text-muted-foreground/80 italic leading-relaxed">
                      &ldquo;{ashra.dua}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 30-Day Calendar Grid */}
        <motion.div
          variants={fastStaggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-12"
        >
          {Array.from({ length: 30 }, (_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === todayDay;
            const isLast10 = isLastTenNights(dayNum);
            const isQadr = isLaylatAlQadrCandidate(dayNum);
            const isMostLikelyQadr = isLaylatAlQadrMostLikely(dayNum);
            const ashraNum = getAshraForDay(dayNum);

            // Aladhan Hijri Calendar API data for this day (if available)
            const calDay = hijriCalendar?.[i];
            const hijriLabel = calDay
              ? `${toArabicNumerals(calDay.date.hijri.day)} ${calDay.date.hijri.month.ar} ${toArabicNumerals(calDay.date.hijri.year)} هـ`
              : null;
            const fajrTime = calDay?.timings.Fajr?.replace(/\s*\(.*\)/, "");
            const maghribTime = calDay?.timings.Maghrib?.replace(/\s*\(.*\)/, "");

            return (
              <motion.div key={dayNum} variants={scaleUpItem}>
                <Card
                  className={`relative overflow-hidden h-full transition-all duration-300 border-2 ${
                    isMostLikelyQadr
                      ? "border-[#d4a574] bg-gradient-to-br from-[#d4a574]/15 via-amber-900/10 to-background shadow-[0_0_20px_rgba(212,165,116,0.3)]"
                      : isQadr
                      ? "border-[#d4a574]/70 bg-gradient-to-br from-[#d4a574]/10 via-amber-900/5 to-background shadow-[0_0_12px_rgba(212,165,116,0.15)]"
                      : isLast10
                      ? "border-[#d4a574]/50 bg-gradient-to-br from-[#d4a574]/10 to-background"
                      : "border-border bg-card/80"
                  } ${
                    isToday ? "ring-2 ring-[#2d6a4f] animate-pulse" : ""
                  } hover:border-[#d4a574]/60 hover:shadow-md`}
                >
                  <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-2">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 justify-center min-h-[24px]">
                      {isToday && (
                        <Badge className="bg-[#2d6a4f]/30 text-emerald-300 border border-[#2d6a4f]/50 text-[10px]">
                          اليوم
                        </Badge>
                      )}
                      {isLast10 && (
                        <Badge className="bg-[#d4a574]/20 text-[#d4a574] border border-[#d4a574]/40 text-[10px]">
                          العشر الأواخر
                        </Badge>
                      )}
                      {isQadr && (
                        <Badge className={`${isMostLikelyQadr ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-amber-500/10 text-amber-300/80 border-amber-500/30"} border text-[10px]`}>
                          <Star className={`w-3 h-3 ml-1 ${isMostLikelyQadr ? "fill-amber-300" : "fill-amber-300/60"}`} />
                          {isMostLikelyQadr ? "ليلة القدر (المرجّحة)" : "ليلة القدر المحتملة"}
                        </Badge>
                      )}
                    </div>

                    {/* Day Number */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
                        isMostLikelyQadr
                          ? "bg-[#d4a574]/30 text-[#d4a574]"
                          : isQadr
                          ? "bg-[#d4a574]/20 text-[#d4a574]/90"
                          : isLast10
                          ? "bg-[#d4a574]/15 text-[#d4a574]"
                          : ashraNum === 1
                          ? "bg-sky-500/15 text-sky-400"
                          : "bg-[#2d6a4f]/20 text-emerald-400"
                      }`}
                    >
                      {toArabicNumerals(dayNum)}
                    </div>

                    <p className="text-sm font-semibold text-foreground">
                      اليوم {toArabicNumerals(dayNum)}
                    </p>

                    {/* Hijri Date (from API) or Gregorian fallback */}
                    {hijriLabel ? (
                      <p className="text-[11px] text-[#d4a574]/80 font-medium">
                        {hijriLabel}
                      </p>
                    ) : null}
                    <p className="text-[11px] text-muted-foreground">
                      {formatArabicDate(getRamadanDate(i))}
                    </p>

                    {/* Prayer times from API (Fajr / Maghrib) */}
                    {fajrTime && maghribTime ? (
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {toArabicNumerals(fajrTime)}
                        </span>
                        <span className="text-[#d4a574]/40">|</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {toArabicNumerals(maghribTime)}
                        </span>
                      </div>
                    ) : hijriLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin text-muted-foreground/40" />
                    ) : null}

                    {/* Juz */}
                    <div className="flex items-center gap-1 text-xs text-[#d4a574]">
                      <BookOpen className="w-3 h-3" />
                      <span>الجزء {toArabicNumerals(dayNum)}</span>
                    </div>

                    {/* Daily Deed */}
                    <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed mt-1">
                      {DAILY_DEEDS[i]}
                    </p>

                    {/* Qadr Star decoration */}
                    {isQadr && (
                      <div className="absolute top-1 left-1">
                        <Star className={`w-5 h-5 ${isMostLikelyQadr ? "text-[#d4a574] fill-[#d4a574] animate-pulse" : "text-[#d4a574]/60 fill-[#d4a574]/60"}`} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Eid al-Fitr Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <Card className="relative overflow-hidden border-2 border-[#d4a574]/60 bg-gradient-to-br from-[#d4a574]/15 via-[#2d6a4f]/10 to-background shadow-[0_0_30px_rgba(212,165,116,0.15)]">
            <CardContent className="p-6 sm:p-10 text-center">
              {/* Decorative Stars */}
              <div className="absolute top-4 right-6 opacity-30">
                <Star className="w-6 h-6 text-[#d4a574] fill-[#d4a574]" />
              </div>
              <div className="absolute top-8 left-10 opacity-20">
                <Star className="w-4 h-4 text-[#d4a574] fill-[#d4a574]" />
              </div>
              <div className="absolute bottom-4 right-12 opacity-20">
                <Sparkles className="w-5 h-5 text-[#d4a574]" />
              </div>

              <Gift className="w-12 h-12 text-[#d4a574] mx-auto mb-4" />

              <h2 className="text-2xl sm:text-3xl font-bold text-[#d4a574] mb-2">
                عيد الفطر المبارك
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {formatArabicDateFull(RAMADAN_2026.EID)}
              </p>

              <div className="bg-background/60 rounded-xl p-5 sm:p-6 border border-[#d4a574]/20 max-w-2xl mx-auto">
                <h3 className="text-sm font-semibold text-[#2d6a4f] mb-3 text-emerald-400">
                  تكبيرات العيد
                </h3>
                <p className="text-base sm:text-lg text-[#d4a574] leading-loose font-semibold">
                  الله أكبر الله أكبر الله أكبر، لا إله إلا الله، الله أكبر الله
                  أكبر ولله الحمد
                </p>
              </div>

              <p className="text-sm text-muted-foreground mt-5">
                تقبّل الله منّا ومنكم صالح الأعمال
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
