"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  BookOpen,
  Hash,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

import type { Dhikr } from "@/lib/types";
import { toArabicNumerals } from "@/lib/formatters";
import { adhkarData } from "@/lib/adhkar-data";
import { staggerContainer, fadeUpItem } from "@/lib/animations";
import { useRamadanStore } from "@/lib/store";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

interface TasbihPreset {
  label: string;
  target: number;
}

const morningAdhkar = adhkarData.morningAdhkar.items;
const eveningAdhkar = adhkarData.eveningAdhkar.items;
const ramadanDuas = adhkarData.ramadanDuas.items;

const allAdhkar = [...morningAdhkar, ...eveningAdhkar, ...ramadanDuas];

const tasbihPresets: TasbihPreset[] = [
  { label: "سُبْحَانَ اللَّهِ", target: 33 },
  { label: "الْحَمْدُ لِلَّهِ", target: 33 },
  { label: "اللَّهُ أَكْبَرُ", target: 34 },
];

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function countLabel(n: number): string {
  if (n === 1) return "مرة واحدة";
  if (n === 2) return "مرتان";
  if (n >= 3 && n <= 10) return `${toArabicNumerals(n)} مرات`;
  return `${toArabicNumerals(n)} مرة`;
}

/* ------------------------------------------------------------------ */
/*  DhikrCard — entire card is the tap target                          */
/* ------------------------------------------------------------------ */

