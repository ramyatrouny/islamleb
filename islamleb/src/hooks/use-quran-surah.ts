"use client";

import { useApiFetch } from "./use-api-fetch";
import { fetchChapters } from "@/lib/api/quran-com";
import type { QuranComChapter } from "@/lib/api/types";

/**
 * Fetches the full list of 114 surahs from Quran.com API.
 * Returns chapters with Arabic names, verse counts, and metadata.
 */
export function useQuranSurahs() {
  return useApiFetch<QuranComChapter[]>(
    (signal) => fetchChapters(signal).then((res) => res.chapters),
    [],
  );
}
