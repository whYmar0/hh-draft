import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validations/auth';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    const validRegistration = {
      email: 'student@edu.hse.ru',
      password: 'Password123',
      confirmPassword: 'Password123',
      role: 'STUDENT',
    };

    it('accepts valid registration data', () => {
      const result = registerSchema.safeParse(validRegistration);
      expect(result.success).toBe(true);
    });

    it('rejects passwords shorter than 8 characters', () => {
      const invalid = { ...validRegistration, password: 'Pass1', confirmPassword: 'Pass1' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects password without number', () => {
      const invalid = { ...validRegistration, password: 'PasswordOnly', confirmPassword: 'PasswordOnly' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects password without uppercase letter', () => {
      const invalid = { ...validRegistration, password: 'password123', confirmPassword: 'password123' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects mismatched password and confirmation', () => {
      const invalid = { ...validRegistration, confirmPassword: 'DifferentPassword123' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('confirmPassword');
      }
    });

    it('rejects ADMIN role registration via public register form', () => {
      const invalid = { ...validRegistration, role: 'ADMIN' };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('accepts valid credentials', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'any-password',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password',
      });
      expect(result.success).toBe(false);
    });
  });
});
