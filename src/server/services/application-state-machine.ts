export type ApplicationStatus =
  | 'NEW'
  | 'SCREENING'
  | 'TEST_TASK'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED';

/**
 * Граф допустимых переходов статусов в воронке отбора
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  NEW: ['SCREENING', 'REJECTED'],
  SCREENING: ['TEST_TASK', 'INTERVIEW', 'REJECTED'],
  TEST_TASK: ['INTERVIEW', 'REJECTED'],
  INTERVIEW: ['OFFER', 'REJECTED'],
  OFFER: [], // Финальное позитивное состояние
  REJECTED: [], // Финальное негативное состояние
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: 'Новый отклик',
  SCREENING: 'Скрининг резюме',
  TEST_TASK: 'Тестовое задание',
  INTERVIEW: 'Интервью',
  OFFER: 'Оффер выставлен',
  REJECTED: 'Отказ',
};

/**
 * Проверка допустимости перехода из текущего статуса в целевой
 */
export function isValidStatusTransition(
  fromStatus: ApplicationStatus,
  toStatus: ApplicationStatus
): boolean {
  const allowed = ALLOWED_STATUS_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

/**
 * Получение списка доступных следующих статусов
 */
export function getNextAllowedStatuses(currentStatus: ApplicationStatus): ApplicationStatus[] {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
}

/**
 * Валидация перехода с возвратом читаемого описания ошибки
 */
export function validateStatusTransition(
  fromStatus: ApplicationStatus,
  toStatus: ApplicationStatus
): { isValid: boolean; error?: string } {
  if (fromStatus === toStatus) {
    return {
      isValid: false,
      error: `Отклик уже находится в статусе «${STATUS_LABELS[fromStatus]}»`,
    };
  }

  if (!isValidStatusTransition(fromStatus, toStatus)) {
    return {
      isValid: false,
      error: `Недопустимый переход статуса из «${STATUS_LABELS[fromStatus]}» в «${STATUS_LABELS[toStatus]}»`,
    };
  }

  return { isValid: true };
}
