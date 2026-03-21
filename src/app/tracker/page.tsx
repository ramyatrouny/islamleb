"use client";

import { useHydrated } from "@/hooks/use-hydrated";
import { getIslamicPhase } from "@/lib/islamic-calendar";
import { RamadanTracker } from "@/components/tracker/ramadan-tracker";
import { SunnahTracker } from "@/components/tracker/sunnah-tracker";

export default function TrackerPage() {
  const mounted = useHydrated();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">
          جاري التحميل...
        </div>
      </div>
    );
  }

  const phase = getIslamicPhase();
  const isRamadanMode = phase === "ramadan" || phase === "before-ramadan";

  return isRamadanMode ? <RamadanTracker /> : <SunnahTracker />;
}
