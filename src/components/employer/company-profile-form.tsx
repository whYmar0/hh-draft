'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Building2, Save } from 'lucide-react';

export interface CompanyProfileFormInput {
  companyName: string;
  website?: string;
  industry?: string;
  description?: string;
  internshipProgramsDescription?: string;
}

export interface CompanyProfileFormProps {
  initialData?: Partial<CompanyProfileFormInput>;
  onSubmit: (data: CompanyProfileFormInput) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
}

export function CompanyProfileForm({
  initialData,
  onSubmit,
  onCancel,
}: CompanyProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyProfileFormInput>({
    defaultValues: {
      companyName: initialData?.companyName || '',
      website: initialData?.website || '',
      industry: initialData?.industry || '',
      description: initialData?.description || '',
      internshipProgramsDescription: initialData?.internshipProgramsDescription || '',
    },
  });

  const onFormSubmit = async (data: CompanyProfileFormInput) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      if (!data.companyName || data.companyName.trim().length < 2) {
        setFormError('Название компании обязательно (минимум 2 символа)');
        setIsSubmitting(false);
        return;
      }

      const res = await onSubmit(data);
      if (!res.success) {
        setFormError(res.error || 'Ошибка при сохранении данных');
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
          Профиль компании успешно сохранен!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-500" />
            Сведения о компании
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="companyName">Название компании *</Label>
              <Input
                id="companyName"
                placeholder="Финтех Лабс, Яндекс, Тинькофф..."
                {...register('companyName', { required: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="industry">Отрасль / Сфера деятельности</Label>
              <Input
                id="industry"
                placeholder="Финтех, IT / Highload, EdTech..."
                {...register('industry')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website">Официальный сайт</Label>
              <Input
                id="website"
                placeholder="https://company.example.com"
                {...register('website')}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">О компании и технологическом стеке</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Расскажите о миссии, ключевых проектах и инженерной культуре..."
                {...register('description')}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="internshipProgramsDescription">
                Программы стажировок для студентов
              </Label>
              <Textarea
                id="internshipProgramsDescription"
                rows={4}
                placeholder="Опишите условия для студентов: длительность стажировки, наставничество, стипендию, возможности перехода в штат..."
                {...register('internshipProgramsDescription')}
              />
            </div>
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
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
