import {
  Home,
  Clock,
  BookOpen,
  Heart,
  CalendarDays,
  Calculator,
  HandHeart,
  MessageCircle,
  Users,
  ShieldCheck,
} from "lucide-react";
import type { NavItem } from "@/lib/types";

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
  { href: "/community", label: "المجتمع", icon: Users },
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
