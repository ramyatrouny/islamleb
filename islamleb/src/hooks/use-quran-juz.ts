"use client";

import { useState, useCallback } from "react";
import { fetchJuzText } from "@/lib/api/alquran-cloud";
import type { AlQuranJuzData } from "@/lib/api/types";

interface JuzSurahRange {
  surahNumber: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
}

/**
 * Hook to fetch Juz detail (surah ranges) from Al-Quran Cloud API on demand.
 * Only fetches when `loadJuz(n)` is called — not on mount.
 */
export function useQuranJuz() {
  const [juzData, setJuzData] = useState<Record<number, JuzSurahRange[]>>({});
  const [loadingJuz, setLoadingJuz] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadJuz = useCallback(async (juzNumber: number) => {
    // Skip if already loaded
    if (juzData[juzNumber]) return;

    setLoadingJuz(juzNumber);
    setError(null);

    try {
      const res = await fetchJuzText(juzNumber);
      const ranges = extractSurahRanges(res.data);
      setJuzData((prev) => ({ ...prev, [juzNumber]: ranges }));
    } catch {
      setError("تعذّر تحميل بيانات الجزء");
    } finally {
      setLoadingJuz(null);
    }
  }, [juzData]);

  return { juzData, loadingJuz, error, loadJuz };
}

/** Extract unique surah ranges from a juz's ayahs */
function extractSurahRanges(data: AlQuranJuzData): JuzSurahRange[] {
  const map = new Map<
    number,
    { surahName: string; fromAyah: number; toAyah: number }
  >();

  for (const ayah of data.ayahs) {
    const existing = map.get(ayah.surah.number);
    if (existing) {
      existing.toAyah = Math.max(existing.toAyah, ayah.numberInSurah);
    } else {
      map.set(ayah.surah.number, {
        surahName: ayah.surah.name,
        fromAyah: ayah.numberInSurah,
        toAyah: ayah.numberInSurah,
      });
    }
  }

  return Array.from(map.entries()).map(([num, info]) => ({
    surahNumber: num,
    surahName: info.surahName,
    fromAyah: info.fromAyah,
    toAyah: info.toAyah,
  }));
}
