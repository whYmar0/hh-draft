import { describe, it, expect } from 'vitest';
import {
  isValidStatusTransition,
  getNextAllowedStatuses,
  validateStatusTransition,
} from '@/server/services/application-state-machine';

describe('Application Kanban State Machine', () => {
  describe('isValidStatusTransition', () => {
    it('allows valid transitions from NEW', () => {
      expect(isValidStatusTransition('NEW', 'SCREENING')).toBe(true);
      expect(isValidStatusTransition('NEW', 'REJECTED')).toBe(true);
    });

    it('disallows direct jumping from NEW to OFFER or INTERVIEW', () => {
      expect(isValidStatusTransition('NEW', 'OFFER')).toBe(false);
      expect(isValidStatusTransition('NEW', 'INTERVIEW')).toBe(false);
    });

    it('allows valid transitions from SCREENING', () => {
      expect(isValidStatusTransition('SCREENING', 'TEST_TASK')).toBe(true);
      expect(isValidStatusTransition('SCREENING', 'INTERVIEW')).toBe(true);
      expect(isValidStatusTransition('SCREENING', 'REJECTED')).toBe(true);
    });

    it('allows valid transitions from TEST_TASK', () => {
      expect(isValidStatusTransition('TEST_TASK', 'INTERVIEW')).toBe(true);
      expect(isValidStatusTransition('TEST_TASK', 'REJECTED')).toBe(true);
    });

    it('allows valid transitions from INTERVIEW', () => {
      expect(isValidStatusTransition('INTERVIEW', 'OFFER')).toBe(true);
      expect(isValidStatusTransition('INTERVIEW', 'REJECTED')).toBe(true);
    });

    it('disallows transitions from terminal status REJECTED for standard users', () => {
      expect(isValidStatusTransition('REJECTED', 'OFFER')).toBe(false);
      expect(isValidStatusTransition('REJECTED', 'INTERVIEW')).toBe(false);
      expect(isValidStatusTransition('REJECTED', 'TEST_TASK')).toBe(false);
    });

    it('disallows transitions from terminal status OFFER', () => {
      expect(isValidStatusTransition('OFFER', 'TEST_TASK')).toBe(false);
      expect(isValidStatusTransition('OFFER', 'NEW')).toBe(false);
    });
  });

  describe('getNextAllowedStatuses', () => {
    it('returns correct next states for NEW', () => {
      const allowed = getNextAllowedStatuses('NEW');
      expect(allowed).toEqual(['SCREENING', 'REJECTED']);
    });

    it('returns empty array for OFFER', () => {
      const allowed = getNextAllowedStatuses('OFFER');
      expect(allowed).toEqual([]);
    });
  });

  describe('validateStatusTransition helper', () => {
    it('throws or returns error message on illegal transition', () => {
      const result = validateStatusTransition('NEW', 'OFFER');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns valid on legal transition', () => {
      const result = validateStatusTransition('NEW', 'SCREENING');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
