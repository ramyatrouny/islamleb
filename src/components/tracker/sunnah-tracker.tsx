"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ARABIC_MONTHS } from "@/lib/constants";
import { toArabicNumerals } from "@/lib/formatters";
import { useRamadanStore } from "@/lib/store";
import { GENERAL_SPIRITUAL_GOALS } from "@/config/spiritual-goals";
import { PageHeader } from "@/components/page-header";
import { SunnahCalendarGrid } from "./sunnah-calendar-grid";

export function SunnahTracker() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth() + 1;
  const yearMonth = `${viewYear}-${String(viewMonth).padStart(2, "0")}`;
  const daysInViewMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();

  const sunnahFasting = useRamadanStore((s) => s.sunnahFasting);
  const toggleSunnahFasting = useRamadanStore((s) => s.toggleSunnahFasting);
  const monthFasting = sunnahFasting[yearMonth] ?? Array(daysInViewMonth).fill(false);

  const sunnahDays: number[] = [];
  for (let d = 1; d <= daysInViewMonth; d++) {
    const dow = new Date(viewYear, viewMonth - 1, d).getDay();
    if (dow === 1 || dow === 4) sunnahDays.push(d);
  }

  const generalDailyGoals = useRamadanStore((s) => s.generalDailyGoals);
  const toggleGeneralGoal = useRamadanStore((s) => s.toggleGeneralGoal);
  const today = new Date().toISOString().slice(0, 10);

  const prevMonth = () =>
    setViewDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() - 1);
      return n;
    });

  const nextMonth = () =>
    setViewDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() + 1);
      return n;
    });

  return (
    <div
      className="overflow-x-clip"
      style={{
        backgroundColor: "#0a0a0f",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.06) 0%, transparent 60%)",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <PageHeader
          title="صيام السنّة"
          subtitle="تتبع صيام الإثنين والخميس وأيام البيض"
        />

        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            السابق
          </Button>
          <h3 className="text-lg font-semibold" style={{ color: "#d4a574" }}>
            {ARABIC_MONTHS[viewMonth - 1]} {toArabicNumerals(viewYear)}
          </h3>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            التالي
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 bg-[rgba(45,106,79,0.1)]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#d4a574" }}>
                {toArabicNumerals(monthFasting.filter(Boolean).length)}
              </p>
              <p className="text-sm text-muted-foreground">أيام صيام هذا الشهر</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-[rgba(45,106,79,0.1)]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#d4a574" }}>
                {toArabicNumerals(sunnahDays.length)}
              </p>
              <p className="text-sm text-muted-foreground">أيام السنّة هذا الشهر</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar grid */}
        <Card
          className="border-0 bg-[rgba(212,165,116,0.06)]"
          style={{ borderColor: "rgba(212,165,116,0.15)", borderWidth: "1px" }}
        >
          <CardContent className="p-4">
            <SunnahCalendarGrid
              daysInMonth={daysInViewMonth}
              firstDayOfWeek={firstDayOfWeek}
              monthFasting={monthFasting}
              sunnahDays={sunnahDays}
              onToggle={(i) => toggleSunnahFasting(yearMonth, i, daysInViewMonth)}
            />
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex gap-4 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border border-[#d4a574]/30" />
            <span>يوم سنّة</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
            <span>تم الصيام</span>
          </div>
        </div>

        {/* Spiritual goals */}
        <Card
          className="border-0 bg-[rgba(212,165,116,0.06)]"
          style={{ borderColor: "rgba(212,165,116,0.15)", borderWidth: "1px" }}
        >
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: "#d4a574" }}>
              الأهداف اليومية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {GENERAL_SPIRITUAL_GOALS.map((goal, i) => {
              const todayGoals =
                generalDailyGoals[today] ?? Array(GENERAL_SPIRITUAL_GOALS.length).fill(false);
              const done = todayGoals[i] ?? false;
              return (
                <button
                  key={i}
                  onClick={() => toggleGeneralGoal(today, i, GENERAL_SPIRITUAL_GOALS.length)}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors ${
                    done
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span>{goal}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
