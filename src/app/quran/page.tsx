"use client";

import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Target,
  Lightbulb,
  ExternalLink,
  RotateCcw,
  Loader2,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { toArabicNumerals } from "@/lib/formatters";
import { staggerContainer, fadeUpItem, scaleUpItem } from "@/lib/animations";
import { useRamadanStore } from "@/lib/store";
import { useRamadanDate } from "@/hooks/use-ramadan-date";
import { PageHeader } from "@/components/page-header";
import { useQuranJuz } from "@/hooks/use-quran-juz";
import { useQuranSurahs } from "@/hooks/use-quran-surah";

/* ------------------------------------------------------------------ */
/*  Page-specific reference data                                       */
/* ------------------------------------------------------------------ */

const TOTAL_JUZ = 30;

const juzOrdinals: string[] = [
  "الأوّل",
  "الثاني",
  "الثالث",
  "الرابع",
  "الخامس",
  "السادس",
  "السابع",
  "الثامن",
  "التاسع",
  "العاشر",
  "الحادي عشر",
  "الثاني عشر",
  "الثالث عشر",
  "الرابع عشر",
  "الخامس عشر",
  "السادس عشر",
  "السابع عشر",
  "الثامن عشر",
  "التاسع عشر",
  "العشرون",
  "الحادي والعشرون",
  "الثاني والعشرون",
  "الثالث والعشرون",
  "الرابع والعشرون",
  "الخامس والعشرون",
  "السادس والعشرون",
  "السابع والعشرون",
  "الثامن والعشرون",
  "التاسع والعشرون",
  "الثلاثون",
];

const juzStartNames: string[] = [
  "الفاتحة",
  "سيقول",
  "تلك الرسل",
  "لن تنالوا",
  "والمحصنات",
  "لا يحب الله",
  "وإذا سمعوا",
  "ولو أننا",
  "قال الملأ",
  "واعلموا",
  "يعتذرون",
  "وما من دابة",
  "وما أبرئ",
  "ربما",
  "سبحان الذي",
  "قال ألم",
  "اقترب للناس",
  "قد أفلح",
  "وقال الذين",
  "أمّن خلق",
  "اتل ما أوحي",
  "ومن يقنت",
  "وما لي",
  "فمن أظلم",
  "إليه يرد",
  "حم",
  "قال فما خطبكم",
  "قد سمع الله",
  "تبارك الذي",
  "عمّ",
];

interface QuickSurah {
  name: string;
  ayahs: number;
  quranComId: number;
}

