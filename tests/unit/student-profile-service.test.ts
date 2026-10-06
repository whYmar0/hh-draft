import { describe, it, expect } from 'vitest';
import {
  calculateProfileCompleteness,
  prepareStudentProfileData,
} from '@/server/services/student-profile-service';

describe('Student Profile Service', () => {
  describe('calculateProfileCompleteness', () => {
    it('returns 100% for a fully filled student profile', () => {
      const fullProfile = {
        firstName: 'Алексей',
        lastName: 'Смирнов',
        university: 'НИУ ВШЭ',
        fieldOfStudy: 'Программная инженерия',
        currentCourse: 3,
        graduationYear: 2026,
        gpa: 4.85,
        bio: 'Люблю алгоритмы и Go',
        githubUrl: 'https://github.com/alexey',
        skillsCount: 5,
        projectsCount: 2,
        achievementsCount: 1,
      };

      const result = calculateProfileCompleteness(fullProfile);
      expect(result.score).toBe(100);
      expect(result.missingFields).toHaveLength(0);
    });

    it('identifies missing critical fields and reduces completeness score', () => {
      const partialProfile = {
        firstName: 'Иван',
        lastName: 'Петров',
        university: 'МГТУ',
        fieldOfStudy: 'ИУ',
        currentCourse: 2,
        graduationYear: 2027,
        gpa: 0,
        bio: null,
        githubUrl: null,
        skillsCount: 0,
        projectsCount: 0,
        achievementsCount: 0,
      };

      const result = calculateProfileCompleteness(partialProfile);
      expect(result.score).toBeLessThan(60);
      expect(result.missingFields).toContain('gpa');
      expect(result.missingFields).toContain('githubUrl');
      expect(result.missingFields).toContain('projects');
      expect(result.missingFields).toContain('skills');
    });
  });

  describe('prepareStudentProfileData', () => {
    it('automatically calculates normalizedGpa when saving', () => {
      const input = {
        firstName: 'Мария',
        lastName: 'Сидорова',
        university: 'МГУ',
        fieldOfStudy: 'ВМК',
        degreeLevel: 'BACHELOR' as const,
        currentCourse: 4,
        graduationYear: 2026,
        gpa: 4.9,
        gpaScale: 'SCALE_5' as const,
        searchStatus: 'LOOKING_FOR_INTERNSHIP' as const,
      };

      const prepared = prepareStudentProfileData(input);
      expect(prepared.normalizedGpa).toBe(3.92);
      expect(prepared.gpa).toBe(4.9);
    });

    it('preserves normalizedGpa equal to gpa for SCALE_4', () => {
      const input = {
        firstName: 'Дмитрий',
        lastName: 'Ковалев',
        university: 'ИТМО',
        fieldOfStudy: 'Компьютерные технологии',
        degreeLevel: 'MASTER' as const,
        currentCourse: 1,
        graduationYear: 2026,
        gpa: 3.75,
        gpaScale: 'SCALE_4' as const,
        searchStatus: 'LOOKING_FOR_INTERNSHIP' as const,
      };

      const prepared = prepareStudentProfileData(input);
      expect(prepared.normalizedGpa).toBe(3.75);
    });
  });
});
