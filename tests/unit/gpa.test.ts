import { describe, it, expect } from 'vitest';
import { normalizeGpa, getGpaBadge, validateGpa } from '@/lib/gpa';

describe('GPA Normalization and Calculations', () => {
  describe('normalizeGpa', () => {
    it('correctly normalizes 5.0 scale to 4.0 scale', () => {
      expect(normalizeGpa(5.0, 'SCALE_5')).toBe(4.0);
      expect(normalizeGpa(4.0, 'SCALE_5')).toBe(3.2);
      expect(normalizeGpa(3.5, 'SCALE_5')).toBe(2.8);
      expect(normalizeGpa(0.0, 'SCALE_5')).toBe(0.0);
    });

    it('keeps 4.0 scale as-is', () => {
      expect(normalizeGpa(4.0, 'SCALE_4')).toBe(4.0);
      expect(normalizeGpa(3.5, 'SCALE_4')).toBe(3.5);
      expect(normalizeGpa(2.8, 'SCALE_4')).toBe(2.8);
    });

    it('rounds normalized GPA to 2 decimal places', () => {
      expect(normalizeGpa(4.7, 'SCALE_5')).toBe(3.76);
      expect(normalizeGpa(4.33, 'SCALE_5')).toBe(3.46);
    });
  });

  describe('validateGpa', () => {
    it('accepts valid GPA in 5.0 scale', () => {
      expect(validateGpa(4.5, 'SCALE_5').isValid).toBe(true);
      expect(validateGpa(5.0, 'SCALE_5').isValid).toBe(true);
      expect(validateGpa(2.0, 'SCALE_5').isValid).toBe(true);
    });

    it('rejects out of bounds GPA in 5.0 scale', () => {
      expect(validateGpa(5.1, 'SCALE_5').isValid).toBe(false);
      expect(validateGpa(-0.5, 'SCALE_5').isValid).toBe(false);
    });

    it('accepts valid GPA in 4.0 scale', () => {
      expect(validateGpa(3.8, 'SCALE_4').isValid).toBe(true);
      expect(validateGpa(4.0, 'SCALE_4').isValid).toBe(true);
      expect(validateGpa(1.0, 'SCALE_4').isValid).toBe(true);
    });

    it('rejects out of bounds GPA in 4.0 scale', () => {
      expect(validateGpa(4.2, 'SCALE_4').isValid).toBe(false);
      expect(validateGpa(-1.0, 'SCALE_4').isValid).toBe(false);
    });
  });

  describe('getGpaBadge', () => {
    it('returns HIGH_HONORS for normalized GPA >= 3.6', () => {
      expect(getGpaBadge(4.8, 'SCALE_5').tier).toBe('HIGH_HONORS');
      expect(getGpaBadge(3.8, 'SCALE_4').tier).toBe('HIGH_HONORS');
    });

    it('returns HONORS for normalized GPA between 3.2 and 3.59', () => {
      expect(getGpaBadge(4.2, 'SCALE_5').tier).toBe('HONORS');
      expect(getGpaBadge(3.3, 'SCALE_4').tier).toBe('HONORS');
    });

    it('returns STANDARD for normalized GPA < 3.2', () => {
      expect(getGpaBadge(3.5, 'SCALE_5').tier).toBe('STANDARD');
      expect(getGpaBadge(2.5, 'SCALE_4').tier).toBe('STANDARD');
    });
  });
});
