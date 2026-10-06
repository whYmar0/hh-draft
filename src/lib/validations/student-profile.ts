import { z } from 'zod';

export const degreeLevelEnum = z.enum([
  'BACHELOR',
  'MASTER',
  'SPECIALIST',
  'POSTGRADUATE',
]);

export const gpaScaleEnum = z.enum(['SCALE_4', 'SCALE_5']);

export const studentSearchStatusEnum = z.enum([
  'LOOKING_FOR_INTERNSHIP',
  'LOOKING_FOR_JOB',
  'NOT_LOOKING',
]);

export const studentProfileSchema = z
  .object({
    firstName: z.string().min(1, 'Имя обязательно для заполнения').max(50),
    lastName: z.string().min(1, 'Фамилия обязательна для заполнения').max(50),
    phone: z.string().optional().nullable(),
    avatarUrl: z.string().url('Некорректная ссылка на аватар').optional().nullable(),
    university: z.string().min(2, 'Укажите наименование ВУЗа').max(150),
    faculty: z.string().max(100).optional().nullable(),
    fieldOfStudy: z.string().min(2, 'Укажите специальность / направление').max(150),
    degreeLevel: degreeLevelEnum.default('BACHELOR'),
    currentCourse: z
      .number()
      .int('Курс должен быть целым числом')
      .min(1, 'Минимальный курс — 1')
      .max(6, 'Максимальный курс — 6'),
    graduationYear: z
      .number()
      .int()
      .min(2000, 'Год выпуска не может быть ранее 2000 года')
      .max(2040, 'Укажите реалистичный год выпуска'),
    gpa: z.number().min(0, 'GPA не может быть отрицательным'),
    gpaScale: gpaScaleEnum.default('SCALE_5'),
    searchStatus: studentSearchStatusEnum.default('LOOKING_FOR_INTERNSHIP'),
    bio: z.string().max(2000).optional().nullable(),
    githubUrl: z
      .string()
      .url('Некорректная ссылка на GitHub')
      .optional()
      .nullable()
      .or(z.literal('')),
    portfolioUrl: z
      .string()
      .url('Некорректная ссылка на портфолио')
      .optional()
      .nullable()
      .or(z.literal('')),
    linkedinUrl: z
      .string()
      .url('Некорректная ссылка на LinkedIn')
      .optional()
      .nullable()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.gpaScale === 'SCALE_5') {
        return data.gpa <= 5.0;
      }
      return data.gpa <= 4.0;
    },
    {
      message: 'Значение GPA превышает максимальный балл для выбранной шкалы',
      path: ['gpa'],
    }
  );

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

export const academicAchievementSchema = z.object({
  type: z.enum([
    'OLYMPIAD',
    'PUBLICATION',
    'CONFERENCE',
    'HACKATHON',
    'SCHOLARSHIP',
    'HONOR',
  ]),
  title: z.string().min(2, 'Название достижения обязательно').max(200),
  description: z.string().max(1000).optional().nullable(),
  year: z.number().int().min(2015).max(new Date().getFullYear() + 1),
  verificationUrl: z.string().url('Некорректная ссылка на подтверждение').optional().nullable(),
});

export type AcademicAchievementInput = z.infer<typeof academicAchievementSchema>;

export const academicProjectSchema = z.object({
  title: z.string().min(2, 'Название проекта обязательно').max(150),
  description: z.string().min(10, 'Опишите суть и результаты проекта').max(3000),
  role: z.string().max(100).optional().nullable(),
  repoUrl: z.string().url('Некорректная ссылка на репозиторий').optional().nullable(),
  demoUrl: z.string().url('Некорректная ссылка на демо').optional().nullable(),
  technologies: z.array(z.string()).default([]),
});

export type AcademicProjectInput = z.infer<typeof academicProjectSchema>;
