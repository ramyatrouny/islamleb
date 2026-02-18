"use client";

import { useFirestoreSync } from "@/hooks/use-firestore-sync";

/**
 * Invisible component that activates Firestore sync when the user
 * is authenticated. Renders nothing. Place once in the root layout.
 */
export function FirestoreSyncInitializer() {
  useFirestoreSync();
  return null;
}
