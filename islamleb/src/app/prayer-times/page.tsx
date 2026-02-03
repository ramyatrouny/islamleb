"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { DecorativeBackground } from "@/components/decorative-background";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Star,
  Clock,
  MapPin,
  CalendarDays,
  ChevronDown,
  Loader2,
  AlertCircle,
  Timer,
  Bell,
  BellRing,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

import type {
  PrayerTimings,
  HijriDate,
  GregorianDate,
  CityInfo,
} from "@/lib/types";
import { toArabicNumerals } from "@/lib/formatters";
import { CITIES, DEFAULT_CITY } from "@/config/cities";
import { staggerContainer, fadeUpItem } from "@/lib/animations";
import { useRamadanStore } from "@/lib/store";
import { fetchPrayerTimes } from "@/lib/api/aladhan";
import { ERROR_MESSAGES } from "@/lib/error-messages";

// ---------------------------------------------------------------------------
const cityByEnglish = Object.fromEntries(
  CITIES.map((c) => [c.english, c])
);

// ---------------------------------------------------------------------------
// Prayer metadata — single consistent color system
// ---------------------------------------------------------------------------
interface PrayerMeta {
  key: keyof PrayerTimings;
  arabic: string;
  icon: React.ElementType;
}

const PRAYERS: PrayerMeta[] = [
  { key: "Fajr", arabic: "الفجر", icon: Sunrise },
  { key: "Sunrise", arabic: "الشروق", icon: Sun },
  { key: "Dhuhr", arabic: "الظهر", icon: CloudSun },
  { key: "Asr", arabic: "العصر", icon: Sun },
  { key: "Maghrib", arabic: "المغرب", icon: Sunset },
  { key: "Isha", arabic: "العشاء", icon: Moon },
];

const PRAYER_ORDER: (keyof PrayerTimings)[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const cleaned = timeStr.replace(/\s*\(.*\)/, "").trim();
  const [h, m] = cleaned.split(":").map(Number);
  return { hours: h, minutes: m };
}

function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

function nowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function formatCountdown(diffMinutes: number): string {
  if (diffMinutes < 0) diffMinutes += 24 * 60;
  const h = Math.floor(diffMinutes / 60);
  const m = diffMinutes % 60;
  if (h === 0) return `${toArabicNumerals(m)} دقيقة`;
  if (m === 0) return `${toArabicNumerals(h)} ساعة`;
  return `${toArabicNumerals(h)} ساعة و ${toArabicNumerals(m)} دقيقة`;
}

