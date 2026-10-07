import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle2,
  Code2,
  Building2,
  Users,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-indigo-50/50 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background">
        <div className="container max-w-6xl px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Старт карьеры, где ценится твой{' '}
            <span className="academic-gradient-text">академический капитал</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Показывайте высокий средний балл (GPA), курсовые проекты на GitHub и победы в олимпиадах. Компании отбирают студентов напрямую по факультетам и академическим метрикам.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/student/profile"
              className={cn(
                buttonVariants({ variant: 'gradient', size: 'lg' }),
                'gap-2 shadow-lg shadow-indigo-500/20 w-full sm:w-auto'
              )}
            >
              <GraduationCap className="h-5 w-5" />
              Собрать академическое резюме
            </Link>
            <Link
              href="/vacancies"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'gap-2 w-full sm:w-auto'
              )}
            >
              <Briefcase className="h-5 w-5" />
              Каталог стажировок
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Превью двух сущностей платформы: Студент и Вакансия */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-3xl mx-auto items-stretch">
            {/* Карточка студента */}
            <Link
              href="/student/profile"
              className="group block rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md hover:bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    АС
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Алексей Смирнов
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      НИУ ВШЭ • ФКН • 3 курс
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-950/40 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <Award className="h-3.5 w-3.5" />
                  GPA 4.85
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant="tech">Go</Badge>
                  <Badge variant="tech">Raft</Badge>
                  <Badge variant="tech">Docker</Badge>
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                  Резюме
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            {/* Карточка вакансии */}
            <Link
              href="/vacancies"
              className="group block rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200 hover:border-indigo-500/40 hover:shadow-md hover:bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Финтех Лабс
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Стажер Go / Highload
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  70–95 тыс. ₽
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant="tech">Go</Badge>
                  <Badge variant="tech">Highload</Badge>
                  <Badge variant="tech">Docker</Badge>
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                  Вакансия
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
