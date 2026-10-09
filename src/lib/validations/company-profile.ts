import { z } from 'zod';

export const companyProfileSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Название компании должно содержать не менее 2 символов')
    .max(100, 'Название компании слишком длинное'),
  website: z
    .string()
    .url('Введите корректный URL (например, https://example.com)')
    .optional()
    .or(z.literal('')),
  industry: z.string().max(100, 'Слишком длинное название индустрии').optional().or(z.literal('')),
  description: z.string().max(2000, 'Описание превышает 2000 символов').optional().or(z.literal('')),
  internshipProgramsDescription: z
    .string()
    .max(2000, 'Описание программ превышает 2000 символов')
    .optional()
    .or(z.literal('')),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
