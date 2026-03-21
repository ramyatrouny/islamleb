import { RAMADAN_2026, ISLAMIC_EVENTS } from "./constants";
import { isRamadan } from "./date-utils";
import type { IslamicPhase } from "./types";

export function getIslamicPhase(now: Date = new Date()): IslamicPhase {
  if (isRamadan(now)) return "ramadan";
  if (now >= ISLAMIC_EVENTS.EID_AL_FITR_START && now < ISLAMIC_EVENTS.EID_AL_FITR_END)
    return "eid-al-fitr";
  if (now >= ISLAMIC_EVENTS.EID_AL_ADHA_START && now < ISLAMIC_EVENTS.EID_AL_ADHA_END)
    return "eid-al-adha";
  if (now >= ISLAMIC_EVENTS.DHUL_HIJJAH_START && now < ISLAMIC_EVENTS.EID_AL_ADHA_START)
    return "dhul-hijjah";
  if (now >= ISLAMIC_EVENTS.EID_AL_FITR_END && now < ISLAMIC_EVENTS.SHAWWAL_END)
    return "shawwal-fasting";
  const thirtyDaysBefore = new Date(RAMADAN_2026.START);
  thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);
  if (now >= thirtyDaysBefore && now < RAMADAN_2026.START) return "before-ramadan";
  return "normal";
}

const UPCOMING_EVENTS = [
  { name: "رمضان المبارك", date: RAMADAN_2026.START, hijriDate: "١ رمضان ١٤٤٧" },
  { name: "عيد الفطر", date: ISLAMIC_EVENTS.EID_AL_FITR_START, hijriDate: "١ شوال ١٤٤٧" },
  {
    name: "صيام ستة من شوال",
    date: ISLAMIC_EVENTS.EID_AL_FITR_END,
    hijriDate: "٤ شوال ١٤٤٧",
  },
  {
    name: "عشر ذي الحجة",
    date: ISLAMIC_EVENTS.DHUL_HIJJAH_START,
    hijriDate: "١ ذو الحجة ١٤٤٧",
  },
  { name: "يوم عرفة", date: ISLAMIC_EVENTS.ARAFAH, hijriDate: "٩ ذو الحجة ١٤٤٧" },
  {
    name: "عيد الأضحى",
    date: ISLAMIC_EVENTS.EID_AL_ADHA_START,
    hijriDate: "١٠ ذو الحجة ١٤٤٧",
  },
  {
    name: "رمضان المبارك",
    date: ISLAMIC_EVENTS.NEXT_RAMADAN_START,
    hijriDate: "١ رمضان ١٤٤٨",
  },
];

export function getNextIslamicEvent(
  now: Date = new Date(),
): { name: string; date: Date; hijriDate: string } {
  for (const event of UPCOMING_EVENTS) {
    if (event.date > now) return event;
  }
  const estimated = new Date(ISLAMIC_EVENTS.NEXT_RAMADAN_START);
  estimated.setDate(estimated.getDate() + 354);
  return { name: "رمضان المبارك", date: estimated, hijriDate: "١ رمضان ١٤٤٩" };
}

export function isRamadanSeason(now?: Date): boolean {
  const phase = getIslamicPhase(now);
  return phase === "before-ramadan" || phase === "ramadan";
}
