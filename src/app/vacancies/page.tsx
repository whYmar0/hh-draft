'use client';

import * as React from 'react';
import Link from 'next/link';
import { Briefcase, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { VacancyCard } from '@/components/vacancy/vacancy-card';
import { VacancyFilters } from '@/components/vacancy/vacancy-filters';
import { filterVacancies, VacancyFilterCriteria, VacancyItem } from '@/server/services/vacancy-filter-service';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

// Стартовый набор вакансий для интерактивной работы MVP
const INITIAL_VACANCIES: Array<VacancyItem & {
  companyName: string;
  companyVerified: boolean;
}> = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    companyName: 'Финтех Лабс',
    companyVerified: true,
    title: 'Стажер Backend-разработчик (Go / Highload)',
    description:
      'Ищем студента старших курсов с хорошей базой алгоритмов, знанием Go или желанием на него перейти. Предстоит разрабатывать отказоустойчивые сервисы с десятками тысяч RPS.',
    employmentType: 'INTERNSHIP',
    locationType: 'HYBRID',
    city: 'Москва',
    salaryMin: 70000,
    salaryMax: 95000,
    isStipend: true,
    hasMentorship: true,
    minCourse: 3,
    minGpa: 3.5,
    targetMajors: ['Прикладная математика и информатика', 'Программная инженерия', 'Информатика и ВТ'],
    skills: ['Go', 'PostgreSQL', 'Docker', 'Алгоритмы и структуры данных', 'gRPC'],
    createdAt: new Date('2026-10-01'),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    companyName: 'Финтех Лабс',
    companyVerified: true,
    title: 'Стажер Frontend-разработчик (React / Next.js / TypeScript)',
    description:
      'Приглашаем увлеченного фронтендера в продуктовую команду аналитических дашбордов. Менторство с первого дня, гибкий график под сессию, современный стек.',
    employmentType: 'PART_TIME',
    locationType: 'REMOTE',
    city: 'Москва / СПб',
    salaryMin: 60000,
    salaryMax: 85000,
    isStipend: true,
    hasMentorship: true,
    minCourse: 2,
    minGpa: 3.2,
    targetMajors: ['Программная инженерия', 'Фундаментальная информатика'],
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    createdAt: new Date('2026-10-03'),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    companyName: 'Тинькофф Образование',
    companyVerified: true,
    title: 'Младший исследователь ML / NLP (Стажировка)',
    description:
      'Исследования в области больших языковых моделей (LLM), дообучение и оценка качества ответов на русскоязычных бенчмарках. Требуется сильная математическая база.',
    employmentType: 'INTERNSHIP',
    locationType: 'HYBRID',
    city: 'Москва',
    salaryMin: 90000,
    salaryMax: 120000,
    isStipend: true,
    hasMentorship: true,
    minCourse: 3,
    minGpa: 3.7,
    targetMajors: ['Прикладная математика', 'ВМК', 'ФКН'],
    skills: ['Python', 'PyTorch', 'Transformers', 'Дискретная математика'],
    createdAt: new Date('2026-10-04'),
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    companyName: 'EdTech Инновации',
    companyVerified: false,
    title: 'Стажер QA Engineer / Тестировщик автоматизатор (Python)',
    description:
      'Обучение тест-дизайну и автоматизации тестирования web/API на Python и Pytest. Прекрасный старт для студентов 1–3 курсов технических факультетов.',
    employmentType: 'FLEXIBLE',
    locationType: 'REMOTE',
    city: 'Вся Россия',
    salaryMin: 45000,
    salaryMax: 65000,
    isStipend: true,
    hasMentorship: true,
    minCourse: 1,
    minGpa: 3.0,
    targetMajors: ['Любые технические специальности'],
    skills: ['Python', 'Pytest', 'Git', 'REST API'],
    createdAt: new Date('2026-10-05'),
  },
];

export default function VacanciesPage() {
  const [filters, setFilters] = React.useState<VacancyFilterCriteria>({});
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'newest' | 'salary'>('newest');

  // Фильтрация через наш проверенный сервис
  const filteredVacancies = React.useMemo(() => {
    let result = filterVacancies(INITIAL_VACANCIES, filters);

    if (sortBy === 'salary') {
      result = [...result].sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result as typeof INITIAL_VACANCIES;
  }, [filters, sortBy]);

  return (
    <div className="container max-w-7xl py-8 px-4 sm:px-6">
      {/* Шапка каталога */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-indigo-600" />
            Вакансии и студенческие стажировки
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Каталог проверенных позиций от работодателей с фильтрацией по курсу, успеваемости (GPA) и менторству.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Кнопка фильтров для мобильных */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры ({filteredVacancies.length})
          </Button>

          {/* Сортировка */}
          <div className="flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1 bg-card text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground hidden sm:inline">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer"
            >
              <option value="newest">Сначала новые</option>
              <option value="salary">По размеру стипендии</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Левая колонка: Фильтры (десктоп) */}
        <div className="hidden md:block md:col-span-1">
          <VacancyFilters
            filters={filters}
            onChange={setFilters}
            totalFound={filteredVacancies.length}
          />
        </div>

        {/* Мобильная панель фильтров */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1 mb-4">
            <VacancyFilters
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setMobileFilterOpen(false);
              }}
              totalFound={filteredVacancies.length}
            />
          </div>
        )}

        {/* Правая колонка: Список вакансий */}
        <div className="md:col-span-3 space-y-4">
          {filteredVacancies.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredVacancies.map((vac) => (
                <VacancyCard key={vac.id} vacancy={vac} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="Вакансий не найдено"
              description="Попробуйте смягчить академические фильтры (снизить требования к курсу или GPA) или сбросить поисковый запрос."
              actionLabel="Сбросить все фильтры"
              onAction={() => setFilters({})}
            />
          )}
        </div>
      </div>
    </div>
  );
}
