import {
  Home,
  Clock,
  BookOpen,
  Heart,
  CalendarDays,
  Calculator,
  HandHeart,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import type { NavItem, IslamicPhase } from "@/lib/types";

/** Full navigation items used in header and mobile drawer */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/prayer-times", label: "مواقيت الصلاة", icon: Clock },
  { href: "/quran", label: "القرآن الكريم", icon: BookOpen },
  { href: "/ayat-al-kursi", label: "آية الكرسي", icon: ShieldCheck },
  { href: "/adhkar", label: "الأذكار", icon: Heart },
  { href: "/tracker", label: "المتتبع", icon: CalendarDays },
  { href: "/zakat", label: "حاسبة الزكاة", icon: Calculator },
  { href: "/calendar", label: "التقويم", icon: HandHeart },
  { href: "/contact", label: "تواصل معنا", icon: MessageCircle },
];

/** Subset for mobile bottom navigation (5 most-used) */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/prayer-times", label: "الصلاة", icon: Clock },
  { href: "/quran", label: "القرآن", icon: BookOpen },
  { href: "/adhkar", label: "الأذكار", icon: Heart },
  { href: "/tracker", label: "المتتبع", icon: CalendarDays },
];

const RAMADAN_PHASES: IslamicPhase[] = ["before-ramadan", "ramadan"];

/** Get visible nav items based on current Islamic phase */
export function getVisibleNavItems(phase: IslamicPhase): NavItem[] {
  const isRamadan = RAMADAN_PHASES.includes(phase);
  return NAV_ITEMS
    .filter((item) => {
      if (item.href === "/calendar" && !isRamadan) return false;
      return true;
    })
    .map((item) => {
      if (item.href === "/tracker" && !isRamadan) {
        return { ...item, label: "صيام السنّة" };
      }
      return item;
    });
}

/** Get visible bottom nav items based on current Islamic phase */
export function getVisibleBottomNavItems(phase: IslamicPhase): NavItem[] {
  const isRamadan = RAMADAN_PHASES.includes(phase);
  return BOTTOM_NAV_ITEMS.map((item) => {
    if (item.href === "/tracker" && !isRamadan) {
      return { ...item, label: "السنّة" };
    }
    return item;
  });
}
