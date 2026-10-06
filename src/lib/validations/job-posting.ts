import { z } from 'zod';

export const employmentTypeEnum = z.enum([
  'INTERNSHIP',
  'PART_TIME',
  'FULL_TIME',
  'FLEXIBLE',
]);

export const locationTypeEnum = z.enum(['REMOTE', 'HYBRID', 'ONSITE']);

export const jobStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'CLOSED']);

export const jobPostingSchema = z
  .object({
    title: z.string().min(3, 'Название вакансии должно содержать от 3 символов').max(150),
    description: z.string().min(20, 'Описание вакансии должно быть более подробным').max(10000),
    employmentType: employmentTypeEnum.default('INTERNSHIP'),
    locationType: locationTypeEnum.default('HYBRID'),
    city: z.string().max(100).optional().nullable(),
    salaryMin: z.number().int().min(0).optional().nullable(),
    salaryMax: z.number().int().min(0).optional().nullable(),
    currency: z.string().default('RUB'),
    isStipend: z.boolean().default(true),
    hasMentorship: z.boolean().default(true),
    testTaskDescription: z.string().max(5000).optional().nullable(),
    targetMajors: z.array(z.string()).default([]),
    minCourse: z.number().int().min(1, 'Минимальный курс — 1').max(6, 'Максимальный курс — 6').default(1),
    minGpa: z.number().min(0).max(4.0).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMin <= data.salaryMax;
      }
      return true;
    },
    {
      message: 'Минимальный уровень оплаты не может превышать максимальный',
      path: ['salaryMin'],
    }
  );

export type JobPostingInput = z.infer<typeof jobPostingSchema>;
