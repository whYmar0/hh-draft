import { describe, it, expect } from 'vitest';
import {
  filterCandidates,
  CandidateFilterCriteria,
} from '@/server/services/candidate-filter-service';

describe('Candidate Filter Service', () => {
  const sampleCandidates = [
    {
      id: 'student-1',
      firstName: 'Алексей',
      lastName: 'Смирнов',
      university: 'НИУ ВШЭ',
      fieldOfStudy: 'Программная инженерия',
      currentCourse: 3,
      normalizedGpa: 3.88,
      searchStatus: 'LOOKING_FOR_INTERNSHIP' as const,
      skills: ['Go', 'PostgreSQL', 'Docker', 'Raft'],
      hasProjects: true,
      hasAchievements: true,
    },
    {
      id: 'student-2',
      firstName: 'Елена',
      lastName: 'Васильева',
      university: 'МГТУ им. Н.Э. Баумана',
      fieldOfStudy: 'Информатика и ВТ',
      currentCourse: 4,
      normalizedGpa: 3.65,
      searchStatus: 'LOOKING_FOR_INTERNSHIP' as const,
      skills: ['Python', 'Django', 'PostgreSQL'],
      hasProjects: true,
      hasAchievements: false,
    },
    {
      id: 'student-3',
      firstName: 'Максим',
      lastName: 'Попов',
      university: 'МГУ им. М.В. Ломоносова',
      fieldOfStudy: 'ВМК',
      currentCourse: 2,
      normalizedGpa: 3.2,
      searchStatus: 'LOOKING_FOR_JOB' as const,
      skills: ['C++', 'Algorithms'],
      hasProjects: false,
      hasAchievements: true,
    },
  ];

  describe('filterCandidates', () => {
    it('filters by university substring', () => {
      const criteria: CandidateFilterCriteria = { university: 'ВШЭ' };
      const result = filterCandidates(sampleCandidates, criteria);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('student-1');
    });

    it('filters by minimum normalized GPA (e.g. >= 3.6)', () => {
      const criteria: CandidateFilterCriteria = { minNormalizedGpa: 3.6 };
      const result = filterCandidates(sampleCandidates, criteria);
      expect(result).toHaveLength(2);
      expect(result.map((s) => s.id)).toEqual(['student-1', 'student-2']);
    });

    it('filters by course range (minCourse: 3)', () => {
      const criteria: CandidateFilterCriteria = { minCourse: 3 };
      const result = filterCandidates(sampleCandidates, criteria);
      expect(result).toHaveLength(2);
      expect(result.map((s) => s.id)).toEqual(['student-1', 'student-2']);
    });

    it('filters by required skills', () => {
      const criteria: CandidateFilterCriteria = { skills: ['Go'] };
      const result = filterCandidates(sampleCandidates, criteria);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('student-1');
    });

    it('combines academic filters: GPA >= 3.5, course >= 3, has projects', () => {
      const criteria: CandidateFilterCriteria = {
        minNormalizedGpa: 3.5,
        minCourse: 3,
        hasProjects: true,
      };
      const result = filterCandidates(sampleCandidates, criteria);
      expect(result).toHaveLength(2);
    });
  });
});
