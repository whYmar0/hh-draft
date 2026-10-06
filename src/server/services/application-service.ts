import {
  ApplicationStatus,
  validateStatusTransition,
} from '@/server/services/application-state-machine';

export interface ApplicationHistoryEntry {
  id: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedByUserId: string;
  note?: string | null;
  changedAt: Date;
}

export interface ApplicationRecord {
  id: string;
  jobPostingId: string;
  studentProfileId: string;
  coverLetter?: string | null;
  status: ApplicationStatus;
  testSubmissionUrl?: string | null;
  employerFeedback?: string | null;
  appliedAt: Date;
  history: ApplicationHistoryEntry[];
}

export interface CreateApplicationParams {
  jobPostingId: string;
  studentProfileId: string;
  coverLetter?: string | null;
  testSubmissionUrl?: string | null;
}

/**
 * Создание записи нового отклика на вакансию
 */
export function createApplicationInMemory(
  params: CreateApplicationParams
): ApplicationRecord {
  const now = new Date();
  const id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    jobPostingId: params.jobPostingId,
    studentProfileId: params.studentProfileId,
    coverLetter: params.coverLetter || null,
    status: 'NEW',
    testSubmissionUrl: params.testSubmissionUrl || null,
    employerFeedback: null,
    appliedAt: now,
    history: [
      {
        id: `hist-${Date.now()}`,
        fromStatus: 'NEW',
        toStatus: 'NEW',
        changedByUserId: params.studentProfileId,
        note: 'Подача отклика кандидатом',
        changedAt: now,
      },
    ],
  };
}

/**
 * Смена статуса кандидата в Kanban воронке с валидацией перехода и фиксацией в аудит-логе
 */
export function changeApplicationStatusInMemory(
  application: ApplicationRecord,
  targetStatus: ApplicationStatus,
  changedByUserId: string,
  note?: string | null
): { success: true; application: ApplicationRecord } | { success: false; error: string } {
  // Валидация перехода через конечный автомат
  const validation = validateStatusTransition(application.status, targetStatus);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error || 'Недопустимый переход статуса',
    };
  }

  const historyEntry: ApplicationHistoryEntry = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    fromStatus: application.status,
    toStatus: targetStatus,
    changedByUserId,
    note: note || null,
    changedAt: new Date(),
  };

  const updatedApplication: ApplicationRecord = {
    ...application,
    status: targetStatus,
    employerFeedback: note || application.employerFeedback,
    history: [...application.history, historyEntry],
  };

  return {
    success: true,
    application: updatedApplication,
  };
}