function DhikrCard({
  dhikr,
  current,
  onIncrement,
}: {
  dhikr: Dhikr;
  current: number;
  onIncrement: () => void;
}) {
  const done = current >= dhikr.count;
  const progress = dhikr.count > 1 ? (current / dhikr.count) * 100 : 0;

  return (
    <motion.div variants={fadeUpItem}>
      <button
        type="button"
        onClick={done ? undefined : onIncrement}
        disabled={done}
        className={`group relative w-full text-right overflow-hidden rounded-xl border transition-all duration-200 select-none ${
          done
            ? "border-emerald-500/25 bg-emerald-500/5 cursor-default"
            : "border-border/40 bg-card active:scale-[0.985] cursor-pointer hover:border-[#d4a574]/25"
        }`}
      >
        {/* Background progress fill for multi-count dhikrs */}
        {dhikr.count > 1 && !done && (
          <div
            className="absolute inset-y-0 right-0 bg-[#d4a574]/4 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        )}

        <div className="relative px-4 py-4 sm:px-5">
          {/* Dhikr text — the most important thing */}
          <p
            className={`font-quran text-[17px] leading-[2.1] sm:text-xl sm:leading-[2.2] ${
              done ? "text-muted-foreground/40 line-through decoration-emerald-500/20" : "text-foreground"
            }`}
          >
            {dhikr.text}
          </p>

          {/* Footer row: source + count status */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground/40 leading-tight">
              {dhikr.source}
            </span>

            {done ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15"
              >
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              </motion.span>
            ) : (
              <span className="flex items-center gap-2 shrink-0">
                {dhikr.count > 1 ? (
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {toArabicNumerals(current)} / {toArabicNumerals(dhikr.count)}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    {countLabel(dhikr.count)}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className="border-[#d4a574]/20 text-[#d4a574] text-[10px] px-2 py-0 h-5"
                >
                  اضغط
                </Badge>
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  TasbihCounter — clean, focused                                     */
/* ------------------------------------------------------------------ */

function TasbihCounter() {
  const [activePreset, setActivePreset] = useState(0);
  const [count, setCount] = useState(0);

  const { tasbihCount, incrementTasbih } = useRamadanStore();

  const preset = tasbihPresets[activePreset];
  const done = count >= preset.target;

  const handleTap = useCallback(() => {
    if (done) return;
    setCount((c) => c + 1);
    incrementTasbih();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [done, incrementTasbih]);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  const handlePresetChange = useCallback((index: number) => {
    setActivePreset(index);
    setCount(0);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Preset selector — segmented control style */}
      <div className="flex w-full overflow-hidden rounded-xl border border-border/40 bg-card">
        {tasbihPresets.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePresetChange(i)}
            aria-label={p.label}
            className={`flex-1 py-3 text-center font-quran text-sm transition-colors ${
              i === activePreset
                ? "bg-[#d4a574]/10 text-[#d4a574] font-medium"
                : "text-muted-foreground hover:bg-muted/20"
            } ${i > 0 ? "border-r border-border/30 rtl:border-r-0 rtl:border-l" : ""}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Counter circle — large, easy tap target */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        disabled={done}
        aria-label="اضغط للتسبيح"
        className={`relative flex h-48 w-48 items-center justify-center rounded-full border-2 transition-colors duration-200 focus:outline-none sm:h-56 sm:w-56 ${
          done
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-[#d4a574]/25 bg-card active:border-[#d4a574]/60 active:bg-[#d4a574]/5"
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={count}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.12 }}
              className={`font-sans text-5xl font-bold tabular-nums sm:text-6xl ${
                done ? "text-emerald-500" : "text-[#d4a574]"
              }`}
            >
              {toArabicNumerals(count)}
            </motion.span>
          </AnimatePresence>

          <span className="text-xs text-muted-foreground">
            / {toArabicNumerals(preset.target)}
          </span>

          {done && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <Check className="h-6 w-6 text-emerald-500" />
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Instruction */}
      {!done && (
        <p className="text-[11px] text-muted-foreground/50">
          اضغط على الدائرة للتسبيح
        </p>
      )}

      {/* Progress */}
      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted/20">
        <div
          className="h-full rounded-full bg-[#d4a574] transition-all duration-200"
          style={{ width: `${(count / preset.target) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button
          onClick={handleReset}
          aria-label="إعادة العداد"
          className="flex items-center gap-1.5 rounded-lg border border-border/40 px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-[#d4a574]/25 hover:text-[#d4a574] active:bg-muted/20"
        >
          <RotateCcw className="h-3 w-3" />
          إعادة
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground/50">المجموع</span>
          <span className="text-sm font-bold text-[#d4a574] tabular-nums">
            {toArabicNumerals(tasbihCount)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AdhkarPage() {
  const [counters, setCounters] = useState<Record<string, number>>({});

  const increment = useCallback((id: string, max: number) => {
    setCounters((prev) => {
      const current = prev[id] || 0;
      if (current >= max) return prev;
      return { ...prev, [id]: current + 1 };
    });
  }, []);

  const getCount = (id: string) => counters[id] || 0;

  const totalAdhkar = allAdhkar.length;
  const completedAdhkar = allAdhkar.filter(
    (d) => (counters[d.id] || 0) >= d.count
  ).length;
  const progressPercent =
    totalAdhkar > 0 ? (completedAdhkar / totalAdhkar) * 100 : 0;

  const renderDhikrList = (list: Dhikr[]) => (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2.5"
    >
      {list.map((dhikr) => (
        <DhikrCard
          key={dhikr.id}
          dhikr={dhikr}
          current={getCount(dhikr.id)}
          onIncrement={() => increment(dhikr.id, dhikr.count)}
        />
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <PageHeader
          title="الأذكار والأدعية"
          subtitle="أذكار المسلم في رمضان"
          icon={BookOpen}
        />

        {/* ---- Daily Progress ---- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#d4a574]" />
              الإنجاز اليومي
            </span>
            <span className="text-xs font-medium text-[#d4a574] tabular-nums">
              {toArabicNumerals(completedAdhkar)} / {toArabicNumerals(totalAdhkar)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
            <div
              className="h-full rounded-full bg-[#d4a574] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </motion.div>

        {/* ---- Tabs ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Tabs defaultValue="morning" className="w-full">
            {/* Sticky tab bar on mobile for easy access while scrolling */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/20 h-11 p-1 rounded-xl">
                <TabsTrigger
                  value="morning"
                  className="flex items-center justify-center gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:text-[#d4a574] data-[state=active]:shadow-sm"
                >
                  <Sun className="h-4 w-4 shrink-0" />
                  <span>الصباح</span>
                </TabsTrigger>
                <TabsTrigger
                  value="evening"
                  className="flex items-center justify-center gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:text-[#d4a574] data-[state=active]:shadow-sm"
                >
                  <Moon className="h-4 w-4 shrink-0" />
                  <span>المساء</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ramadan"
                  className="flex items-center justify-center gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:text-[#d4a574] data-[state=active]:shadow-sm"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>رمضان</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tasbih"
                  className="flex items-center justify-center gap-1.5 rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:text-[#d4a574] data-[state=active]:shadow-sm"
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span>تسبيح</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="morning">
              <p className="mb-3 text-xs font-medium text-muted-foreground/60">
                {adhkarData.morningAdhkar.name}
              </p>
              {renderDhikrList(morningAdhkar)}
            </TabsContent>

            <TabsContent value="evening">
              <p className="mb-3 text-xs font-medium text-muted-foreground/60">
                {adhkarData.eveningAdhkar.name}
              </p>
              {renderDhikrList(eveningAdhkar)}
            </TabsContent>

            <TabsContent value="ramadan">
              <p className="mb-3 text-xs font-medium text-muted-foreground/60">
                {adhkarData.ramadanDuas.name}
              </p>
              {renderDhikrList(ramadanDuas)}
            </TabsContent>

            <TabsContent value="tasbih">
              <div className="pt-4">
                <TasbihCounter />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
