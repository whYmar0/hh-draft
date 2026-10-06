'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  Award,
  Search,
  Filter,
  Users,
  Code2,
  ExternalLink,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { GpaBadge } from '@/components/student/gpa-badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  filterCandidates,
  CandidateFilterCriteria,
  CandidateItem,
} from '@/server/services/candidate-filter-service';

// Стартовый пул студентов для демонстрации академического поиска
const DEMO_CANDIDATES: CandidateItem[] = [
  {
    id: 'demo-student-id-1',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    university: 'НИУ ВШЭ (ФКН)',
    fieldOfStudy: 'Программная инженерия',
    currentCourse: 3,
    normalizedGpa: 3.88,
    searchStatus: 'LOOKING_FOR_INTERNSHIP',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Raft', 'gRPC', 'Алгоритмы'],
    hasProjects: true,
    hasAchievements: true,
  },
  {
    id: 'demo-student-id-2',
    firstName: 'Елена',
    lastName: 'Васильева',
    university: 'МГТУ им. Н.Э. Баумана (ИУ)',
    fieldOfStudy: 'Информатика и вычислительная техника',
    currentCourse: 4,
    normalizedGpa: 3.65,
    searchStatus: 'LOOKING_FOR_INTERNSHIP',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    hasProjects: true,
    hasAchievements: false,
  },
  {
    id: 'demo-student-id-3',
    firstName: 'Максим',
    lastName: 'Попов',
    university: 'МГУ им. М.В. Ломоносова (ВМК)',
    fieldOfStudy: 'Прикладная математика и информатика',
    currentCourse: 2,
    normalizedGpa: 3.92,
    searchStatus: 'LOOKING_FOR_JOB',
    skills: ['C++', 'Python', 'Алгоритмы и структуры данных', 'PyTorch'],
    hasProjects: true,
    hasAchievements: true,
  },
  {
    id: 'demo-student-id-4',
    firstName: 'Дарья',
    lastName: 'Новикова',
    university: 'ИТМО',
    fieldOfStudy: 'Информационные системы и технологии',
    currentCourse: 3,
    normalizedGpa: 3.45,
    searchStatus: 'LOOKING_FOR_INTERNSHIP',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    hasProjects: true,
    hasAchievements: false,
  },
];

export default function EmployerCandidatesSearchPage() {
  const [filters, setFilters] = React.useState<CandidateFilterCriteria>({});
  const [skillsInput, setSkillsInput] = React.useState('');

  const handleSkillsChange = (val: string) => {
    setSkillsInput(val);
    const parsed = val
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setFilters((prev) => ({ ...prev, skills: parsed.length > 0 ? parsed : undefined }));
  };

  const filteredStudents = React.useMemo(() => {
    return filterCandidates(DEMO_CANDIDATES, filters);
  }, [filters]);

  const handleReset = () => {
    setFilters({});
    setSkillsInput('');
  };

  return (
    <div className="container max-w-7xl py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Users className="h-7 w-7 text-indigo-600" />
            Академический поиск талантов
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Прямой отбор студентов по ВУЗам, факультетам, среднему баллу (GPA) и практическим проектам.
          </p>
        </div>

        <Link href="/employer/profile">
          <Button variant="outline" size="sm">
            Кабинет компании
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Фильтры кандидатов */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border-border/80 shadow-sm sticky top-20">
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4 text-indigo-500" />
                  Критерии отбора
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2 text-xs">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Сброс
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Найдено студентов: <strong className="text-foreground">{filteredStudents.length}</strong>
              </p>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              {/* ВУЗ */}
              <div className="space-y-1.5">
                <Label htmlFor="univFilter" className="text-xs font-semibold">
                  ВУЗ (название / аббревиатура)
                </Label>
                <Input
                  id="univFilter"
                  placeholder="ВШЭ, МГТУ, МГУ, ИТМО..."
                  className="h-8 text-xs"
                  value={filters.university || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      university: e.target.value || undefined,
                    }))
                  }
                />
              </div>

              {/* Минимальный средний балл (GPA) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Минимальный балл (GPA 4.0 шкала)
                </Label>
                <select
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                  value={filters.minNormalizedGpa || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minNormalizedGpa: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                >
                  <option value="">Любая успеваемость</option>
                  <option value="3.8">GPA от 3.8 (Отличники / Топ курса)</option>
                  <option value="3.5">GPA от 3.5 (Высокая успеваемость)</option>
                  <option value="3.2">GPA от 3.2 (Базовый отбор)</option>
                </select>
              </div>

              {/* Курс */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  Минимальный курс
                </Label>
                <select
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                  value={filters.minCourse || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minCourse: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                >
                  <option value="">Любой курс</option>
                  <option value="2">От 2 курса</option>
                  <option value="3">От 3 курса</option>
                  <option value="4">Выпускной 4 курс</option>
                </select>
              </div>

              {/* Стек технологий */}
              <div className="space-y-1.5">
                <Label htmlFor="skillsFilter" className="text-xs font-semibold">
                  Стек навыков (через запятую)
                </Label>
                <Input
                  id="skillsFilter"
                  placeholder="Go, Python, Docker..."
                  className="h-8 text-xs"
                  value={skillsInput}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                />
              </div>

              {/* Чекбоксы сигналов */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-accent">
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                    checked={filters.hasProjects === true}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasProjects: e.target.checked ? true : undefined,
                      }))
                    }
                  />
                  <span>С проектами на GitHub</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-accent">
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                    checked={filters.hasAchievements === true}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasAchievements: e.target.checked ? true : undefined,
                      }))
                    }
                  />
                  <span>С олимпиадами / статьями</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Список кандидатов */}
        <div className="md:col-span-3 space-y-4">
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="border-border/80 hover:border-indigo-500/50 hover:shadow-md transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-base shadow-sm">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                            {student.firstName} {student.lastName}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            {student.university} • {student.fieldOfStudy}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <GpaBadge gpa={student.normalizedGpa} scale="SCALE_4" />
                        <Badge variant="secondary" className="text-xs">
                          {student.currentCourse} курс
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.map((skill) => (
                        <Badge key={skill} variant="tech">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground pt-1 border-t border-border/40">
                      {student.hasProjects && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Code2 className="h-3.5 w-3.5" />
                          Курсовые репозитории на GitHub
                        </span>
                      )}
                      {student.hasAchievements && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <Award className="h-3.5 w-3.5" />
                          Олимпиады / Публикации
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <Badge variant="honors" className="text-[11px]">
                      {student.searchStatus === 'LOOKING_FOR_INTERNSHIP'
                        ? 'Ищет стажировку'
                        : 'Ищет работу'}
                    </Badge>

                    <Link href="/student/profile">
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        Академическое резюме
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Студенты не найдены"
              description="Попробуйте изменить название ВУЗа, снизить планку GPA или убрать специфические навыки из фильтра."
              actionLabel="Сбросить критерии"
              onAction={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
