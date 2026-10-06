'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ArrowLeft,
  Clock,
  Search,
  CheckCircle2,
  CalendarCheck,
  FileCode2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentApplicationCard } from '@/components/applications/student-application-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ApplicationStatus } from '@/server/services/application-state-machine';

// Демонстрационный список откликов студента (Алексей Смирнов)
const DEMO_STUDENT_APPLICATIONS = [
  {
    id: 'app-001',
    jobPosting: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Стажер Backend-разработчик (Go / Highload)',
      companyName: 'Финтех Лабс',
      employmentType: 'Стажировка',
      locationType: 'Гибрид',
      isStipend: true,
      salaryMin: 70000,
      salaryMax: 95000,
    },
    status: 'SCREENING' as ApplicationStatus,
    appliedAt: new Date('2026-10-06T09:30:00Z'),
    coverLetter:
      'Здравствуйте! Я студент 3-го курса ФКН ВШЭ (GPA 4.85). Заинтересован в стажировке в Fintech Labs, имею курсовой проект реализации Raft консенсуса на Go.',
    testSubmissionUrl: 'https://github.com/alexey-smirnov-hse/test-task-buffer',
    employerFeedback:
      'Резюме и средний балл (4.85) одобрены техлидом команды шлюзов. Проверяем репозиторий с решением кольцевого буфера.',
    history: [
      {
        id: 'h-1',
        fromStatus: 'NEW' as ApplicationStatus,
        toStatus: 'NEW' as ApplicationStatus,
        note: 'Подача отклика на вакансию с сопроводительным письмом',
        changedAt: new Date('2026-10-06T09:30:00Z'),
      },
      {
        id: 'h-2',
        fromStatus: 'NEW' as ApplicationStatus,
        toStatus: 'SCREENING' as ApplicationStatus,
        note: 'Академический скрининг успешно пройден: ВУЗ и GPA соответствуют требованиям',
        changedAt: new Date('2026-10-06T11:00:00Z'),
      },
    ],
  },
  {
    id: 'app-002',
    jobPosting: {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Младший исследователь ML / NLP (Стажировка)',
      companyName: 'Тинькофф Образование',
      employmentType: 'Стажировка',
      locationType: 'Гибрид',
      isStipend: true,
      salaryMin: 90000,
      salaryMax: 120000,
    },
    status: 'NEW' as ApplicationStatus,
    appliedAt: new Date('2026-10-05T16:00:00Z'),
    coverLetter: 'Хочу развивать алгоритмы дообучения LLM, имею публикацию в трудах ВШЭ.',
    testSubmissionUrl: null,
    employerFeedback: null,
    history: [
      {
        id: 'h-3',
        fromStatus: 'NEW' as ApplicationStatus,
        toStatus: 'NEW' as ApplicationStatus,
        note: 'Отклик отправлен на рассмотрение рекрутеру программы',
        changedAt: new Date('2026-10-05T16:00:00Z'),
      },
    ],
  },
];

export default function StudentApplicationsPage() {
  const [applications, setApplications] = React.useState(DEMO_STUDENT_APPLICATIONS);

  const stats = {
    total: applications.length,
    screening: applications.filter((a) => a.status === 'SCREENING').length,
    testTask: applications.filter((a) => a.status === 'TEST_TASK').length,
    interview: applications.filter((a) => a.status === 'INTERVIEW').length,
    offer: applications.filter((a) => a.status === 'OFFER').length,
  };

  return (
    <div className="container max-w-5xl py-8 px-4 sm:px-6">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link href="/student/profile">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground mb-1">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Мой профиль
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-indigo-600" />
            Мои отклики на стажировки
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Отслеживайте статус рассмотрения ваших академических заявок и обратную связь от работодателей в режиме реального времени.
          </p>
        </div>

        <Link href="/vacancies">
          <Button variant="gradient" size="sm">
            Каталог стажировок
          </Button>
        </Link>
      </div>

      {/* Метрики откликов */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center">
          <span className="text-xs text-muted-foreground block">Всего откликов</span>
          <span className="text-2xl font-bold text-foreground mt-0.5 block">{stats.total}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 text-center">
          <span className="text-xs text-indigo-700 dark:text-indigo-300 block">В скрининге</span>
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-0.5 block">
            {stats.screening}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-50/40 dark:bg-purple-950/20 text-center">
          <span className="text-xs text-purple-700 dark:text-purple-300 block">На интервью</span>
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-0.5 block">
            {stats.interview}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 block">Офферы</span>
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 block">
            {stats.offer}
          </span>
        </div>
      </div>

      {/* Список карточек откликов */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <StudentApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="У вас пока нет активных откликов"
          description="Перейдите в каталог вакансий, выберите подходящую программу стажировки и отправьте отклик с сопроводительным письмом."
          actionLabel="Перейти к вакансиям"
          onAction={() => window.location.assign('/vacancies')}
        />
      )}
    </div>
  );
}
