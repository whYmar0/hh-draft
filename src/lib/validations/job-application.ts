import { z } from 'zod';

export const applicationStatusEnum = z.enum([
  'NEW',
  'SCREENING',
  'TEST_TASK',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
]);

export const jobApplicationSchema = z.object({
  jobPostingId: z.string().min(1, 'Идентификатор вакансии обязателен'),
  coverLetter: z.string().max(3000, 'Сопроводительное письмо не должно превышать 3000 символов').optional().nullable(),
  testSubmissionUrl: z.string().url('Укажите корректный URL решения тестового задания').optional().nullable().or(z.literal('')),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;

export const changeApplicationStatusSchema = z.object({
  applicationId: z.string().min(1, 'Идентификатор отклика обязателен'),
  targetStatus: applicationStatusEnum,
  feedback: z.string().max(2000).optional().nullable(),
});

export type ChangeApplicationStatusInput = z.infer<typeof changeApplicationStatusSchema>;
