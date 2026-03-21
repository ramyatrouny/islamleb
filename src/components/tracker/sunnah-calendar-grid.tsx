"use client";

import { toArabicNumerals } from "@/lib/formatters";

interface SunnahCalendarGridProps {
  daysInMonth: number;
  firstDayOfWeek: number;
  monthFasting: boolean[];
  sunnahDays: number[];
  onToggle: (dayIndex: number) => void;
}

const WEEK_DAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export function SunnahCalendarGrid({
  daysInMonth,
  firstDayOfWeek,
  monthFasting,
  sunnahDays,
  onToggle,
}: SunnahCalendarGridProps) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const fasted = monthFasting[i] ?? false;
          const isSunnah = sunnahDays.includes(dayNum);
          return (
            <button
              key={dayNum}
              onClick={() => onToggle(i)}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                fasted
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : isSunnah
                    ? "border border-[#d4a574]/30 text-[#d4a574]/70 hover:bg-[#d4a574]/10"
                    : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              {toArabicNumerals(dayNum)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
