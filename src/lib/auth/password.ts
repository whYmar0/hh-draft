import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Хэширование пароля пользователя с солью
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Проверка введенного пароля против сохраненного хэша
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
