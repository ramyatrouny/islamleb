"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { DecorativeBackground } from "@/components/decorative-background";
import { motion } from "framer-motion";
import {
  Calculator,
  Coins,
  CircleDollarSign,
  Users,
  Heart,
  BookOpen,
  ChevronDown,
  HandCoins,
  Scale,
  Info,
  CalendarCheck,
  UtensilsCrossed,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { toArabicNumerals, formatNumber } from "@/lib/formatters";
import { staggerContainer, fadeUpItem } from "@/lib/animations";
import { useZakatFinancialData, type CurrencyRate } from "@/hooks/use-exchange-rates";

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

interface AssetField {
  key: string;
  label: string;
  icon: React.ElementType;
  subtract?: boolean;
}

const ASSET_FIELDS: AssetField[] = [
  { key: "cash", label: "النقود والحسابات البنكية", icon: CircleDollarSign },
  { key: "gold", label: "قيمة الذهب", icon: Coins },
  { key: "silver", label: "قيمة الفضة", icon: Coins },
  { key: "stocks", label: "الأسهم والاستثمارات", icon: HandCoins },
  { key: "business", label: "البضائع التجارية", icon: Scale },
  { key: "debtsOwed", label: "الديون المستحقة لك", icon: HandCoins },
  {
    key: "debtsYouOwe",
    label: "الديون المستحقة عليك",
    icon: HandCoins,
    subtract: true,
  },
];

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025;

const ZAKAT_CONDITIONS = [
  "الإسلام",
  "الحرية",
  "ملك النصاب",
  "حولان الحول (مرور سنة هجرية كاملة)",
  "أن يكون المال نامياً أو قابلاً للنماء",
  "أن يكون المال فائضاً عن الحاجات الأساسية",
  "أن يكون المال خالياً من الدَّين المُستغرِق",
];

const ZAKAT_RECIPIENTS = [
  { name: "الفقراء", desc: "من لا يجدون كفايتهم" },
  { name: "المساكين", desc: "من يجدون بعض كفايتهم" },
  { name: "العاملون عليها", desc: "القائمون على جمع الزكاة وتوزيعها" },
  { name: "المؤلفة قلوبهم", desc: "من يُرجى إسلامهم أو تثبيت إيمانهم" },
  { name: "في الرقاب", desc: "تحرير الأرقّاء والأسرى" },
  { name: "الغارمون", desc: "المدينون العاجزون عن سداد ديونهم" },
  { name: "في سبيل الله", desc: "المجاهدون وأوجه الخير العامة" },
  { name: "ابن السبيل", desc: "المسافر المنقطع عن ماله" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ZakatPage() {
  // -- Live financial data from APIs (cached)
  const financial = useZakatFinancialData();

  // -- Zakat al-Mal state
  const [assets, setAssets] = useState<Record<string, number>>(
    Object.fromEntries(ASSET_FIELDS.map((f) => [f.key, 0]))
  );
  const [currency, setCurrency] = useState<CurrencyRate>(financial.currencies[0]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const [nisabType, setNisabType] = useState<"gold" | "silver">("gold");

  // Sync currency rate when API data arrives
  const currencies = financial.currencies;
  useEffect(() => {
    if (!financial.loading && currencies.length > 0) {
      setCurrency((prev) => {
        const updated = currencies.find((c) => c.code === prev.code);
        return updated ?? currencies[0];
      });
    }
  }, [financial.loading, currencies]);

  // Close currency dropdown on outside click
  useEffect(() => {
    if (!currencyOpen) return;
    function handleClick(e: MouseEvent) {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [currencyOpen]);

  const [malResult, setMalResult] = useState<{
    total: number;
    zakat: number;
    belowNisab: boolean;
  } | null>(null);

  // -- Zakat al-Fitr state
  const [familySize, setFamilySize] = useState(1);
  const [fitrPerPerson, setFitrPerPerson] = useState(10);
  const [fitrResult, setFitrResult] = useState<number | null>(null);

  // -- Fidya state
  const [fidyaDays, setFidyaDays] = useState(0);
  const [fidyaCostPerMeal, setFidyaCostPerMeal] = useState(5);
  const [fidyaResult, setFidyaResult] = useState<number | null>(null);

  // -- Handlers
  const handleAssetChange = useCallback(
    (key: string, value: string) => {
      const num = Math.min(parseFloat(value) || 0, 999999999999);
      setAssets((prev) => ({ ...prev, [key]: num }));
    },
    []
  );

  const nisabUsd = nisabType === "gold" ? financial.goldNisabUsd : financial.silverNisabUsd;

  const calculateMal = useCallback(() => {
    let total = 0;
    for (const field of ASSET_FIELDS) {
      if (field.subtract) {
        total -= assets[field.key] || 0;
      } else {
        total += assets[field.key] || 0;
      }
    }
    if (total < 0) total = 0;
    const nisabInCurrency = nisabUsd * currency.rate;
    const belowNisab = total < nisabInCurrency;
    const zakat = belowNisab ? 0 : total * ZAKAT_RATE;
    setMalResult({ total, zakat, belowNisab });
  }, [assets, currency, nisabUsd]);

  const calculateFitr = useCallback(() => {
    setFitrResult(familySize * fitrPerPerson);
  }, [familySize, fitrPerPerson]);

  const calculateFidya = useCallback(() => {
    setFidyaResult(fidyaDays * fidyaCostPerMeal * 2);
  }, [fidyaDays, fidyaCostPerMeal]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="bg-background text-foreground">
      <DecorativeBackground />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ---- Page header ---- */}
        <PageHeader
          title="حاسبة الزكاة"
          subtitle="احسب زكاتك بدقة"
          icon={Calculator}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* ================================================================
              SECTION 1: Zakat al-Mal Calculator
             ================================================================ */}
          <motion.div variants={fadeUpItem}>
            <Card className="ramadan-glow border-[#d4a574]/30">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a574]/15">
                  <Calculator className="h-7 w-7 text-[#d4a574]" />
                </div>
                <CardTitle className="text-2xl text-[#d4a574]">
                  زكاة المال
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  أدخل قيمة أصولك لحساب الزكاة المستحقة
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Loading / error indicator for API data */}
                {financial.loading && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[#d4a574]/20 bg-[#d4a574]/5 p-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-[#d4a574]" />
                    جارٍ تحميل أسعار الصرف وأسعار المعادن...
                  </div>
                )}
                {financial.error && !financial.loading && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    تعذّر تحميل البيانات المباشرة — يتم استخدام أسعار تقريبية
                  </div>
                )}

                {/* Nisab type toggle & display */}
                <div className="rounded-xl border border-[#d4a574]/20 bg-[#d4a574]/5 p-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                    <button
                      onClick={() => setNisabType("gold")}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        nisabType === "gold"
                          ? "bg-[#d4a574] text-[#0a0a0f]"
                          : "border border-[#d4a574]/40 text-[#d4a574] hover:bg-[#d4a574]/10"
                      }`}
                    >
                      نصاب الذهب: {toArabicNumerals(`${GOLD_NISAB_GRAMS}`)} غرام ≈ $
                      {toArabicNumerals(financial.goldNisabUsd.toLocaleString())}
                    </button>
                    <button
                      onClick={() => setNisabType("silver")}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        nisabType === "silver"
                          ? "bg-[#d4a574] text-[#0a0a0f]"
                          : "border border-[#d4a574]/40 text-[#d4a574] hover:bg-[#d4a574]/10"
                      }`}
                    >
                      نصاب الفضة: {toArabicNumerals(`${SILVER_NISAB_GRAMS}`)} غرام ≈ $
                      {toArabicNumerals(financial.silverNisabUsd.toLocaleString())}
                    </button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    <Info className="ml-1 inline-block h-3.5 w-3.5 text-[#d4a574]" />
                    يُنصح باستخدام نصاب الذهب (الأحوط)
                  </p>
                </div>

                {/* Currency selector */}
                <div ref={currencyDropdownRef} className="relative mx-auto max-w-xs">
                  <Label className="mb-2 block text-center text-sm text-muted-foreground">
                    العملة
                  </Label>
                  <button
                    onClick={() => setCurrencyOpen((o) => !o)}
                    role="combobox"
                    aria-expanded={currencyOpen}
                    aria-controls="currency-listbox"
                    aria-haspopup="listbox"
                    aria-label="اختر العملة"
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#d4a574]/30 bg-card px-5 py-3 text-base transition-colors hover:border-[#d4a574]/60 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/40"
                  >
                    <span>
                      {currency.symbol} &mdash; {currency.label}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#d4a574] transition-transform ${
                        currencyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {currencyOpen && (
                    <div id="currency-listbox" role="listbox" className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                      {financial.currencies.map((c) => (
                        <button
                          key={c.code}
                          role="option"
                          aria-selected={c.code === currency.code}
                          onClick={() => {
                            setCurrency(c);
                            setCurrencyOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 px-5 py-3 text-right transition-colors hover:bg-[#d4a574]/10 ${
                            c.code === currency.code
                              ? "bg-[#d4a574]/15 text-[#d4a574]"
                              : ""
                          }`}
                        >
                          <span className="font-semibold">{c.symbol}</span>
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  {financial.lastUpdated
                    ? `أسعار الصرف محدّثة من الإنترنت — آخر تحديث: ${financial.lastUpdated}`
                    : "أسعار الصرف تقريبية وقد لا تعكس السعر الحالي"}
                </p>

                <Separator className="bg-border/50" />

                {/* Asset inputs */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {ASSET_FIELDS.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.key} className="space-y-2">
                        <Label
                          htmlFor={field.key}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Icon className="h-4 w-4 text-[#d4a574]" />
                          {field.label}
                          {field.subtract && (
                            <Badge
                              variant="outline"
                              className="border-red-400/40 text-[10px] text-red-400"
                            >
                              تُخصم
                            </Badge>
                          )}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field.key}
                            type="number"
                            min={0}
                            dir="ltr"
                            value={assets[field.key] || ""}
                            placeholder="٠"
                            onChange={(e) =>
                              handleAssetChange(field.key, e.target.value)
                            }
                            className="text-left border-border/60 focus-visible:border-[#d4a574] focus-visible:ring-[#d4a574]/30"
                          />
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {currency.symbol}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculate button */}
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={calculateMal}
                    className="h-12 w-full max-w-sm bg-[#d4a574] text-lg font-bold text-[#0a0a0f] hover:bg-[#c9963e] transition-colors"
                    size="lg"
                  >
                    <Calculator className="ml-2 h-5 w-5" />
                    احسب الزكاة
                  </Button>
                </div>

                {/* Result */}
                {malResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4"
                  >
                    <div
                      className={`rounded-xl border p-6 text-center ${
                        malResult.belowNisab
                          ? "border-[#2d6a4f]/40 bg-[#2d6a4f]/10"
                          : "border-[#d4a574]/40 bg-[#d4a574]/10"
                      }`}
                    >
                      <p className="mb-2 text-sm text-muted-foreground">
                        إجمالي الأصول: {currency.symbol}{" "}
                        {toArabicNumerals(formatNumber(malResult.total))}
                      </p>
                      {malResult.belowNisab ? (
                        <p className="text-lg font-semibold text-[#2d6a4f]">
                          لم تبلغ أموالك النصاب، لا زكاة مستحقة عليك
                        </p>
                      ) : (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            مبلغ الزكاة المستحق
                          </p>
                          <p className="gold-gradient-text text-3xl font-bold sm:text-4xl">
                            {currency.symbol}{" "}
                            {toArabicNumerals(formatNumber(malResult.zakat))}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            ({toArabicNumerals("2.5")}٪ من إجمالي الأصول)
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* ================================================================
              SECTION 2: Zakat al-Fitr
             ================================================================ */}
          <motion.div variants={fadeUpItem}>
            <Card className="border-[#2d6a4f]/30">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#2d6a4f]/15">
                  <Heart className="h-7 w-7 text-[#2d6a4f]" />
                </div>
                <CardTitle className="text-2xl text-[#2d6a4f]">
                  زكاة الفطر
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-3 rounded-xl border border-[#2d6a4f]/20 bg-[#2d6a4f]/5 p-4 text-center">
                  <p className="text-base font-semibold">
                    زكاة الفطر واجبة على كل مسلم
                  </p>
                  <p className="text-sm text-muted-foreground">
                    صاع من قوت البلد (حوالي {toArabicNumerals("3")} كغ)
                  </p>
                  <p className="text-sm text-[#d4a574]">
                    القيمة التقريبية: ${toArabicNumerals("7")}-$
                    {toArabicNumerals("15")} للشخص الواحد
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="familySize" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#2d6a4f]" />
                      عدد أفراد الأسرة
                    </Label>
                    <Input
                      id="familySize"
                      type="number"
                      min={1}
                      value={familySize}
                      onChange={(e) =>
                        setFamilySize(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))
                      }
                      dir="ltr"
                      className="text-left border-border/60 focus-visible:border-[#2d6a4f] focus-visible:ring-[#2d6a4f]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="fitrPerPerson"
                      className="flex items-center gap-2"
                    >
                      <CircleDollarSign className="h-4 w-4 text-[#2d6a4f]" />
                      القيمة للشخص الواحد ({currency.symbol})
                    </Label>
                    <Input
                      id="fitrPerPerson"
                      type="number"
                      min={1}
                      value={fitrPerPerson}
                      onChange={(e) =>
                        setFitrPerPerson(Math.min(10000, Math.max(1, parseFloat(e.target.value) || 1)))
                      }
                      dir="ltr"
                      className="text-left border-border/60 focus-visible:border-[#2d6a4f] focus-visible:ring-[#2d6a4f]/30"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={calculateFitr}
                    className="h-11 w-full max-w-sm bg-[#2d6a4f] text-base font-bold text-white hover:bg-[#245a42] transition-colors"
                    size="lg"
                  >
                    <Calculator className="ml-2 h-5 w-5" />
                    احسب زكاة الفطر
                  </Button>
                </div>

                {fitrResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-xl border border-[#2d6a4f]/40 bg-[#2d6a4f]/10 p-5 text-center"
                  >
                    <p className="mb-1 text-sm text-muted-foreground">
                      زكاة الفطر لأسرتك ({toArabicNumerals(`${familySize}`)} أفراد)
                    </p>
                    <p className="text-3xl font-bold text-[#2d6a4f]">
                      {currency.symbol}{" "}
                      {toArabicNumerals(formatNumber(fitrResult))}
                    </p>
                  </motion.div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  <CalendarCheck className="ml-1 inline-block h-3.5 w-3.5 text-[#d4a574]" />
                  تُخرج قبل صلاة عيد الفطر
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* ================================================================
              SECTION 3: Fidya & Kaffarah
             ================================================================ */}
          <motion.div variants={fadeUpItem}>
            <Card className="border-border/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4a574]/10">
                  <UtensilsCrossed className="h-7 w-7 text-[#d4a574]" />
                </div>
                <CardTitle className="text-2xl text-[#d4a574]">
                  الفدية والكفارة
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Fidya */}
                <div className="rounded-xl border border-[#d4a574]/20 bg-[#d4a574]/5 p-5">
                  <h3 className="mb-2 text-lg font-bold text-[#d4a574]">
                    الفدية
                  </h3>
                  <p className="mb-1 text-sm">
                    لمن لا يستطيع الصيام لعذر دائم
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    إطعام مسكين عن كل يوم = وجبتان أو ما يعادلهما
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fidyaDays" className="text-sm">
                        عدد الأيام
                      </Label>
                      <Input
                        id="fidyaDays"
                        type="number"
                        min={0}
                        dir="ltr"
                        value={fidyaDays || ""}
                        placeholder="٠"
                        onChange={(e) =>
                          setFidyaDays(Math.min(365, Math.max(0, parseInt(e.target.value) || 0)))
                        }
                        className="text-left border-border/60 focus-visible:border-[#d4a574] focus-visible:ring-[#d4a574]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fidyaCost" className="text-sm">
                        تكلفة الوجبة ({currency.symbol})
                      </Label>
                      <Input
                        id="fidyaCost"
                        type="number"
                        min={1}
                        dir="ltr"
                        value={fidyaCostPerMeal}
                        onChange={(e) =>
                          setFidyaCostPerMeal(
                            Math.min(10000, Math.max(1, parseFloat(e.target.value) || 1))
                          )
                        }
                        className="text-left border-border/60 focus-visible:border-[#d4a574] focus-visible:ring-[#d4a574]/30"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={calculateFidya}
                      variant="outline"
                      className="w-full max-w-sm border-[#d4a574]/40 text-[#d4a574] hover:bg-[#d4a574]/10"
                    >
                      <Calculator className="ml-2 h-4 w-4" />
                      احسب الفدية
                    </Button>
                  </div>

                  {fidyaResult !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="mt-4 rounded-lg border border-[#d4a574]/30 bg-[#d4a574]/10 p-4 text-center"
                    >
                      <p className="mb-1 text-sm text-muted-foreground">
                        إجمالي الفدية ({toArabicNumerals(`${fidyaDays}`)} يوم ×{" "}
                        {toArabicNumerals("2")} وجبة × {currency.symbol}
                        {toArabicNumerals(`${fidyaCostPerMeal}`)})
                      </p>
                      <p className="text-2xl font-bold text-[#d4a574]">
                        {currency.symbol}{" "}
                        {toArabicNumerals(formatNumber(fidyaResult))}
                      </p>
                    </motion.div>
                  )}
                </div>

                <Separator className="bg-border/50" />

                {/* Kaffarah */}
                <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5">
                  <h3 className="mb-2 text-lg font-bold text-red-400">
                    الكفارة
                  </h3>
                  <p className="mb-1 text-sm">لمن أفطر عمداً بلا عذر</p>
                  <p className="text-sm text-muted-foreground">
                    صيام {toArabicNumerals("60")} يوماً متتالياً أو إطعام{" "}
                    {toArabicNumerals("60")} مسكيناً
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ================================================================
              SECTION 4: Info Cards
             ================================================================ */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* شروط وجوب الزكاة */}
            <motion.div variants={fadeUpItem}>
              <Card className="h-full border-[#d4a574]/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a574]/15">
                      <Info className="h-5 w-5 text-[#d4a574]" />
                    </div>
                    <CardTitle className="text-lg text-[#d4a574]">
                      شروط وجوب الزكاة
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ZAKAT_CONDITIONS.map((condition, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4a574]/15 text-xs font-bold text-[#d4a574]">
                          {toArabicNumerals(`${i + 1}`)}
                        </span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* مصارف الزكاة الثمانية */}
            <motion.div variants={fadeUpItem}>
              <Card className="h-full border-[#2d6a4f]/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6a4f]/15">
                      <BookOpen className="h-5 w-5 text-[#2d6a4f]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#2d6a4f]">
                        مصارف الزكاة الثمانية
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        سورة التوبة: {toArabicNumerals("60")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ZAKAT_RECIPIENTS.map((recipient, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f]/15 text-xs font-bold text-[#2d6a4f]">
                          {toArabicNumerals(`${i + 1}`)}
                        </span>
                        <div>
                          <span className="font-semibold">{recipient.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            &mdash; {recipient.desc}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ---- Footer note ---- */}
          <motion.p
            variants={fadeUpItem}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            هذه الحاسبة للاسترشاد فقط. يُنصح بمراجعة عالم شرعي موثوق لتحديد
            الزكاة الدقيقة المستحقة عليك.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
