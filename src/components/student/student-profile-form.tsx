'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { StudentProfileInput, studentProfileSchema } from '@/lib/validations/student-profile';
import { GraduationCap, User, Globe, Save } from 'lucide-react';

export interface StudentProfileFormProps {
  initialData?: Partial<StudentProfileInput>;
  onSubmit: (data: StudentProfileInput) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
}

export function StudentProfileForm({
  initialData,
  onSubmit,
  onCancel,
}: StudentProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentProfileInput>({
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phone: initialData?.phone || '',
      university: initialData?.university || '',
      faculty: initialData?.faculty || '',
      fieldOfStudy: initialData?.fieldOfStudy || '',
      degreeLevel: initialData?.degreeLevel || 'BACHELOR',
      currentCourse: initialData?.currentCourse || 3,
      graduationYear: initialData?.graduationYear || new Date().getFullYear() + 1,
      gpa: initialData?.gpa || 4.5,
      gpaScale: initialData?.gpaScale || 'SCALE_5',
      searchStatus: initialData?.searchStatus || 'LOOKING_FOR_INTERNSHIP',
      bio: initialData?.bio || '',
      githubUrl: initialData?.githubUrl || '',
      portfolioUrl: initialData?.portfolioUrl || '',
      linkedinUrl: initialData?.linkedinUrl || '',
    },
  });

  const selectedGpaScale = watch('gpaScale');

  const onFormSubmit = async (data: StudentProfileInput) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      const parsed = studentProfileSchema.safeParse(data);
      if (!parsed.success) {
        setFormError(parsed.error.errors[0]?.message || 'Ошибка валидации формы');
        setIsSubmitting(false);
        return;
      }

      const res = await onSubmit(data);
      if (!res.success) {
        setFormError(res.error || 'Не удалось сохранить изменения');
      } else {
        setFormSuccess(true);
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
      {formSuccess && (
        <div className="p-3 text-sm rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
          Профиль успешно обновлен!
        </div>
      )}

      {/* Личные данные */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-500" />
            Личные данные
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Имя *</Label>
            <Input id="firstName" {...register('firstName')} />
            {errors.firstName && (
              <span className="text-xs text-destructive">{errors.firstName.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Фамилия *</Label>
            <Input id="lastName" {...register('lastName')} />
            {errors.lastName && (
              <span className="text-xs text-destructive">{errors.lastName.message}</span>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">Контактный телефон</Label>
            <Input id="phone" placeholder="+7 (999) 000-00-00" {...register('phone')} />
          </div>
        </CardContent>
      </Card>

      {/* Академическая информация */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            Академический профиль
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="university">ВУЗ *</Label>
              <Input
                id="university"
                placeholder="НИУ ВШЭ, МГТУ им. Баумана, МГУ..."
                {...register('university')}
              />
              {errors.university && (
                <span className="text-xs text-destructive">{errors.university.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="faculty">Факультет / Институт</Label>
              <Input
                id="faculty"
                placeholder="Факультет компьютерных наук (ФКН)"
                {...register('faculty')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fieldOfStudy">Направление / Специальность *</Label>
              <Input
                id="fieldOfStudy"
                placeholder="Программная инженерия, 09.03.04"
                {...register('fieldOfStudy')}
              />
              {errors.fieldOfStudy && (
                <span className="text-xs text-destructive">{errors.fieldOfStudy.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currentCourse">Текущий курс (1–6) *</Label>
              <Input
                id="currentCourse"
                type="number"
                min="1"
                max="6"
                {...register('currentCourse', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="graduationYear">Плановый год выпуска *</Label>
              <Input
                id="graduationYear"
                type="number"
                {...register('graduationYear', { valueAsNumber: true })}
              />
            </div>

            {/* Блок GPA и шкалы */}
            <div className="space-y-1.5">
              <Label htmlFor="gpaScale">Шкала академического балла *</Label>
              <select
                id="gpaScale"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('gpaScale')}
              >
                <option value="SCALE_5">5-балльная система (Российский стандарт 0..5.0)</option>
                <option value="SCALE_4">4-балльная система (Международный GPA 0..4.0)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gpa">
                Средний балл (GPA) *{' '}
                <span className="text-xs text-muted-foreground">
                  (макс. {selectedGpaScale === 'SCALE_5' ? '5.0' : '4.0'})
                </span>
              </Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                {...register('gpa', { valueAsNumber: true })}
              />
              {errors.gpa && (
                <span className="text-xs text-destructive">{errors.gpa.message}</span>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="searchStatus">Статус поиска работы / стажировки</Label>
              <select
                id="searchStatus"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('searchStatus')}
              >
                <option value="LOOKING_FOR_INTERNSHIP">Ищу стажировку</option>
                <option value="LOOKING_FOR_JOB">Ищу работу (part-time / full-time)</option>
                <option value="NOT_LOOKING">Не ищу работу</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ссылки и О себе */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-500" />
            Ссылки и описание профиля
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="githubUrl">Ссылка на профиль GitHub</Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/username"
                {...register('githubUrl')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="portfolioUrl">Сайт-портфолио</Label>
              <Input
                id="portfolioUrl"
                placeholder="https://myportfolio.dev"
                {...register('portfolioUrl')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn профиль</Label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/username"
                {...register('linkedinUrl')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">О себе, научных интересах и технологиях</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Расскажите о темах курсовых работ, научных статьях или стеке технологий..."
              {...register('bio')}
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
            {isSubmitting ? 'Сохранение...' : 'Сохранить профиль'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
