import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getIslamicPhase,
  getNextIslamicEvent,
  isRamadanSeason,
} from "@/lib/islamic-calendar";

// Ramadan 2026: Feb 18 – Mar 19, Eid Mar 20

describe("getIslamicPhase", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns "before-ramadan" within 30 days before Ramadan', () => {
    vi.setSystemTime(new Date(2026, 0, 25)); // Jan 25
    expect(getIslamicPhase()).toBe("before-ramadan");
  });

  it('returns "ramadan" during Ramadan', () => {
    vi.setSystemTime(new Date(2026, 1, 20)); // Feb 20
    expect(getIslamicPhase()).toBe("ramadan");
  });

  it('returns "eid-al-fitr" during Eid al-Fitr', () => {
    vi.setSystemTime(new Date(2026, 2, 21)); // Mar 21
    expect(getIslamicPhase()).toBe("eid-al-fitr");
  });

  it('returns "shawwal-fasting" after Eid al-Fitr ends', () => {
    vi.setSystemTime(new Date(2026, 2, 25)); // Mar 25
    expect(getIslamicPhase()).toBe("shawwal-fasting");
  });

  it('returns "dhul-hijjah" during Dhul Hijjah before Eid al-Adha', () => {
    vi.setSystemTime(new Date(2026, 6, 20)); // Jul 20
    expect(getIslamicPhase()).toBe("dhul-hijjah");
  });

  it('returns "eid-al-adha" during Eid al-Adha', () => {
    vi.setSystemTime(new Date(2026, 6, 27)); // Jul 27
    expect(getIslamicPhase()).toBe("eid-al-adha");
  });

  it('returns "normal" outside all special periods', () => {
    vi.setSystemTime(new Date(2026, 8, 15)); // Sep 15
    expect(getIslamicPhase()).toBe("normal");
  });

  it("prioritises ramadan over before-ramadan on start day", () => {
    vi.setSystemTime(new Date(2026, 1, 18)); // Feb 18 = Ramadan start
    expect(getIslamicPhase()).toBe("ramadan");
  });
});

describe("getNextIslamicEvent", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns Eid al-Fitr when during Ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 25)); // Feb 25
    const event = getNextIslamicEvent();
    expect(event.name).toBe("عيد الفطر");
  });

  it("returns Dhul Hijjah event when after Shawwal", () => {
    vi.setSystemTime(new Date(2026, 4, 1)); // May 1
    const event = getNextIslamicEvent();
    expect(event.name).toBe("عشر ذي الحجة");
  });

  it("returns estimated next Ramadan when all events have passed", () => {
    vi.setSystemTime(new Date(2027, 5, 1)); // Jun 2027
    const event = getNextIslamicEvent();
    expect(event.name).toBe("رمضان المبارك");
    expect(event.hijriDate).toBe("١ رمضان ١٤٤٩");
  });
});

describe("isRamadanSeason", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns true during before-ramadan", () => {
    vi.setSystemTime(new Date(2026, 0, 25));
    expect(isRamadanSeason()).toBe(true);
  });

  it("returns true during ramadan", () => {
    vi.setSystemTime(new Date(2026, 1, 20));
    expect(isRamadanSeason()).toBe(true);
  });

  it("returns true during eid-al-fitr", () => {
    vi.setSystemTime(new Date(2026, 2, 21));
    expect(isRamadanSeason()).toBe(true);
  });

  it("returns false outside ramadan season", () => {
    vi.setSystemTime(new Date(2026, 8, 15));
    expect(isRamadanSeason()).toBe(false);
  });
});
