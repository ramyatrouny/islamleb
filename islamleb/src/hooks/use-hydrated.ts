"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns `true` once the component has hydrated on the client.
 * Uses `useSyncExternalStore` to avoid synchronous setState inside useEffect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}
