'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  MapPin,
  GraduationCap,
  Award,
  Users2,
  Coins,
  Send,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

// Демо-данные вакансии
const DEMO_VACANCY = {
  id: '00000000-0000-0000-0000-000000000001',
  title: 'Стажер Backend-разработчик (Go / Highload)',
  companyName: 'Финтех Лабс',
  companyWebsite: 'https://fintech-labs.example.ru',
  companyVerified: true,
  description: `Мы ищем увлеченного студента старших курсов (3–4 курс бакалавриата или 1–2 курс магистратуры) для работы над распределенным транзакционным шлюзом нашей финтех-экосистемы.

### Что предстоит делать:
* Разрабатывать микросервисы на Go (Golang) с поддержкой протоколов gRPC и REST.
* Оптимизировать запросы к PostgreSQL, проектировать схемы шардирования и индексации.
* Реализовывать механизмы распределенного консенсуса и кэширования через Redis/KeyDB.
* Писать unit и integration тесты, покрывать критические сценарии в CI/CD.

### Что мы ценим в кандидатах:
* Отличную базу по алгоритмам и структурам данных (графы, деревья, хеш-таблицы).
* Понимание многопоточности и модели памяти (goroutines, channels, sync primitives).
* Опыт реализации курсовых или пет-проектов с открытым исходным кодом на GitHub.`,
  employmentType: 'Стажировка',
  locationType: 'Гибридный формат (2 дня офис в Москве, 3 дня удаленно)',
  city: 'Москва',
  salaryMin: 70000,
  salaryMax: 95000,
  isStipend: true,
  hasMentorship: true,
  minCourse: 3,
  minGpa: 3.5,
  targetMajors: ['Прикладная математика и информатика', 'Программная инженерия', 'Информатика и ВТ'],
  skills: ['Go', 'PostgreSQL', 'Docker', 'Алгоритмы и структуры данных', 'gRPC', 'Git'],
  testTaskDescription:
    'Реализовать in-memory кольцевой буфер (ring buffer) фиксированного размера с потокобезопасным интерфейсом чтения и записи (Read/Write) и покрыть unit-тестами.',
};

export default function VacancyDetailsPage() {
  const params = useParams();
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState(
    'Здравствуйте! Я студент 3-го курса ФКН ВШЭ (GPA 4.85). Заинтересован в стажировке в Fintech Labs, имею курсовой проект реализации Raft консенсуса на Go.'
  );
  const [testSubmissionUrl, setTestSubmissionUrl] = React.useState('https://github.com/alexey-smirnov-hse/test-task-buffer');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="container max-w-5xl py-8 px-4 sm:px-6">
      {/* Кнопка назад */}
      <div className="mb-6">
        <Link href="/vacancies">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Назад к каталогу вакансий
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основная колонка с описанием */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="honors">Оплачиваемая стажировка</Badge>
                <Badge variant="secondary">{DEMO_VACANCY.locationType}</Badge>
              </div>

              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {DEMO_VACANCY.title}
              </CardTitle>

              <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  {DEMO_VACANCY.companyName}
                  {DEMO_VACANCY.companyVerified && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {DEMO_VACANCY.city}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 border-t border-border/40 pt-6">
              {/* Описание */}
              <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {DEMO_VACANCY.description}
              </div>

              {/* Тестовое задание */}
              {DEMO_VACANCY.testTaskDescription && (
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    Тестовое задание для кандидатов:
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {DEMO_VACANCY.testTaskDescription}
                  </p>
                </div>
              )}

              {/* Навыки */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Требуемый технологический стек
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_VACANCY.skills.map((skill) => (
                    <Badge key={skill} variant="tech" className="text-xs py-1 px-2.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая колонка: Условия и отклик */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-20 border-border/80 shadow-md">
            <CardHeader className="pb-3 border-b border-border/40">
              <span className="text-xs text-muted-foreground">Размер стипендии:</span>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(DEMO_VACANCY.salaryMin)} – {formatCurrency(DEMO_VACANCY.salaryMax)}
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                <Coins className="h-3.5 w-3.5" />
                Оплачиваемый период обучения
              </span>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                    Минимальный курс:
                  </span>
                  <strong className="text-foreground">{DEMO_VACANCY.minCourse} курс</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    Минимальный GPA:
                  </span>
                  <strong className="text-foreground">{DEMO_VACANCY.minGpa} (по шкале 4.0)</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users2 className="h-3.5 w-3.5 text-emerald-500" />
                    Наставничество:
                  </span>
                  <strong className="text-emerald-600 dark:text-emerald-400">Senior Ментор</strong>
                </div>
              </div>

              {/* Форма или результат отклика */}
              {isSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-foreground">Отклик успешно отправлен!</h4>
                  <p className="text-xs text-muted-foreground">
                    Ваше академическое резюме передано рекрутеру в статусе <strong>«Новый»</strong>. Вы можете отслеживать статус в личном кабинете.
                  </p>
                  <Link href="/student/profile" className="inline-block pt-1">
                    <Button variant="outline" size="sm" className="text-xs">
                      В личный кабинет
                    </Button>
                  </Link>
                </div>
              ) : showApplyModal ? (
                <form onSubmit={handleApply} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="coverLetter" className="text-xs">
                      Сопроводительное письмо
                    </Label>
                    <Textarea
                      id="coverLetter"
                      rows={3}
                      className="text-xs"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="testUrl" className="text-xs">
                      Ссылка на решение тестового (GitHub)
                    </Label>
                    <Input
                      id="testUrl"
                      className="text-xs"
                      value={testSubmissionUrl}
                      onChange={(e) => setTestSubmissionUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApplyModal(false)}
                      className="w-1/2 text-xs"
                    >
                      Отмена
                    </Button>
                    <Button type="submit" variant="gradient" size="sm" className="w-1/2 text-xs gap-1">
                      <Send className="h-3.5 w-3.5" />
                      Отправить
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  onClick={() => setShowApplyModal(true)}
                  variant="gradient"
                  size="lg"
                  className="w-full gap-2 text-sm shadow-md shadow-indigo-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  Откликнуться на стажировку
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
