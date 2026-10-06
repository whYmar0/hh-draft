import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '@/lib/auth/password';

describe('Password Utilities', () => {
  it('hashes password and verifies successfully with correct password', async () => {
    const raw = 'SecureP@ss123';
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith('$2')).toBe(true);

    const isMatch = await comparePassword(raw, hash);
    expect(isMatch).toBe(true);
  });

  it('fails verification with incorrect password', async () => {
    const raw = 'SecureP@ss123';
    const hash = await hashPassword(raw);

    const isMatch = await comparePassword('WrongPassword', hash);
    expect(isMatch).toBe(false);
  });
});
