'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GraduationCap, Lock, Mail, ArrowRight, Building2, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<'STUDENT' | 'EMPLOYER'>('STUDENT');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов');
      return;
    }

    if (!/[A-ZА-Я]/.test(password)) {
      setError('Пароль должен содержать хотя бы одну заглавную букву');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      return;
    }

    if (password !== confirmPassword) {
      setError('Введенные пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Создаем пользователя в БД через API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      // 2. Автоматически авторизуем через NextAuth с прямым переходом в профиль
      const targetUrl = role === 'STUDENT' ? '/student/profile' : '/employer/profile';
      
      if (typeof document !== 'undefined') {
        document.cookie = `unitalent_role=${role}; path=/`;
      }

      await signIn('credentials', {
        email,
        password,
        callbackUrl: targetUrl,
      });
    } catch (err: any) {
      setError(err?.message || 'Не удалось завершить регистрацию');
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6">
      <Card className="w-full max-w-md border-border/80 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600" />
        <CardHeader className="text-center pb-4 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-2 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Регистрация в UniTalent
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Создайте аккаунт для старта карьеры или поиска стажеров
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Выбор роли */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground block">
                Кем вы регистрируетесь?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === 'STUDENT' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRole('STUDENT')}
                  className="text-xs gap-1.5"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Студент ВУЗа
                </Button>
                <Button
                  type="button"
                  variant={role === 'EMPLOYER' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRole('EMPLOYER')}
                  className="text-xs gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Работодатель
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regEmail" className="text-xs font-semibold">
                Email адрес
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="regEmail"
                  type="email"
                  placeholder={role === 'STUDENT' ? 'student@edu.hse.ru' : 'hr@company.ru'}
                  className="pl-9 h-10 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regPass" className="text-xs font-semibold">
                Пароль (от 8 символов)
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="regPass"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regPassConfirm" className="text-xs font-semibold">
                Подтверждение пароля
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="regPassConfirm"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full gap-2 mt-2 shadow-md shadow-indigo-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                'Регистрация...'
              ) : (
                <>
                  Создать аккаунт
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
          <p>
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Войти в систему
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
