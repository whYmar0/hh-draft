'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('student@edu.hse.ru');
  const [password, setPassword] = React.useState('Password123');
  const [role, setRole] = React.useState<'STUDENT' | 'EMPLOYER'>('STUDENT');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError(null);
    setIsLoading(true);

    try {
      // Пытаемся авторизоваться через NextAuth в базе данных
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Если учетных данных нет в БД (например, пока база пустая или оффлайн),
        // сохраняем demo cookie для комфортного тестирования интерфейса
        if (typeof document !== 'undefined') {
          document.cookie = `unitalent_role=${role}; path=/`;
        }
        setError('Неверный email или пароль. Включен демонстрационный вход.');
        setTimeout(() => {
          if (role === 'STUDENT') {
            router.push('/student/profile');
          } else {
            router.push('/employer/profile');
          }
        }, 800);
        return;
      }

      // Успешный вход в БД
      if (typeof document !== 'undefined') {
        document.cookie = `unitalent_role=${role}; path=/`;
      }

      if (role === 'STUDENT') {
        router.push('/student/profile');
      } else {
        router.push('/employer/profile');
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6">
      <Card className="w-full max-w-md border-border/80 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600" />
        <CardHeader className="text-center pb-4 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mb-2 shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Вход в UniTalent
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Войдите в личный кабинет студента или работодателя
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Выбор роли для быстрого демо */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground block">
                Выберите тип учетной записи
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === 'STUDENT' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setRole('STUDENT');
                    setEmail('student@edu.hse.ru');
                  }}
                  className="text-xs"
                >
                  Студент / Выпускник
                </Button>
                <Button
                  type="button"
                  variant={role === 'EMPLOYER' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setRole('EMPLOYER');
                    setEmail('hr@fintech-labs.ru');
                  }}
                  className="text-xs"
                >
                  Работодатель
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email адрес
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9 h-10 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="password" className="font-semibold">
                  Пароль
                </Label>
                <span className="text-muted-foreground hover:underline cursor-pointer">
                  Забыли пароль?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9 h-10 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              id="loginSubmitBtn"
              type="button"
              onClick={handleSubmit}
              variant="gradient"
              className="w-full gap-2 mt-2 shadow-md shadow-indigo-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                'Авторизация...'
              ) : (
                <>
                  Войти в систему
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
          <p>
            Еще нет аккаунта?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