function cleanTime(t: string) {
  return t.replace(/\s*\(.*\)/, "");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PrayerTimesPage() {
  const { selectedCity: storedCity, setSelectedCity: setStoredCity } =
    useRamadanStore();

  const selectedCity: CityInfo = cityByEnglish[storedCity] ?? DEFAULT_CITY;

  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [gregorianDate, setGregorianDate] = useState<GregorianDate | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMinutes, setCurrentMinutes] = useState(nowMinutes());
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Load notification preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("islamleb-notifications");
      if (stored === "true" && typeof Notification !== "undefined" && Notification.permission === "granted") {
        setNotificationsEnabled(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Toggle notifications
  const toggleNotifications = useCallback(async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      try { localStorage.setItem("islamleb-notifications", "false"); } catch {}
      return;
    }

    if (typeof Notification === "undefined") return;

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      setNotificationsEnabled(true);
      try { localStorage.setItem("islamleb-notifications", "true"); } catch {}
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!cityDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [cityDropdownOpen]);

  const fetchTimes = useCallback(
    async (city: CityInfo, signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchPrayerTimes(
          city.english,
          city.country,
          2,
          signal
        );
        setTimings(json.data.timings);
        setHijriDate(json.data.date.hijri);
        setGregorianDate(json.data.date.gregorian);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(ERROR_MESSAGES.LOAD_PRAYER_TIMES);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchTimes(selectedCity, controller.signal);
    return () => controller.abort();
  }, [selectedCity, fetchTimes]);

  useEffect(() => {
    const id = setInterval(() => setCurrentMinutes(nowMinutes()), 15_000);
    return () => clearInterval(id);
  }, []);

  const nextPrayer = useMemo(() => {
    if (!timings) return null;
    for (const key of PRAYER_ORDER) {
      const pm = timeToMinutes(timings[key]);
      if (currentMinutes < pm) {
        return { key, minutes: pm - currentMinutes };
      }
    }
    const fajrMin = timeToMinutes(timings.Fajr);
    return {
      key: "Fajr" as keyof PrayerTimings,
      minutes: 24 * 60 - currentMinutes + fajrMin,
    };
  }, [timings, currentMinutes]);

  const nextPrayerArabic = useMemo(() => {
    if (!nextPrayer) return "";
    return PRAYERS.find((p) => p.key === nextPrayer.key)?.arabic ?? "";
  }, [nextPrayer]);

  // Schedule notification 5 minutes before next prayer
  useEffect(() => {
    if (!notificationsEnabled || !timings || !nextPrayer) return;

    const prayerArabic = PRAYERS.find((p) => p.key === nextPrayer.key)?.arabic ?? "";
    const minutesUntilNotification = nextPrayer.minutes - 5;

    if (minutesUntilNotification <= 0) return;

    const msUntilNotification = minutesUntilNotification * 60 * 1000;

    const timeoutId = setTimeout(() => {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("IslamLeb", {
          body: `صلاة ${prayerArabic} بعد ٥ دقائق`,
          dir: "rtl",
          lang: "ar",
        });
      }
    }, msUntilNotification);

    return () => clearTimeout(timeoutId);
  }, [notificationsEnabled, timings, nextPrayer]);

  const imsakTime = timings?.Imsak ?? "";
  const iftarTime = timings?.Maghrib ?? "";

  const imsakCountdown = useMemo(() => {
    if (!imsakTime) return null;
    const diff = timeToMinutes(imsakTime) - currentMinutes;
    return diff > 0 ? diff : null;
  }, [imsakTime, currentMinutes]);

  const iftarCountdown = useMemo(() => {
    if (!iftarTime) return null;
    const diff = timeToMinutes(iftarTime) - currentMinutes;
    return diff > 0 ? diff : null;
  }, [iftarTime, currentMinutes]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="bg-background text-foreground min-h-screen">
      <DecorativeBackground />

      <div className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <PageHeader
          title="مواقيت الصلاة"
          subtitle="أوقات الصلاة والإمساك والإفطار"
          icon={Clock}
        />

        {/* ---- City selector ---- */}
        <motion.div
          ref={cityDropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative mx-auto mb-10 max-w-xs"
        >
          <button
            onClick={() => setCityDropdownOpen((o) => !o)}
            role="combobox"
            aria-expanded={cityDropdownOpen}
            aria-controls="city-listbox"
            aria-haspopup="listbox"
            aria-label="اختر المدينة"
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm transition-all hover:border-[#d4a574]/40 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/30"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#d4a574]" />
              <span className="font-medium">{selectedCity.arabic}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                cityDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {cityDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                id="city-listbox"
                role="listbox"
                className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border/60 bg-card shadow-xl"
              >
                <div className="py-1">
                  {CITIES.map((city) => {
                    const isSelected = city.english === selectedCity.english;
                    return (
                      <button
                        key={city.english}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setStoredCity(city.english);
                          setCityDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-4 py-2 text-right text-sm transition-colors ${
                          isSelected
                            ? "bg-[#d4a574]/10 text-[#d4a574] font-medium"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <MapPin
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isSelected
                              ? "text-[#d4a574]"
                              : "text-muted-foreground/30"
                          }`}
                        />
                        {city.arabic}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ---- Notification toggle ---- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-6 flex justify-center"
        >
          <button
            onClick={toggleNotifications}
            aria-label={notificationsEnabled ? "تعطيل الإشعارات" : "تفعيل الإشعارات"}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all ${
              notificationsEnabled
                ? "border-[#d4a574]/40 bg-[#d4a574]/10 text-[#d4a574]"
                : "border-border/60 bg-card text-muted-foreground hover:border-[#d4a574]/30"
            }`}
          >
            {notificationsEnabled ? (
              <BellRing className="h-3.5 w-3.5" />
            ) : (
              <Bell className="h-3.5 w-3.5" />
            )}
            <span>{notificationsEnabled ? "الإشعارات مفعّلة" : "تفعيل الإشعارات"}</span>
          </button>
        </motion.div>

        {/* ---- Loading ---- */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-3 py-28"
          >
            <Loader2 className="h-8 w-8 animate-spin text-[#d4a574]" />
            <p className="text-muted-foreground text-sm">
              جارٍ تحميل المواقيت...
            </p>
          </motion.div>
        )}

        {/* ---- Error ---- */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-sm rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center"
          >
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
            <p className="mt-3 text-sm text-red-300">{error}</p>
            <button
              onClick={() => fetchTimes(selectedCity)}
              aria-label="إعادة المحاولة"
              className="mt-4 rounded-lg bg-[#d4a574] px-5 py-2 text-sm font-semibold text-[#0a0a0f] transition-colors hover:bg-[#c9963e]"
            >
              إعادة المحاولة
            </button>
          </motion.div>
        )}

        {/* ---- Main content ---- */}
        {!loading && !error && timings && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* ---- Date row ---- */}
            <motion.div
              variants={fadeUpItem}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {hijriDate && (
                <Badge
                  variant="outline"
                  className="border-[#d4a574]/25 px-3 py-1 text-xs text-[#d4a574]"
                >
                  <CalendarDays className="ml-1.5 h-3 w-3" />
                  {toArabicNumerals(
                    `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year} هـ`
                  )}
                </Badge>
              )}
              {hijriDate && (
                <Badge
                  variant="outline"
                  className="border-[#2d6a4f]/25 px-3 py-1 text-xs text-[#2d6a4f]"
                >
                  {hijriDate.weekday.ar}
                </Badge>
              )}
              {gregorianDate && (
                <Badge
                  variant="outline"
                  className="border-border/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  {toArabicNumerals(gregorianDate.date)}
                </Badge>
              )}
            </motion.div>

            {/* ---- Imsak & Iftar ---- */}
            <motion.div variants={fadeUpItem}>
              <div className="overflow-hidden rounded-2xl border border-[#d4a574]/15 bg-card">
                <div className="grid grid-cols-2">
                  {/* Imsak */}
                  <div className="flex flex-col items-center gap-1.5 border-l border-border/30 px-4 py-6 rtl:border-l-0 rtl:border-r">
                    <span className="text-xs font-medium text-[#2d6a4f] flex items-center gap-1.5">
                      <Star className="h-3 w-3" />
                      إمساك
                    </span>
                    <span className="gold-gradient-text text-2xl font-bold sm:text-3xl font-(family-name:--font-amiri)">
                      {toArabicNumerals(cleanTime(imsakTime))}
                    </span>
                    {imsakCountdown !== null && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Timer className="h-2.5 w-2.5" />
                        بعد {formatCountdown(imsakCountdown)}
                      </span>
                    )}
                  </div>

                  {/* Iftar */}
                  <div className="flex flex-col items-center gap-1.5 px-4 py-6">
                    <span className="text-xs font-medium text-[#d4a574] flex items-center gap-1.5">
                      <Sunset className="h-3 w-3" />
                      إفطار
                    </span>
                    <span className="gold-gradient-text text-2xl font-bold sm:text-3xl font-(family-name:--font-amiri)">
                      {toArabicNumerals(cleanTime(iftarTime))}
                    </span>
                    {iftarCountdown !== null && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Timer className="h-2.5 w-2.5" />
                        بعد {formatCountdown(iftarCountdown)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ---- Next prayer ---- */}
            {nextPrayer && (
              <motion.div variants={fadeUpItem}>
                <div className="flex items-center justify-center gap-2.5 rounded-xl bg-[#2d6a4f]/8 px-4 py-3 text-sm">
                  <Clock className="h-4 w-4 text-[#2d6a4f]" />
                  <span>
                    الصلاة القادمة:{" "}
                    <span className="font-semibold text-[#d4a574]">
                      {nextPrayerArabic}
                    </span>{" "}
                    — بعد{" "}
                    <span className="font-semibold text-[#d4a574]">
                      {formatCountdown(nextPrayer.minutes)}
                    </span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* ---- Prayer times list ---- */}
            <motion.div variants={fadeUpItem}>
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card">
                {PRAYERS.map((prayer, i) => {
                  const time = timings[prayer.key];
                  const isNext = nextPrayer?.key === prayer.key;
                  const isLast = i === PRAYERS.length - 1;
                  const Icon = prayer.icon;

                  return (
                    <div
                      key={prayer.key}
                      className={`flex items-center justify-between px-5 py-3.5 transition-colors ${
                        !isLast ? "border-b border-border/30" : ""
                      } ${
                        isNext
                          ? "bg-[#d4a574]/5"
                          : ""
                      }`}
                    >
                      {/* Right side: icon + name */}
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-[18px] w-[18px] ${
                            isNext
                              ? "text-[#d4a574]"
                              : "text-muted-foreground/50"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isNext
                              ? "font-semibold text-[#d4a574]"
                              : "text-foreground/80"
                          }`}
                        >
                          {prayer.arabic}
                        </span>
                        {isNext && (
                          <span className="text-[10px] text-[#d4a574]/70 bg-[#d4a574]/10 px-2 py-0.5 rounded-full font-medium">
                            التالية
                          </span>
                        )}
                      </div>

                      {/* Left side: time */}
                      <span
                        className={`text-base font-bold font-(family-name:--font-amiri) tabular-nums ${
                          isNext
                            ? "text-[#d4a574]"
                            : "text-foreground"
                        }`}
                      >
                        {toArabicNumerals(cleanTime(time))}
                      </span>
                    </div>
                  );
                })}

                {/* Imsak row */}
                <div className="flex items-center justify-between border-t border-border/30 px-5 py-3.5 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Star className="h-[18px] w-[18px] text-muted-foreground/50" />
                    <span className="text-sm text-foreground/80">الإمساك</span>
                    <span className="text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                      التوقف عن الطعام
                    </span>
                  </div>
                  <span className="text-base font-bold font-(family-name:--font-amiri) tabular-nums text-foreground">
                    {toArabicNumerals(cleanTime(imsakTime))}
                  </span>
                </div>

                {/* Midnight row */}
                <div className="flex items-center justify-between border-t border-border/30 px-5 py-3.5 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Moon className="h-[18px] w-[18px] text-muted-foreground/50" />
                    <span className="text-sm text-foreground/80">
                      منتصف الليل
                    </span>
                  </div>
                  <span className="text-base font-bold font-(family-name:--font-amiri) tabular-nums text-foreground">
                    {toArabicNumerals(cleanTime(timings.Midnight ?? ""))}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ---- Footer ---- */}
            <motion.p
              variants={fadeUpItem}
              className="text-center text-[11px] text-muted-foreground/50 pt-2"
            >
              الأوقات محسوبة وفق طريقة الجمعية الإسلامية لأمريكا الشمالية
              (ISNA) &mdash; قد تختلف بحسب الموقع الدقيق
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
