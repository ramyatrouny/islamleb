"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRamadanStore } from "@/lib/store";
import {
  getUserProgress,
  setUserProgress,
  createUserDocument,
  subscribeToUserProgress,
  mergeProgress,
} from "@/lib/firebase/firestore";
import type { UserProgress } from "@/lib/firebase/types";

/** Convert Zustand's numeric-keyed dailyGoals to Firestore's string-keyed format */
function toFirestoreGoals(
  goals: Record<number, boolean[]>,
): Record<string, boolean[]> {
  return Object.fromEntries(
    Object.entries(goals).map(([k, v]) => [String(k), v]),
  );
}

/** Convert Firestore's string-keyed dailyGoals back to numeric keys */
function fromFirestoreGoals(
  goals: Record<string, boolean[]>,
): Record<number, boolean[]> {
  return Object.fromEntries(
    Object.entries(goals).map(([k, v]) => [Number(k), v]),
  );
}

/** Extract sync-relevant progress from the Zustand store */
function getLocalProgress(): UserProgress {
  const state = useRamadanStore.getState();
  return {
    fastingDays: state.fastingDays,
    completedJuz: state.completedJuz,
    dailyGoals: toFirestoreGoals(state.dailyGoals),
    tasbihCount: state.tasbihCount,
    selectedCity: state.selectedCity,
  };
}

/**
 * Syncs the Zustand store with Firestore when the user is authenticated.
 *
 * - On login: merges local + cloud data (prefer most progress)
 * - Push: debounced Zustand → Firestore writes
 * - Pull: onSnapshot listener for cross-device sync
 */
export function useFirestoreSync() {
  const { user } = useAuth();
  const isSyncingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── On login: initial merge ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function performInitialSync() {
      isSyncingRef.current = true;
      try {
        const uid = user!.uid;
        const cloudData = await getUserProgress(uid);
        if (cancelled) return;

        const localProgress = getLocalProgress();

        if (!cloudData) {
          // First time: create cloud doc with local data
          await createUserDocument(user!, localProgress);
        } else {
          // Merge local + cloud
          const merged = mergeProgress(localProgress, cloudData);
          useRamadanStore.getState().setSyncData({
            fastingDays: merged.fastingDays,
            completedJuz: merged.completedJuz,
            dailyGoals: fromFirestoreGoals(merged.dailyGoals),
            tasbihCount: merged.tasbihCount,
            selectedCity: merged.selectedCity,
          });
          await setUserProgress(uid, merged);
        }
      } catch {
        // Silently fail — app continues with localStorage data
      } finally {
        isSyncingRef.current = false;
      }
    }

    performInitialSync();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // ── Push: local changes → Firestore (debounced 2s) ──────────────
  useEffect(() => {
    if (!user) return;

    const unsubscribe = useRamadanStore.subscribe((state, prevState) => {
      // Skip if this update was from a cloud sync
      if (isSyncingRef.current) return;
      if (state.lastSyncedAt !== prevState.lastSyncedAt) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setUserProgress(user.uid, {
          fastingDays: state.fastingDays,
          completedJuz: state.completedJuz,
          dailyGoals: toFirestoreGoals(state.dailyGoals),
          tasbihCount: state.tasbihCount,
          selectedCity: state.selectedCity,
        }).catch(() => {
          // Silently fail — data is safe in localStorage
        });
      }, 2000);
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [user]);

  // ── Pull: Firestore → local (cross-device sync) ─────────────────
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserProgress(user.uid, (cloudData) => {
      if (isSyncingRef.current) return;

      isSyncingRef.current = true;
      try {
        useRamadanStore.getState().setSyncData({
          fastingDays: cloudData.fastingDays,
          completedJuz: cloudData.completedJuz,
          dailyGoals: fromFirestoreGoals(cloudData.dailyGoals),
          tasbihCount: cloudData.tasbihCount,
          selectedCity: cloudData.selectedCity,
        });
      } finally {
        isSyncingRef.current = false;
      }
    });

    return unsubscribe;
  }, [user]);
}
