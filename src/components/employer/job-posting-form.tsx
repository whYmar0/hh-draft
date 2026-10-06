'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { JobPostingInput, jobPostingSchema } from '@/lib/validations/job-posting';
import { Briefcase, GraduationCap, Coins, Save, Users } from 'lucide-react';

export interface JobPostingFormProps {
  initialData?: Partial<JobPostingInput>;
  onSubmit: (data: JobPostingInput) => Promise<{ success: boolean; error?: string; data?: any }>;
  onCancel?: () => void;
}

export function JobPostingForm({ initialData, onSubmit, onCancel }: JobPostingFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [targetMajorsString, setTargetMajorsString] = React.useState(
    initialData?.targetMajors?.join(', ') ||
      'Программная инженерия, Прикладная математика и информатика, Информатика и ВТ'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPostingInput>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      employmentType: initialData?.employmentType || 'INTERNSHIP',
      locationType: initialData?.locationType || 'HYBRID',
      city: initialData?.city || 'Москва',
      salaryMin: initialData?.salaryMin || 60000,
      salaryMax: initialData?.salaryMax || 90000,
      currency: initialData?.currency || 'RUB',
      isStipend: initialData?.isStipend ?? true,
      hasMentorship: initialData?.hasMentorship ?? true,
      minCourse: initialData?.minCourse || 2,
      minGpa: initialData?.minGpa || 3.2,
      testTaskDescription:
        initialData?.testTaskDescription ||
        'Напишите небольшой сервис на выбранном стеке, реализующий REST/gRPC API по ТЗ.',
    },
  });

  const onFormSubmit = async (data: JobPostingInput) => {
    setIsSubmitting(true);
    setFormError(null);

    const formattedData: JobPostingInput = {
      ...data,
      targetMajors: targetMajorsString
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    };

    const parsed = jobPostingSchema.safeParse(formattedData);
    if (!parsed.success) {
      setFormError(parsed.error.errors[0]?.message || 'Ошибка валидации данных вакансии');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await onSubmit(formattedData);
      if (!res.success) {
        setFormError(res.error || 'Не удалось сохранить вакансию');
      }
    } catch (e: any) {
      setFormError(e.message || 'Произошла непредвиденная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {formError && (
        <div className="p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          {formError}
        </div>
      )}

      {/* Основная информация о вакансии */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-500" />
            Параметры позиции
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Название позиции *</Label>
            <Input
              id="title"
              placeholder="Стажер Backend-разработчик (Go), Junior QA Инженер..."
              {...register('title')}
            />
            {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="employmentType">Формат занятости</Label>
              <select
                id="employmentType"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('employmentType')}
              >
                <option value="INTERNSHIP">Стажировка</option>
                <option value="PART_TIME">Part-time (20–30 ч/нед)</option>
                <option value="FULL_TIME">Full-time (40 ч/нед)</option>
                <option value="FLEXIBLE">Гибкий график</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="locationType">Локация</Label>
              <select
                id="locationType"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('locationType')}
              >
                <option value="REMOTE">Удаленно</option>
                <option value="HYBRID">Гибридный формат</option>
                <option value="ONSITE">В офисе</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">Город</Label>
              <Input id="city" placeholder="Москва, Санкт-Петербург..." {...register('city')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Описание задач и условий стажировки *</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Опишите задачи стажера, команду, стек технологий и формат работы..."
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-destructive">{errors.description.message}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Оплата и кураторство */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="h-4 w-4 text-indigo-500" />
            Оплата и поддержка студента
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="salaryMin">Минимальная стипендия / оплата (₽ в мес)</Label>
              <Input
                id="salaryMin"
                type="number"
                step="5000"
                {...register('salaryMin', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salaryMax">Максимальная стипендия / оплата (₽ в мес)</Label>
              <Input
                id="salaryMax"
                type="number"
                step="5000"
                {...register('salaryMax', { valueAsNumber: true })}
              />
              {errors.salaryMin && (
                <span className="text-xs text-destructive">{errors.salaryMin.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-border hover:bg-accent">
              <input
                type="checkbox"
                className="rounded text-indigo-600 focus:ring-indigo-500"
                {...register('isStipend')}
              />
              <div>
                <span className="font-semibold text-xs block">Оплачиваемая стажировка</span>
                <span className="text-[11px] text-muted-foreground">
                  Компания выплачивает стипендию во время обучения
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-border hover:bg-accent">
              <input
                type="checkbox"
                className="rounded text-indigo-600 focus:ring-indigo-500"
                {...register('hasMentorship')}
              />
              <div>
                <span className="font-semibold text-xs block">Персональный ментор (Senior)</span>
                <span className="text-[11px] text-muted-foreground">
                  За стажером закрепляется наставник с регулярными 1-on-1
                </span>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Академические фильтры отбора */}
      <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-50/30 to-card dark:from-indigo-950/20 dark:to-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Академические критерии отбора кандидатов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="minCourse">Минимальный курс студента (1–6)</Label>
              <Input
                id="minCourse"
                type="number"
                min="1"
                max="6"
                {...register('minCourse', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="minGpa">
                Минимальный средний балл (GPA) по 4.0 шкале{' '}
                <span className="text-xs text-muted-foreground">(напр. 3.2 ~ 4.0 по 5-балльной)</span>
              </Label>
              <Input
                id="minGpa"
                type="number"
                step="0.1"
                min="0"
                max="4.0"
                {...register('minGpa', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="targetMajors">Профильные направления обучения (через запятую)</Label>
            <Input
              id="targetMajors"
              value={targetMajorsString}
              onChange={(e) => setTargetMajorsString(e.target.value)}
              placeholder="Программная инженерия, Прикладная математика, Информатика и ВТ"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="testTaskDescription">Описание тестового задания (опционально)</Label>
            <Textarea
              id="testTaskDescription"
              rows={3}
              placeholder="Краткое описание задачи, которую кандидат должен будет решить на этапе скрининга..."
              {...register('testTaskDescription')}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-border/40 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Отмена
            </Button>
          )}
          <Button type="submit" variant="gradient" disabled={isSubmitting} className="gap-1.5">
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Публикация...' : 'Опубликовать вакансию'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
