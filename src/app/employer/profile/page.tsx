'use client';

import * as React from 'react';
import Link from 'next/link';
import { CompanyProfileView } from '@/components/employer/company-profile-view';
import { CompanyProfileForm, CompanyProfileFormInput } from '@/components/employer/company-profile-form';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Edit3, Eye, Plus, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const INITIAL_DEMO_COMPANY = {
  id: 'demo-comp-1',
  companyName: 'Финтех Лабс',
  slug: 'fintech-labs',
  logoUrl: null,
  website: 'https://fintech-labs.example.ru',
  industry: 'Финтех / Высоконагруженные распределенные системы',
  description:
    'Ведущий центр инженерных разработок финтех-экосистемы. Мы строим транзакционные шлюзы с миллионами RPS, развиваем необанкинг и алгоритмические торговые платформы на Go, Rust и Python.',
  verified: true,
  internshipProgramsDescription:
    'Ежегодная оплачиваемая программа стажировок «Fintech Academy»: 3–6 месяцев, гибкий график 20–30 часов в неделю, персональный senior-наставник, конкурентная стипендия (70 000 – 95 000 ₽) и быстрый перевод на позицию Junior+ по результатам итоговой защиты проекта.',
  jobPostings: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Стажер Backend-разработчик (Go / Highload)',
      employmentType: 'Стажировка',
      locationType: 'Гибрид',
      city: 'Москва',
      salaryMin: 70000,
      salaryMax: 95000,
      isStipend: true,
      status: 'PUBLISHED',
      applicationsCount: 14,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Стажер Frontend-разработчик (React / Next.js / TypeScript)',
      employmentType: 'Part-time',
      locationType: 'Удаленно',
      city: 'Москва / СПб',
      salaryMin: 60000,
      salaryMax: 85000,
      isStipend: true,
      status: 'PUBLISHED',
      applicationsCount: 9,
    },
  ],
};

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [companyData, setCompanyData] = React.useState(INITIAL_DEMO_COMPANY);

  const handleCompanySubmit = async (data: CompanyProfileFormInput) => {
    setCompanyData((prev) => ({
      ...prev,
      ...data,
      companyName: data.companyName,
    }));
    setIsEditing(false);
    return { success: true };
  };

  return (
    <div className="container max-w-5xl py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 text-xs text-muted-foreground')}
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/employer/vacancies/new"
            className={cn(buttonVariants({ variant: 'gradient', size: 'sm' }), 'gap-1.5')}
          >
            <Plus className="h-4 w-4" />
            Новая вакансия
          </Link>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'secondary'}
            size="sm"
            className="gap-1.5"
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4" />
                Просмотр
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Редактировать
              </>
            )}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <CompanyProfileForm
          initialData={companyData}
          onSubmit={handleCompanySubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <CompanyProfileView
          company={companyData}
          isOwner={true}
          onEditClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
