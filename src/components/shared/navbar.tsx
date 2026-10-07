'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Briefcase, User, Sparkles, Menu, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/vacancies', label: 'Вакансии и стажировки', icon: Briefcase },
    { href: '/student/profile', label: 'Кабинет студента', icon: GraduationCap },
    { href: '/employer/profile', label: 'Для компаний', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg leading-tight">
              UniTalent
            </span>
          </div>
        </Link>

        {/* Навигационные ссылки (десктоп) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Правые контролы */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
              Войти
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: 'gradient', size: 'sm' }), 'gap-1.5')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Регистрация
            </Link>
          </div>

          {/* Мобильная кнопка меню */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-lg px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full justify-center')}
            >
              Войти
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(buttonVariants({ variant: 'gradient', size: 'sm' }), 'w-full justify-center gap-1.5')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Регистрация
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
