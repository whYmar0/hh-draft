import { describe, it, expect } from 'vitest';
import {
  changeApplicationStatusInMemory,
  createApplicationInMemory,
  ApplicationRecord,
} from '@/server/services/application-service';

describe('Job Application Service & Tracker', () => {
  const mockInitialApp: ApplicationRecord = {
    id: 'app-1',
    jobPostingId: 'job-1',
    studentProfileId: 'student-1',
    coverLetter: 'Здравствуйте, готов пройти стажировку!',
    status: 'NEW',
    testSubmissionUrl: null,
    employerFeedback: null,
    appliedAt: new Date('2026-10-06T10:00:00Z'),
    history: [],
  };

  describe('createApplicationInMemory', () => {
    it('creates an application with status NEW and initial history log', () => {
      const created = createApplicationInMemory({
        jobPostingId: 'job-2',
        studentProfileId: 'student-2',
        coverLetter: 'Привет!',
        testSubmissionUrl: 'https://github.com/test',
      });

      expect(created.status).toBe('NEW');
      expect(created.history).toHaveLength(1);
      expect(created.history[0].toStatus).toBe('NEW');
      expect(created.coverLetter).toBe('Привет!');
    });
  });

  describe('changeApplicationStatusInMemory', () => {
    it('successfully transitions from NEW to SCREENING and appends to audit history', () => {
      const result = changeApplicationStatusInMemory(
        mockInitialApp,
        'SCREENING',
        'emp-user-1',
        'Резюме и GPA соответствуют требованиям'
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.application.status).toBe('SCREENING');
        expect(result.application.history).toHaveLength(1);
        expect(result.application.history[0].fromStatus).toBe('NEW');
        expect(result.application.history[0].toStatus).toBe('SCREENING');
        expect(result.application.history[0].note).toBe('Резюме и GPA соответствуют требованиям');
      }
    });

    it('rejects illegal transition from NEW directly to OFFER', () => {
      const result = changeApplicationStatusInMemory(
        mockInitialApp,
        'OFFER',
        'emp-user-1',
        'Сразу оффер'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Недопустимый переход');
      }
    });

    it('records employer feedback when transitioning to TEST_TASK', () => {
      const screeningApp: ApplicationRecord = {
        ...mockInitialApp,
        status: 'SCREENING',
      };

      const result = changeApplicationStatusInMemory(
        screeningApp,
        'TEST_TASK',
        'emp-user-1',
        'Отправлено тестовое задание на Go'
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.application.status).toBe('TEST_TASK');
        expect(result.application.employerFeedback).toBe('Отправлено тестовое задание на Go');
      }
    });

    it('allows rejecting a candidate from SCREENING stage', () => {
      const screeningApp: ApplicationRecord = {
        ...mockInitialApp,
        status: 'SCREENING',
      };

      const result = changeApplicationStatusInMemory(
        screeningApp,
        'REJECTED',
        'emp-user-1',
        'К сожалению, мы выбрали кандидата с большим опытом в многопоточности'
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.application.status).toBe('REJECTED');
      }
    });
  });
});
