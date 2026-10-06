import * as React from 'react';
import Link from 'next/link';
import { Building2, Globe, CheckCircle2, Briefcase, Plus, Edit3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface CompanyProfileViewProps {
  company: {
    id: string;
    companyName: string;
    slug: string;
    logoUrl?: string | null;
    website?: string | null;
    industry?: string | null;
    description?: string | null;
    verified: boolean;
    internshipProgramsDescription?: string | null;
    jobPostings?: Array<{
      id: string;
      title: string;
      employmentType: string;
      locationType: string;
      city?: string | null;
      salaryMin?: number | null;
      salaryMax?: number | null;
      isStipend: boolean;
      status: string;
      applicationsCount?: number;
    }>;
  };
  isOwner?: boolean;
  onEditClick?: () => void;
}

export function CompanyProfileView({
  company,
  isOwner = false,
  onEditClick,
}: CompanyProfileViewProps) {
  return (
    <div className="space-y-8">
      {/* Шапка компании */}
      <Card className="overflow-hidden border-border/80 shadow-md">
        <div className="h-28 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-4 mb-4">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-indigo-700 text-white text-2xl font-bold shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">{company.companyName}</h1>
                  {company.verified && (
                    <Badge variant="honors" className="gap-1 py-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Верифицировано
                    </Badge>
                  )}
                </div>
                {company.industry && (
                  <p className="text-sm text-muted-foreground mt-0.5">{company.industry}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {company.website && (
                <Link href={company.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Globe className="h-3.5 w-3.5" />
                    Сайт компании
                  </Button>
                </Link>
              )}
              {isOwner && onEditClick && (
                <Button onClick={onEditClick} variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Edit3 className="h-3.5 w-3.5" />
                  Редактировать профиль
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* О компании и программы стажировок */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" />
              О компании
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {company.description || 'Описание компании еще не заполнено.'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-50/30 to-card dark:from-indigo-950/20 dark:to-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-500" />
              Программы студенческих стажировок
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {company.internshipProgramsDescription ||
                'Компания пока не опубликовала информацию о специальных программах для студентов.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Вакансии компании */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" />
            Вакансии и стажировки компании
            <span className="text-xs font-normal text-muted-foreground">
              ({company.jobPostings?.length ?? 0})
            </span>
          </h2>
          {isOwner && (
            <Link href="/employer/vacancies/new">
              <Button variant="gradient" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Создать вакансию
              </Button>
            </Link>
          )}
        </div>

        {company.jobPostings && company.jobPostings.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {company.jobPostings.map((job) => (
              <Card key={job.id} className="p-4 hover:border-indigo-500/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{job.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary">{job.employmentType}</Badge>
                      <Badge variant="secondary">{job.locationType}</Badge>
                      {job.city && <span>{job.city}</span>}
                      {job.isStipend && (
                        <Badge variant="honors">Оплачиваемая стажировка</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner && job.applicationsCount !== undefined && (
                      <span className="text-xs text-muted-foreground mr-2">
                        Откликов: <strong className="text-foreground">{job.applicationsCount}</strong>
                      </span>
                    )}
                    <Link href={`/vacancies/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Подробнее
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed">
            <p className="text-sm text-muted-foreground">
              У компании пока нет активных опубликованных вакансий.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
