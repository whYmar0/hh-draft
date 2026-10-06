'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  KanbanBoard,
  KanbanApplicant,
} from '@/components/applications/kanban-board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApplicationStatus } from '@/server/services/application-state-machine';
import { changeApplicationStatusInMemory, ApplicationRecord } from '@/server/services/application-service';
import {
  ArrowLeft,
  Search,
  Filter,
  Users2,
  Briefcase,
  Sparkles,
} from 'lucide-react';

const INITIAL_DEMO_APPLICANTS: KanbanApplicant[] = [
  {
    id: 'app-001',
    candidateName: 'Алексей Смирнов',
    university: 'НИУ ВШЭ (ФКН)',
    fieldOfStudy: 'Программная инженерия',
    currentCourse: 3,
    normalizedGpa: 3.88,
    jobTitle: 'Стажер Backend (Go / Highload)',
    coverLetter: 'Специализируюсь на Go, реализовал Raft-консенсус в учебном проекте, ищу стажировку на 30 ч/нед.',
    testSubmissionUrl: 'https://github.com/alexey-smirnov-hse/test-task-buffer',
    status: 'SCREENING',
    appliedAt: '2026-10-06T09:30:00Z',
    employerFeedback: 'Резюме и средний балл (4.85) одобрены. Проверяем репозиторий тестового задания.',
  },
  {
    id: 'app-002',
    candidateName: 'Елена Васильева',
    university: 'МГТУ им. Баумана',
    fieldOfStudy: 'Информатика и ВТ',
    currentCourse: 4,
    normalizedGpa: 3.65,
    jobTitle: 'Стажер Frontend (React / TypeScript)',
    coverLetter: 'Большой интерес к фронтенду и Next.js. Готова решить тестовое задание в течение 48 часов.',
    testSubmissionUrl: null,
    status: 'NEW',
    appliedAt: '2026-10-06T10:15:00Z',
  },
  {
    id: 'app-003',
    candidateName: 'Максим Попов',
    university: 'МГУ им. Ломоносова',
    fieldOfStudy: 'ВМК',
    currentCourse: 2,
    normalizedGpa: 3.92,
    jobTitle: 'Стажер Backend (Go / Highload)',
    coverLetter: 'Увлекаюсь олимпиадным программированием, отличная база по C++ и алгоритмам, перехожу на Go.',
    testSubmissionUrl: null,
    status: 'NEW',
    appliedAt: '2026-10-06T11:00:00Z',
  },
  {
    id: 'app-004',
    candidateName: 'Дарья Новикова',
    university: 'ИТМО',
    fieldOfStudy: 'Программная инженерия',
    currentCourse: 3,
    normalizedGpa: 3.45,
    jobTitle: 'Стажер Frontend (React / TypeScript)',
    coverLetter: 'Опыт верстки адаптивных компонентов, pet-проект каталога с Tailwind CSS.',
    testSubmissionUrl: 'https://github.com/daria-itmo/frontend-task',
    status: 'TEST_TASK',
    appliedAt: '2026-10-05T14:20:00Z',
    employerFeedback: 'Тестовое задание отправлено на ревью техлиду фронтенда.',
  },
  {
    id: 'app-005',
    candidateName: 'Игорь Кузнецов',
    university: 'МФТИ',
    fieldOfStudy: 'ФПМИ',
    currentCourse: 3,
    normalizedGpa: 3.95,
    jobTitle: 'Стажер Backend (Go / Highload)',
    coverLetter: 'Призер ICPC, победитель хакатона. Отличные знания многопоточности и Linux.',
    testSubmissionUrl: 'https://github.com/igor-mipt/buffer-solution',
    status: 'INTERVIEW',
    appliedAt: '2026-10-04T12:00:00Z',
    employerFeedback: 'Техническое интервью назначено на 8 октября, 16:00 в Google Meet.',
  },
  {
    id: 'app-006',
    candidateName: 'Сергей Морозов',
    university: 'НИУ ВШЭ',
    fieldOfStudy: 'Бизнес-информатика',
    currentCourse: 1,
    normalizedGpa: 3.1,
    jobTitle: 'Стажер Backend (Go / Highload)',
    coverLetter: 'Хочу попробовать себя в разработке.',
    testSubmissionUrl: null,
    status: 'REJECTED',
    appliedAt: '2026-10-03T10:00:00Z',
    employerFeedback: 'Позиция требует минимум 3-го курса и углубленных знаний многопоточности.',
  },
];

export default function EmployerApplicationsPage() {
  const [applicants, setApplicants] = React.useState<KanbanApplicant[]>(INITIAL_DEMO_APPLICANTS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedJob, setSelectedJob] = React.useState<string>('ALL');

  const handleStatusChange = (
    applicantId: string,
    newStatus: ApplicationStatus,
    note?: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === applicantId) {
          return {
            ...app,
            status: newStatus,
            employerFeedback: note || app.employerFeedback,
          };
        }
        return app;
      })
    );
  };

  const filteredApplicants = React.useMemo(() => {
    return applicants.filter((app) => {
      if (selectedJob !== 'ALL' && app.jobTitle !== selectedJob) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const inName = app.candidateName.toLowerCase().includes(q);
        const inUniv = app.university.toLowerCase().includes(q);
        const inTitle = app.jobTitle.toLowerCase().includes(q);
        return inName || inUniv || inTitle;
      }
      return true;
    });
  }, [applicants, searchQuery, selectedJob]);

  return (
    <div className="container max-w-[1600px] py-8 px-4 sm:px-6">
      {/* Шапка страницы */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/employer/profile">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Кабинет компании
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Users2 className="h-7 w-7 text-indigo-600" />
            Воронка рассмотрения кандидатов (Kanban)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Управление этапами отбора студентов: от первичного академического скрининга до оффера с фиксацией обратной связи.
          </p>
        </div>

        {/* Быстрые фильтры */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или ВУЗу..."
              className="pl-8 h-9 text-xs w-48 sm:w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="flex h-9 rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="ALL">Все вакансии</option>
            <option value="Стажер Backend (Go / Highload)">Стажер Backend (Go)</option>
            <option value="Стажер Frontend (React / TypeScript)">Стажер Frontend (React)</option>
          </select>
        </div>
      </div>

      {/* Интерактивная доска Kanban */}
      <KanbanBoard
        applicants={filteredApplicants}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
