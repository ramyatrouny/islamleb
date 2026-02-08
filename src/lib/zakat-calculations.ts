/** Zakat al-Mal calculation constants */
export const ZAKAT_RATE = 0.025;

export interface AssetField {
  key: string;
  subtract?: boolean;
}

export interface MalResult {
  total: number;
  zakat: number;
  belowNisab: boolean;
}

/** Calculate Zakat al-Mal from asset values */
export function calculateMal(
  assets: Record<string, number>,
  fields: AssetField[],
  nisabInCurrency: number,
): MalResult {
  let total = 0;
  for (const field of fields) {
    if (field.subtract) {
      total -= assets[field.key] || 0;
    } else {
      total += assets[field.key] || 0;
    }
  }
  if (total < 0) total = 0;
  const belowNisab = total < nisabInCurrency;
  const zakat = belowNisab ? 0 : total * ZAKAT_RATE;
  return { total, zakat, belowNisab };
}

/** Calculate Zakat al-Fitr */
export function calculateFitr(familySize: number, fitrPerPerson: number): number {
  return familySize * fitrPerPerson;
}

/** Calculate Fidya */
export function calculateFidya(days: number, costPerMeal: number): number {
  return days * costPerMeal * 2;
}