const quickSurahs: QuickSurah[] = [
  { name: "الفاتحة", ayahs: 7, quranComId: 1 },
  { name: "البقرة", ayahs: 286, quranComId: 2 },
  { name: "آل عمران", ayahs: 200, quranComId: 3 },
  { name: "يس", ayahs: 83, quranComId: 36 },
  { name: "الكهف", ayahs: 110, quranComId: 18 },
  { name: "الرحمن", ayahs: 78, quranComId: 55 },
  { name: "الواقعة", ayahs: 96, quranComId: 56 },
  { name: "الملك", ayahs: 30, quranComId: 67 },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function QuranPage() {
  // ── Store state ─────────────────────────────────────────────────────────
  const completedJuz = useRamadanStore((s) => s.completedJuz);
  const toggleJuz = useRamadanStore((s) => s.toggleJuz);
  const resetKhatma = useRamadanStore((s) => s.resetKhatma);

  // ── Hydration guard ─────────────────────────────────────────────────────
  const mounted = useHydrated();

  // ── Ramadan date info ───────────────────────────────────────────────────
  const { currentDay: ramadanDay, daysRemaining, isInRamadan } = useRamadanDate();

  // ── Al-Quran Cloud API: on-demand juz detail ───────────────────────────
  const { juzData, loadingJuz, loadJuz } = useQuranJuz();
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

  // ── Quran.com API: full surah list ─────────────────────────────────────
  const { data: allSurahs, loading: surahsLoading } = useQuranSurahs();
  const [surahSearch, setSurahSearch] = useState("");

  // Derived values
  const completedCount = completedJuz.length;
  const percentage = Math.round((completedCount / TOTAL_JUZ) * 100);
  const remainingJuz = TOTAL_JUZ - completedCount;
  const juzPerDay =
    daysRemaining > 0 ? Math.ceil(remainingJuz / daysRemaining) : remainingJuz;

  const effectiveRamadanDay = ramadanDay === -1 ? 1 : ramadanDay;

  const estimatedDaysToFinish =
    completedCount > 0 && isInRamadan
      ? Math.ceil(remainingJuz / (completedCount / effectiveRamadanDay))
      : remainingJuz;

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedDaysToFinish);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <BookOpen className="h-10 w-10 animate-pulse text-[#d4a574]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* -------------------------------------------------------- */}
        {/*  Page Title                                               */}
        {/* -------------------------------------------------------- */}
        <motion.div variants={fadeUpItem}>
          <PageHeader
            title="القرآن الكريم"
            subtitle="ختمة رمضان 2026"
            icon={BookOpen}
          />
        </motion.div>

        {/* -------------------------------------------------------- */}
        {/*  Khatma Progress Tracker                                  */}
        {/* -------------------------------------------------------- */}
        <motion.div variants={fadeUpItem}>
          <Card className="mb-8 border-[#d4a574]/20 bg-card islamic-pattern overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#d4a574]" />
                  تقدّم الختمة
                </span>
                <button
                  onClick={resetKhatma}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="إعادة تعيين"
                  aria-label="إعادة تعيين الختمة"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  إعادة تعيين
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Large percentage display */}
              <div className="flex flex-col items-center gap-2 py-2">
                <span className="text-5xl font-bold text-[#d4a574]">
                  {toArabicNumerals(percentage)}٪
                </span>
                <p className="text-base text-muted-foreground">
                  أكملت{" "}
                  <span className="font-semibold text-foreground">
                    {toArabicNumerals(completedCount)}
                  </span>{" "}
                  من{" "}
                  <span className="font-semibold text-foreground">
                    30
                  </span>{" "}
                  جزءاً
                </p>
              </div>

              {/* Progress bar */}
              <div className="relative" dir="ltr">
                <Progress
                  value={percentage}
                  className="h-4 bg-muted [&>[data-slot=progress-indicator]]:bg-[#d4a574]"
                />
              </div>

              {/* Completed / Remaining badges */}
              <div className="flex flex-wrap justify-center gap-3">
                <Badge
                  variant="outline"
                  className="border-[#d4a574]/30 px-3 py-1 text-sm"
                >
                  <CheckCircle2 className="ml-1 h-3.5 w-3.5 text-emerald-500" />
                  مكتمل: {toArabicNumerals(completedCount)}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#d4a574]/30 px-3 py-1 text-sm"
                >
                  <BookOpen className="ml-1 h-3.5 w-3.5 text-[#d4a574]" />
                  متبقّي: {toArabicNumerals(remainingJuz)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* -------------------------------------------------------- */}
        {/*  30 Juz Grid                                              */}
        {/* -------------------------------------------------------- */}
        <motion.div variants={fadeUpItem} className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            أجزاء القرآن الكريم
          </h2>
          <motion.div
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map(
              (juzNum) => {
                const isCompleted = completedJuz.includes(juzNum);
                const isExpanded = expandedJuz === juzNum;
                const surahRanges = juzData[juzNum];

                return (
                  <motion.div
                    key={juzNum}
                    variants={scaleUpItem}
                    className="flex flex-col"
                  >
                    <button
                      onClick={() => toggleJuz(juzNum)}
                      aria-pressed={isCompleted}
                      className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors sm:p-4 ${
                        isCompleted
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-[#d4a574]/15 bg-card hover:border-[#d4a574]/40 hover:bg-[#d4a574]/5"
                      }`}
                    >
                      {/* Completed overlay */}
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -left-1.5 -top-1.5 rounded-full bg-emerald-500 p-0.5"
                        >
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </motion.div>
                      )}

                      {/* Juz number */}
                      <span className="text-lg font-bold text-[#d4a574]">
                        {toArabicNumerals(juzNum)}
                      </span>

                      {/* Ordinal name */}
                      <span className="text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
                        الجزء {juzOrdinals[juzNum - 1]}
                      </span>

                      {/* Starting surah/section */}
                      <span className="line-clamp-1 text-[10px] text-muted-foreground sm:text-[11px]">
                        {juzStartNames[juzNum - 1]}
                      </span>
                    </button>

                    {/* Expand button — Al-Quran Cloud API */}
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedJuz(null);
                        } else {
                          setExpandedJuz(juzNum);
                          loadJuz(juzNum);
                        }
                      }}
                      className="mt-1 flex items-center justify-center gap-1 rounded-b-lg px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:text-[#d4a574]"
                    >
                      <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      <span>{isExpanded ? "إخفاء" : "السور"}</span>
                    </button>

                    {/* Expanded surah ranges from Al-Quran Cloud */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 rounded-lg border border-[#d4a574]/15 bg-card/50 p-2 text-[10px]">
                            {loadingJuz === juzNum ? (
                              <div className="flex justify-center py-2">
                                <Loader2 className="h-4 w-4 animate-spin text-[#d4a574]" />
                              </div>
                            ) : surahRanges ? (
                              <div className="space-y-1">
                                {surahRanges.map((range) => (
                                  <div
                                    key={range.surahNumber}
                                    className="flex items-center justify-between text-muted-foreground"
                                  >
                                    <span className="font-medium text-foreground">
                                      {range.surahName}
                                    </span>
                                    <span className="text-[9px]">
                                      {toArabicNumerals(range.fromAyah)}-{toArabicNumerals(range.toAyah)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }
            )}
          </motion.div>
        </motion.div>

        {/* -------------------------------------------------------- */}
        {/*  Bottom row: Daily Reading + Statistics + Quick Surahs    */}
        {/* -------------------------------------------------------- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* ------------------------------------------------------ */}
          {/*  Daily Reading Plan                                     */}
          {/* ------------------------------------------------------ */}
          <motion.div variants={fadeUpItem}>
            <Card className="h-full border-[#d4a574]/20 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-[#d4a574]" />
                  قراءة اليوم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-[#d4a574]/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    اليوم الموصى به
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#d4a574]">
                    الجزء {toArabicNumerals(effectiveRamadanDay)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {juzStartNames[effectiveRamadanDay - 1]}
                  </p>
                </div>

                <div className="rounded-lg border border-[#d4a574]/15 p-3 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    4 صفحات بعد كل صلاة = جزء كامل
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 shrink-0 text-[#d4a574]" />
                    <span className="text-muted-foreground">
                      اقرأ بعد كل صلاة لتسهيل الختمة
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 shrink-0 text-[#d4a574]" />
                    <span className="text-muted-foreground">
                      خصّص وقتاً ثابتاً للقراءة يومياً
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 shrink-0 text-[#d4a574]" />
                    <span className="text-muted-foreground">
                      استمع للقرآن أثناء التنقّل
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 shrink-0 text-[#d4a574]" />
                    <span className="text-muted-foreground">
                      راجع ما قرأته قبل النوم
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ------------------------------------------------------ */}
          {/*  Khatma Statistics                                      */}
          {/* ------------------------------------------------------ */}
          <motion.div variants={fadeUpItem}>
            <Card className="h-full border-[#d4a574]/20 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-[#d4a574]" />
                  إحصائيات الختمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Days remaining */}
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      الأيّام المتبقّية في رمضان
                    </span>
                    <span className="text-lg font-bold text-[#d4a574]">
                      {toArabicNumerals(daysRemaining)}
                    </span>
                  </div>

                  {/* Juz per day needed */}
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      أجزاء يومياً لإنهاء الختمة
                    </span>
                    <span className="text-lg font-bold text-[#d4a574]">
                      {toArabicNumerals(juzPerDay)}
                    </span>
                  </div>

                  {/* Completed juz */}
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      الأجزاء المكتملة
                    </span>
                    <span className="text-lg font-bold text-emerald-500">
                      {toArabicNumerals(completedCount)} / 30
                    </span>
                  </div>

                  {/* Estimated completion */}
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      تاريخ الإنهاء المتوقّع
                    </span>
                    <span className="text-sm font-bold text-[#d4a574]">
                      {completedCount > 0
                        ? estimatedDate.toLocaleDateString("ar-LB", {
                            day: "numeric",
                            month: "long",
                          })
                        : "ابدأ القراءة"}
                    </span>
                  </div>

                  {/* Motivational message */}
                  {completedCount === TOTAL_JUZ && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-lg bg-emerald-500/10 p-4 text-center"
                    >
                      <p className="text-lg font-bold text-emerald-500">
                        ما شاء الله! أتممت ختمة القرآن الكريم
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        تقبّل الله منك وجعله في ميزان حسناتك
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ------------------------------------------------------ */}
          {/*  Surah List (Quran.com API)                             */}
          {/* ------------------------------------------------------ */}
          <motion.div variants={fadeUpItem}>
            <Card className="h-full border-[#d4a574]/20 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-[#d4a574]" />
                  سور القرآن الكريم
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search input */}
                <div className="relative mb-3">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={surahSearch}
                    onChange={(e) => setSurahSearch(e.target.value)}
                    placeholder="ابحث عن سورة..."
                    className="w-full rounded-lg border border-[#d4a574]/20 bg-background py-2 pr-9 pl-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#d4a574]/50 focus:outline-none"
                  />
                </div>

                {/* Show surah count + loading indicator */}
                {surahsLoading && (
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin text-[#d4a574]" />
                    <span>جارٍ تحميل السور...</span>
                  </div>
                )}
                {allSurahs && !surahsLoading && (
                  <p className="mb-2 text-[11px] text-muted-foreground">
                    {toArabicNumerals(allSurahs.length)} سورة — من Quran.com
                  </p>
                )}

                <div className="max-h-[340px] space-y-2 overflow-y-auto pl-1">
                  {(() => {
                    const surahs = allSurahs
                      ? allSurahs.map((s) => ({
                          id: s.id,
                          name_arabic: s.name_arabic,
                          name_simple: s.name_simple,
                          verses_count: s.verses_count,
                          revelation_place: s.revelation_place,
                        }))
                      : quickSurahs.map((qs) => ({
                          id: qs.quranComId,
                          name_arabic: qs.name,
                          name_simple: qs.name,
                          verses_count: qs.ayahs,
                          revelation_place: "",
                        }));

                    const filtered = surahSearch
                      ? surahs.filter(
                          (s) =>
                            s.name_arabic.includes(surahSearch) ||
                            s.name_simple.toLowerCase().includes(surahSearch.toLowerCase()),
                        )
                      : surahs;

                    if (filtered.length === 0) {
                      return (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          لا توجد نتائج
                        </p>
                      );
                    }

                    return filtered.map((surah) => (
                      <a
                        key={surah.id}
                        href={`https://quran.com/${surah.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg border border-[#d4a574]/10 p-3 transition-all duration-200 hover:border-[#d4a574]/30 hover:bg-[#d4a574]/5 hover:-translate-x-1"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4a574]/15 text-sm font-bold text-[#d4a574]">
                            {toArabicNumerals(surah.id)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              سورة {surah.name_arabic}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {toArabicNumerals(surah.verses_count)} آية
                              {surah.revelation_place && (
                                <span className="mr-1.5 text-[#d4a574]/60">
                                  {surah.revelation_place === "makkah" ? "مكّيّة" : "مدنيّة"}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
