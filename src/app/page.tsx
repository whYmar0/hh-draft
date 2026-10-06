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
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GpaBadge } from '@/components/student/gpa-badge';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-indigo-50/50 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background">
        <div className="container max-w-6xl px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/80 dark:bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Специализированная платформа студенческого рекрутинга
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Старт карьеры, где ценится твой{' '}
            <span className="academic-gradient-text">академический капитал</span>, а не опыт «от 3 лет»
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Показывайте высокий средний балл (GPA), курсовые проекты на GitHub и победы в олимпиадах. Компании отбирают студентов напрямую по факультетам и академическим метрикам.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/student/profile">
              <Button variant="gradient" size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 w-full sm:w-auto">
                <GraduationCap className="h-5 w-5" />
                Собрать академическое резюме
              </Button>
            </Link>
            <Link href="/vacancies">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Briefcase className="h-5 w-5" />
                Каталог стажировок
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Превью двух сущностей платформы: Студент и Вакансия */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            {/* Карточка-тизер студенческого профиля */}
            <Card className="border-indigo-500/20 shadow-lg relative overflow-hidden bg-card/80 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="academic">Академический профиль</Badge>
                  <GpaBadge gpa={4.85} scale="SCALE_5" />
                </div>
                <CardTitle className="text-lg mt-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    АС
                  </div>
                  Алексей Смирнов
                </CardTitle>
                <p className="text-xs text-muted-foreground">НИУ ВШЭ • ФКН • 3 курс (2026)</p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Go-Raft-KV (Распределенный консенсус)</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Медалист олимпиады «Я — профессионал»</span>
                </div>
                <div className="pt-2 flex gap-1.5 flex-wrap">
                  <Badge variant="tech">Go</Badge>
                  <Badge variant="tech">Raft</Badge>
                  <Badge variant="tech">Docker</Badge>
                  <Badge variant="tech">PostgreSQL</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Карточка-тизер вакансии с фильтрами */}
            <Card className="border-border/80 shadow-lg relative overflow-hidden bg-card/80 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="honors">Оплачиваемая стажировка</Badge>
                  <span className="font-semibold text-sm text-foreground">70 000 – 95 000 ₽</span>
                </div>
                <CardTitle className="text-lg mt-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  Финтех Лабс
                </CardTitle>
                <p className="text-xs text-muted-foreground">Стажер Backend-разработчик (Go / Highload)</p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-accent/40 border border-border/40 space-y-1">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                    Академические критерии компании:
                  </span>
                  <p className="text-muted-foreground">ВУЗ: ВШЭ, МГТУ, МГУ, ИТМО • Мин. курс: 3 • GPA: от 3.5 (4.0 шкала)</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Персональный Senior наставник • Гибкий график</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ключевые преимущества */}
      <section className="py-16 bg-card/50 border-t border-border/40">
        <div className="container max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Чем UniTalent отличается от обычных сайтов поиска работы
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Нормализованный GPA</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Единая нормализация 5.0 и 4.0 шкал. Ваш отличный академический балл становится конкурентным преимуществом при скрининге.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Код вместо «опыта работы»</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Рекрутеры видят ссылки на реальные курсовые репозитории GitHub, используемый стек и результаты семестровых проектов.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Прозрачная воронка Kanban</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Отслеживание статуса каждого отклика от подачи до тестового задания и интервью с обратной связью от наставника.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
