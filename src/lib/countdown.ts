import { RAMADAN_2026 } from "./constants";
import { getTimeRemaining, getRamadanDay, getTodayIftar } from "./date-utils";
import { getIslamicPhase, getNextIslamicEvent } from "./islamic-calendar";
import type { IslamicPhase, TimeRemaining } from "./types";

export interface CountdownState {
  phase: IslamicPhase;
  timeLeft: TimeRemaining;
  eventDay: number;
}

/** Compute the current countdown state based on Islamic calendar phase */
export function computeCountdownState(maghribTime?: string | null): CountdownState {
  const now = new Date();
  const phase = getIslamicPhase(now);

  switch (phase) {
    case "before-ramadan":
      return {
        phase,
        timeLeft: getTimeRemaining(RAMADAN_2026.START),
        eventDay: Math.ceil((RAMADAN_2026.START.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      };

    case "ramadan": {
      const iftar = getTodayIftar(maghribTime ?? undefined);
      return {
        phase,
        timeLeft: now < iftar ? getTimeRemaining(iftar) : { days: 0, hours: 0, minutes: 0, seconds: 0 },
        eventDay: getRamadanDay(now),
      };
    }

    case "eid-al-fitr":
    case "eid-al-adha":
      return {
        phase,
        timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        eventDay: 0,
      };

    default: {
      const nextEvent = getNextIslamicEvent(now);
      return {
        phase,
        timeLeft: getTimeRemaining(nextEvent.date),
        eventDay: 0,
      };
    }
  }
}
