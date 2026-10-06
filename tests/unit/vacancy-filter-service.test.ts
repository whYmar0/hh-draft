import { describe, it, expect } from 'vitest';
import {
  filterVacancies,
  isStudentEligibleForJob,
  VacancyFilterCriteria,
} from '@/server/services/vacancy-filter-service';

describe('Vacancy Filter Service', () => {
  const sampleVacancies = [
    {
      id: 'job-1',
      title: 'Стажер Backend Go',
      description: 'Разработка высоконагруженных сервисов',
      employmentType: 'INTERNSHIP' as const,
      locationType: 'HYBRID' as const,
      city: 'Москва',
      salaryMin: 70000,
      salaryMax: 95000,
      isStipend: true,
      hasMentorship: true,
      minCourse: 3,
      minGpa: 3.5, // 4.0 scale
      targetMajors: ['Программная инженерия', 'ПМИ'],
      skills: ['Go', 'PostgreSQL', 'Docker'],
      createdAt: new Date('2026-10-01'),
    },
    {
      id: 'job-2',
      title: 'Junior Frontend React',
      description: 'Создание адаптивных интерфейсов',
      employmentType: 'PART_TIME' as const,
      locationType: 'REMOTE' as const,
      city: 'Москва',
      salaryMin: 60000,
      salaryMax: 80000,
      isStipend: true,
      hasMentorship: true,
      minCourse: 2,
      minGpa: 3.0,
      targetMajors: ['Информатика и ВТ', 'Программная инженерия'],
      skills: ['React', 'TypeScript'],
      createdAt: new Date('2026-10-02'),
    },
    {
      id: 'job-3',
      title: 'Исследователь ML / Data Science',
      description: 'Исследования в области NLP и LLM',
      employmentType: 'INTERNSHIP' as const,
      locationType: 'ONSITE' as const,
      city: 'Санкт-Петербург',
      salaryMin: 100000,
      salaryMax: 130000,
      isStipend: true,
      hasMentorship: false,
      minCourse: 4,
      minGpa: 3.8, // Строгий фильтр по GPA
      targetMajors: ['ПМИ', 'Математика'],
      skills: ['Python', 'PyTorch'],
      createdAt: new Date('2026-10-03'),
    },
  ];

  describe('isStudentEligibleForJob', () => {
    it('returns true when student exceeds both minCourse and minGpa', () => {
      const student = { currentCourse: 3, normalizedGpa: 3.8 };
      expect(isStudentEligibleForJob(student, sampleVacancies[0])).toBe(true);
    });

    it('returns false when student course is lower than minCourse', () => {
      const student = { currentCourse: 2, normalizedGpa: 3.9 };
      expect(isStudentEligibleForJob(student, sampleVacancies[0])).toBe(false);
    });

    it('returns false when student GPA is below minGpa requirement', () => {
      const student = { currentCourse: 4, normalizedGpa: 3.4 };
      expect(isStudentEligibleForJob(student, sampleVacancies[0])).toBe(false);
    });
  });

  describe('filterVacancies', () => {
    it('filters by query string across title and description', () => {
      const criteria: VacancyFilterCriteria = { query: 'Go' };
      const result = filterVacancies(sampleVacancies, criteria);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('job-1');
    });

    it('filters by mentorship flag', () => {
      const criteria: VacancyFilterCriteria = { hasMentorship: true };
      const result = filterVacancies(sampleVacancies, criteria);
      expect(result).toHaveLength(2);
      expect(result.map((j) => j.id)).toEqual(['job-1', 'job-2']);
    });

    it('filters by location type', () => {
      const criteria: VacancyFilterCriteria = { locationType: 'REMOTE' };
      const result = filterVacancies(sampleVacancies, criteria);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('job-2');
    });

    it('filters by student eligibility (student profile filter)', () => {
      // Студент 2 курса с GPA 3.2 может претендовать только на job-2
      const criteria: VacancyFilterCriteria = {
        studentCourse: 2,
        studentNormalizedGpa: 3.2,
      };
      const result = filterVacancies(sampleVacancies, criteria);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('job-2');
    });
  });
});
