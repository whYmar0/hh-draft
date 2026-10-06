import { describe, it, expect } from 'vitest';
import { studentProfileSchema } from '@/lib/validations/student-profile';
import { jobPostingSchema } from '@/lib/validations/job-posting';
import { jobApplicationSchema } from '@/lib/validations/job-application';

describe('Zod Validation Schemas', () => {
  describe('studentProfileSchema', () => {
    const validProfile = {
      firstName: 'Иван',
      lastName: 'Иванов',
      university: 'НИУ ВШЭ',
      faculty: 'ФКН',
      fieldOfStudy: 'Программная инженерия',
      degreeLevel: 'BACHELOR',
      currentCourse: 3,
      graduationYear: 2026,
      gpa: 4.8,
      gpaScale: 'SCALE_5',
      searchStatus: 'LOOKING_FOR_INTERNSHIP',
      githubUrl: 'https://github.com/ivanov',
    };

    it('validates a correct student profile', () => {
      const result = studentProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('rejects invalid currentCourse (< 1 or > 6)', () => {
      const invalid = { ...validProfile, currentCourse: 0 };
      expect(studentProfileSchema.safeParse(invalid).success).toBe(false);

      const invalidCourseHigh = { ...validProfile, currentCourse: 7 };
      expect(studentProfileSchema.safeParse(invalidCourseHigh).success).toBe(false);
    });

    it('rejects invalid graduationYear', () => {
      const invalid = { ...validProfile, graduationYear: 1990 };
      expect(studentProfileSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects GPA exceeding 5.0 for SCALE_5', () => {
      const invalid = { ...validProfile, gpa: 5.5, gpaScale: 'SCALE_5' };
      expect(studentProfileSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects GPA exceeding 4.0 for SCALE_4', () => {
      const invalid = { ...validProfile, gpa: 4.2, gpaScale: 'SCALE_4' };
      expect(studentProfileSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('jobPostingSchema', () => {
    const validJob = {
      title: 'Стажер Backend-разработчик (Go/Python)',
      description: 'Ищем студента старших курсов для разработки высоконагруженного сервиса.',
      employmentType: 'INTERNSHIP',
      locationType: 'HYBRID',
      city: 'Москва',
      salaryMin: 50000,
      salaryMax: 80000,
      currency: 'RUB',
      isStipend: true,
      hasMentorship: true,
      minCourse: 2,
      minGpa: 3.5,
      targetMajors: ['Программная инженерия', 'Информатика и ВТ'],
    };

    it('validates a correct job posting', () => {
      const result = jobPostingSchema.safeParse(validJob);
      expect(result.success).toBe(true);
    });

    it('rejects when salaryMin > salaryMax', () => {
      const invalid = { ...validJob, salaryMin: 90000, salaryMax: 50000 };
      expect(jobPostingSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects invalid minCourse', () => {
      const invalid = { ...validJob, minCourse: 7 };
      expect(jobPostingSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('jobApplicationSchema', () => {
    it('validates a valid job application', () => {
      const valid = {
        jobPostingId: '123e4567-e89b-12d3-a456-426614174000',
        coverLetter: 'Здравствуйте! Я студент 3 курса, изучил ваши требования и хочу пройти стажировку.',
      };
      expect(jobApplicationSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects empty jobPostingId', () => {
      const invalid = {
        jobPostingId: '',
        coverLetter: 'Привет',
      };
      expect(jobApplicationSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
