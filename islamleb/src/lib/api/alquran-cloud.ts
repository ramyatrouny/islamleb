import { apiFetch } from "./fetcher";
import type { AlQuranJuzResponse } from "./types";

const BASE_URL = "https://api.alquran.cloud/v1";

/**
 * Fetch a specific Juz with Uthmani text.
 * Edition "quran-uthmani" returns the standard Uthmani script text.
 */
export async function fetchJuzText(
  juzNumber: number,
  signal?: AbortSignal,
): Promise<AlQuranJuzResponse> {
  return apiFetch<AlQuranJuzResponse>(
    `${BASE_URL}/juz/${juzNumber}/quran-uthmani`,
    { signal, cacheTTL: 30 * 60 * 1000 },
  );
}

/**
 * Fetch a specific Juz with audio (Alafasy recitation).
 * Returns ayahs with audio URLs from Mishary Rashid Alafasy.
 */
export async function fetchJuzAudio(
  juzNumber: number,
  signal?: AbortSignal,
): Promise<AlQuranJuzResponse> {
  return apiFetch<AlQuranJuzResponse>(
    `${BASE_URL}/juz/${juzNumber}/ar.alafasy`,
    { signal, cacheTTL: 30 * 60 * 1000 },
  );
}
