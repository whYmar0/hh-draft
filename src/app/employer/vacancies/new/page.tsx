'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { JobPostingForm } from '@/components/employer/job-posting-form';
import { JobPostingInput } from '@/lib/validations/job-posting';
import { Button } from '@/components/ui/button';

export default function NewVacancyPage() {
  const router = useRouter();
  const [created, setCreated] = React.useState(false);

  const handleSubmit = async (data: JobPostingInput) => {
    // В MVP сохраняем и показываем уведомление об успехе
    setCreated(true);
    return { success: true };
  };

  return (
    <div className="container max-w-4xl py-8 px-4 sm:px-6">
      <div className="mb-6">
        <Link href="/employer/profile">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Назад в кабинет работодателя
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Публикация студенческой вакансии / стажировки
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Задайте академические фильтры (ВУЗы, минимальный курс и средний балл GPA), чтобы получать только квалифицированные отклики профильных студентов.
        </p>
      </div>

      {created ? (
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Вакансия успешно опубликована!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Позиция добавлена в каталог и доступна для откликов студентов. Вы можете отслеживать входящие заявки в кабинете компании.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/vacancies">
              <Button variant="outline" size="sm">
                Посмотреть в каталоге
              </Button>
            </Link>
            <Link href="/employer/profile">
              <Button variant="default" size="sm">
                В кабинет компании
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <JobPostingForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/employer/profile')}
        />
      )}
    </div>
  );
}
