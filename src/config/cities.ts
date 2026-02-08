import type { CityInfo } from "@/lib/types";

/** Lebanese cities */
export const CITIES: CityInfo[] = [
  { arabic: "بيروت", english: "Beirut", country: "Lebanon" },
  { arabic: "طرابلس", english: "Tripoli", country: "Lebanon" },
  { arabic: "صيدا", english: "Sidon", country: "Lebanon" },
  { arabic: "صور", english: "Tyre", country: "Lebanon" },
  { arabic: "زحلة", english: "Zahleh", country: "Lebanon" },
  { arabic: "بعلبك", english: "Baalbek", country: "Lebanon" },
  { arabic: "جونية", english: "Jounieh", country: "Lebanon" },
  { arabic: "النبطية", english: "Nabatieh", country: "Lebanon" },
  { arabic: "عاليه", english: "Aley", country: "Lebanon" },
  { arabic: "مكة المكرمة", english: "Mecca", country: "Saudi Arabia" },
  { arabic: "المدينة المنورة", english: "Medina", country: "Saudi Arabia" },
  { arabic: "القدس", english: "Jerusalem", country: "Palestine" },
];

/** Default city */
export const DEFAULT_CITY = CITIES[0]; // Beirut
