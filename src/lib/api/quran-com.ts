import { apiFetch } from "./fetcher";
import type { QuranComChaptersResponse } from "./types";

const BASE_URL = "https://api.quran.com/api/v4";

/**
 * Fetch all 114 chapters (surahs) with Arabic metadata.
 */
export async function fetchChapters(
  signal?: AbortSignal,
): Promise<QuranComChaptersResponse> {
  return apiFetch<QuranComChaptersResponse>(
    `${BASE_URL}/chapters?language=ar`,
    { signal, cacheTTL: 60 * 60 * 1000 },
  );
}
