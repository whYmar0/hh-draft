import { z } from 'zod';

export const userRoleEnum = z.enum(['STUDENT', 'EMPLOYER', 'ADMIN']);

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email обязателен для заполнения')
      .email('Введите корректный адрес электронной почты')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, 'Пароль должен содержать не менее 8 символов')
      .regex(/[A-ZА-Я]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
    confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно'),
    role: z.enum(['STUDENT', 'EMPLOYER'], {
      errorMap: () => ({ message: 'Выберите роль: Студент или Работодатель' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Введите корректный email')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Пароль обязателен'),
});

export type LoginInput = z.infer<typeof loginSchema>;
