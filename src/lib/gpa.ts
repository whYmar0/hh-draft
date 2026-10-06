export type GpaScale = 'SCALE_4' | 'SCALE_5';

export type GpaBadgeTier = 'HIGH_HONORS' | 'HONORS' | 'STANDARD';

export interface GpaBadgeInfo {
  tier: GpaBadgeTier;
  label: string;
  normalizedGpa: number;
}

/**
 * Приведение среднего балла (GPA) к единой шкале 4.0
 * Если шкала 5.0, то: (gpa / 5.0) * 4.0
 */
export function normalizeGpa(gpa: number, scale: GpaScale): number {
  if (gpa <= 0) return 0.0;
  
  let normalized = gpa;
  if (scale === 'SCALE_5') {
    normalized = (gpa / 5.0) * 4.0;
  }
  
  return Math.round(normalized * 100) / 100;
}

/**
 * Валидация диапазона GPA в зависимости от выбранной шкалы
 */
export function validateGpa(gpa: number, scale: GpaScale): { isValid: boolean; error?: string } {
  if (gpa < 0) {
    return { isValid: false, error: 'Средний балл не может быть отрицательным' };
  }

  const maxAllowed = scale === 'SCALE_5' ? 5.0 : 4.0;
  if (gpa > maxAllowed) {
    return {
      isValid: false,
      error: `Для шкалы ${scale === 'SCALE_5' ? '5.0' : '4.0'} максимальный балл составляет ${maxAllowed}`,
    };
  }

  return { isValid: true };
}

/**
 * Определение академического бейджа на основе нормализованного балла:
 * - HIGH_HONORS (Высокий балл): >= 3.6 (эквивалент 4.5+ по 5-балльной)
 * - HONORS (Отличная успеваемость): 3.2 - 3.59 (эквивалент 4.0 - 4.49 по 5-балльной)
 * - STANDARD (Базовая успеваемость): < 3.2
 */
export function getGpaBadge(gpa: number, scale: GpaScale): GpaBadgeInfo {
  const normalized = normalizeGpa(gpa, scale);

  if (normalized >= 3.6) {
    return {
      tier: 'HIGH_HONORS',
      label: 'Академическое превосходство',
      normalizedGpa: normalized,
    };
  }

  if (normalized >= 3.2) {
    return {
      tier: 'HONORS',
      label: 'Высокая успеваемость',
      normalizedGpa: normalized,
    };
  }

  return {
    tier: 'STANDARD',
    label: 'Хорошая успеваемость',
    normalizedGpa: normalized,
  };
}
