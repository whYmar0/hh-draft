'use client';

import * as React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
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

  const toggleEmploymentType = (typeId: 'INTERNSHIP' | 'PART_TIME' | 'FULL_TIME' | 'FLEXIBLE') => {
    const currentList = filters.employmentTypes || (filters.employmentType ? [filters.employmentType] : []);
    const exists = currentList.includes(typeId);
    const updated = exists ? currentList.filter((t) => t !== typeId) : [...currentList, typeId];
    onChange({
      ...filters,
      employmentTypes: updated.length > 0 ? updated : undefined,
      employmentType: undefined,
    });
  };

  const toggleLocationType = (locId: 'REMOTE' | 'HYBRID' | 'ONSITE') => {
    const currentList = filters.locationTypes || (filters.locationType ? [filters.locationType] : []);
    const exists = currentList.includes(locId);
    const updated = exists ? currentList.filter((l) => l !== locId) : [...currentList, locId];
    onChange({
      ...filters,
      locationTypes: updated.length > 0 ? updated : undefined,
      locationType: undefined,
    });
  };

  const selectedEmploymentTypes =
    filters.employmentTypes || (filters.employmentType ? [filters.employmentType] : []);
  const selectedLocationTypes =
    filters.locationTypes || (filters.locationType ? [filters.locationType] : []);

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

        {/* Формат стажировки и занятости (мультивыбор) */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground/80 block">Формат работы</Label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {[
              { id: 'INTERNSHIP' as const, label: 'Стажировка' },
              { id: 'PART_TIME' as const, label: 'Part-time' },
              { id: 'FULL_TIME' as const, label: 'Full-time' },
              { id: 'FLEXIBLE' as const, label: 'Гибкий график' },
            ].map((type) => {
              const isSelected = selectedEmploymentTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleEmploymentType(type.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'border-border/60 hover:bg-accent/50 text-foreground/80'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm border flex items-center justify-center text-[9px] ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-muted-foreground/60'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Локация (мультивыбор, без иконки) */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground/80 block">
            Локация
          </Label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: 'REMOTE' as const, label: 'Удаленно' },
              { id: 'HYBRID' as const, label: 'Гибрид' },
              { id: 'ONSITE' as const, label: 'Офис' },
            ].map((loc) => {
              const isSelected = selectedLocationTypes.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => toggleLocationType(loc.id)}
                  className={`h-8 rounded-lg border text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600 text-white shadow-xs'
                      : 'border-border/60 hover:bg-accent/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {loc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Академические критерии (Курс и GPA, без иконки и синего цвета текста) */}
        <div className="space-y-3 pt-2 border-t border-border/40">
          <Label className="text-xs font-semibold text-foreground/80 block">
            Академические критерии
          </Label>

          <div className="space-y-1.5">
            <div className="text-xs">
              <span className="text-muted-foreground">Мой курс обучения</span>
              {filters.studentCourse && (
                <span className="font-semibold text-foreground ml-1.5">
                  ({filters.studentCourse} курс)
                </span>
              )}
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
            <div className="text-xs">
              <span className="text-muted-foreground">Мой средний балл (GPA)</span>
              {filters.studentNormalizedGpa && (
                <span className="font-semibold text-foreground ml-1.5">
                  (GPA {filters.studentNormalizedGpa})
                </span>
              )}
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

        {/* Специфические студенческие опции (без иконок) */}
        <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
          <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-accent">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              checked={filters.hasMentorship === true}
              onChange={(e) => updateFilter('hasMentorship', e.target.checked ? true : undefined)}
            />
            <span>Только с наставником (Senior ментор)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-accent">
            <input
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              checked={filters.isStipend === true}
              onChange={(e) => updateFilter('isStipend', e.target.checked ? true : undefined)}
            />
            <span>Только оплачиваемые стажировки</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
