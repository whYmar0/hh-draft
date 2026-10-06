'use client';

import * as React from 'react';
import { Search, Filter, RotateCcw, Award, GraduationCap, Users, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { VacancyFilterCriteria } from '@/server/services/vacancy-filter-service';

export interface VacancyFiltersProps {
  filters: VacancyFilterCriteria;
  onChange: (newFilters: VacancyFilterCriteria) => void;
  totalFound: number;
}

export function VacancyFilters({ filters, onChange, totalFound }: VacancyFiltersProps) {
  const updateFilter = (key: keyof VacancyFilterCriteria, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handleReset = () => {
    onChange({});
  };

  return (
    <Card className="sticky top-20 border-border/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-500" />
            Фильтры вакансий
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Сброс
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Найдено предложений: <strong className="text-foreground">{totalFound}</strong>
        </p>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Поисковая строка */}
        <div className="space-y-1.5">
          <Label htmlFor="searchQuery" className="text-xs font-semibold">
            Поиск по ключевым словам
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchQuery"
              placeholder="Go, React, Highload..."
              className="pl-9 h-9 text-xs"
              value={filters.query || ''}
              onChange={(e) => updateFilter('query', e.target.value)}
            />
          </div>
        </div>

        {/* Формат стажировки и занятости */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold block">Формат работы</Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'INTERNSHIP', label: 'Стажировка' },
              { id: 'PART_TIME', label: 'Part-time' },
              { id: 'FULL_TIME', label: 'Full-time' },
              { id: 'FLEXIBLE', label: 'Гибкий график' },
            ].map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent cursor-pointer"
              >
                <input
                  type="radio"
                  name="employmentType"
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                  checked={filters.employmentType === type.id}
                  onChange={() =>
                    updateFilter(
                      'employmentType',
                      filters.employmentType === type.id ? undefined : type.id
                    )
                  }
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Локация */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold block flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Локация
          </Label>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {[
              { id: 'REMOTE', label: 'Удаленно' },
              { id: 'HYBRID', label: 'Гибрид' },
              { id: 'ONSITE', label: 'Офис' },
            ].map((loc) => (
              <Button
                key={loc.id}
                type="button"
                variant={filters.locationType === loc.id ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-8 px-2"
                onClick={() =>
                  updateFilter(
                    'locationType',
                    filters.locationType === loc.id ? undefined : loc.id
                  )
                }
              >
                {loc.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Академические критерии (Курс и GPA) */}
        <div className="space-y-3 pt-2 border-t border-border/40">
          <Label className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" />
            Академические критерии
          </Label>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Мой курс обучения:</span>
              <strong className="text-foreground">
                {filters.studentCourse ? `${filters.studentCourse} курс` : 'Любой'}
              </strong>
            </div>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={filters.studentCourse || ''}
              onChange={(e) =>
                updateFilter('studentCourse', e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Не учитывать курс</option>
              <option value="1">1 курс (только для 1+ курса)</option>
              <option value="2">2 курс (подходят для 1-2 курсов)</option>
              <option value="3">3 курс (подходят для 1-3 курсов)</option>
              <option value="4">4 курс (бакалавриат / выпускники)</option>
              <option value="5">Магистратура (1 курс)</option>
              <option value="6">Магистратура (2 курс)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Мой средний балл (GPA):</span>
              <strong className="text-foreground">
                {filters.studentNormalizedGpa ? `GPA ${filters.studentNormalizedGpa}` : 'Любой'}
              </strong>
            </div>
            <select
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={filters.studentNormalizedGpa || ''}
              onChange={(e) =>
                updateFilter(
                  'studentNormalizedGpa',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            >
              <option value="">Любой средний балл</option>
              <option value="3.8">GPA 3.8+ (отличник, топ факультета)</option>
              <option value="3.5">GPA 3.5+ (высокая успеваемость)</option>
              <option value="3.0">GPA 3.0+ (хорошая успеваемость)</option>
            </select>
          </div>
        </div>

        {/* Специфические студенческие опции */}
        <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
          <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-accent">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              checked={filters.hasMentorship === true}
              onChange={(e) => updateFilter('hasMentorship', e.target.checked ? true : undefined)}
            />
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              Только с наставником (Senior ментор)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-accent">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              checked={filters.isStipend === true}
              onChange={(e) => updateFilter('isStipend', e.target.checked ? true : undefined)}
            />
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Только оплачиваемые стажировки
            </span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
