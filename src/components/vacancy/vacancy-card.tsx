import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  GraduationCap,
  Award,
  Users2,
  Coins,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export interface VacancyCardProps {
  vacancy: {
    id: string;
    title: string;
    companyName: string;
    companySlug?: string;
    companyVerified?: boolean;
    description: string;
    employmentType: string;
    locationType: string;
    city?: string | null;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency?: string;
    isStipend: boolean;
    hasMentorship: boolean;
    minCourse: number;
    minGpa?: number | null;
    targetMajors: string[];
    skills?: string[];
    createdAt?: Date | string;
  };
  studentMatch?: {
    isEligible: boolean;
    reason?: string;
  };
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  INTERNSHIP: 'Стажировка',
  PART_TIME: 'Part-time',
  FULL_TIME: 'Full-time',
  FLEXIBLE: 'Гибкий график',
};

const LOCATION_LABELS: Record<string, string> = {
  REMOTE: 'Удаленно',
  HYBRID: 'Гибрид',
  ONSITE: 'Офис',
};

export function VacancyCard({ vacancy, studentMatch }: VacancyCardProps) {
  const formatSalary = () => {
    if (!vacancy.salaryMin && !vacancy.salaryMax) {
      return vacancy.isStipend ? 'Стипендия обсуждается' : 'По договоренности';
    }
    if (vacancy.salaryMin && vacancy.salaryMax) {
      return `${formatCurrency(vacancy.salaryMin)} – ${formatCurrency(vacancy.salaryMax)}`;
    }
    if (vacancy.salaryMin) {
      return `от ${formatCurrency(vacancy.salaryMin)}`;
    }
    return `до ${formatCurrency(vacancy.salaryMax!)}`;
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-border/80 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        {/* Верхняя строка: компания и бейджи условий */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold text-xs">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                {vacancy.companyName}
                {vacancy.companyVerified && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                )}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {vacancy.city || 'РФ'} • {LOCATION_LABELS[vacancy.locationType] || vacancy.locationType}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="font-bold text-sm text-foreground block">{formatSalary()}</span>
            <span className="text-[10px] text-muted-foreground">
              {vacancy.isStipend ? 'Оплачиваемая стажировка' : 'Заработная плата'}
            </span>
          </div>
        </div>

        {/* Название вакансии */}
        <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-2 hover:text-indigo-600 transition-colors">
          <Link href={`/vacancies/${vacancy.id}`}>{vacancy.title}</Link>
        </CardTitle>

        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {vacancy.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Академические фильтры / требования */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <Badge variant="secondary" className="gap-1 font-normal py-0.5">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
            Курс: от {vacancy.minCourse}-го
          </Badge>

          {vacancy.minGpa != null && (
            <Badge variant="academic" className="gap-1 py-0.5">
              <Award className="h-3.5 w-3.5 text-amber-600" />
              Мин. GPA {vacancy.minGpa.toFixed(1)}
            </Badge>
          )}

          {vacancy.hasMentorship && (
            <Badge variant="honors" className="gap-1 py-0.5">
              <Users2 className="h-3.5 w-3.5 text-emerald-600" />
              С ментором
            </Badge>
          )}

          <Badge variant="outline" className="text-[11px]">
            {EMPLOYMENT_LABELS[vacancy.employmentType] || vacancy.employmentType}
          </Badge>
        </div>

        {/* Навыки / Стек */}
        {vacancy.skills && vacancy.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {vacancy.skills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="tech">
                {skill}
              </Badge>
            ))}
            {vacancy.skills.length > 5 && (
              <span className="text-[11px] text-muted-foreground self-center">
                +{vacancy.skills.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Индикатор соответствия студента */}
        {studentMatch && (
          <div
            className={`text-xs p-2 rounded-lg flex items-center gap-1.5 ${
              studentMatch.isEligible
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            {studentMatch.isEligible ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Вы полностью подходите под академические критерии</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{studentMatch.reason || 'Не все академические критерии удовлетворены'}</span>
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {vacancy.targetMajors.length > 0
            ? `Специальности: ${vacancy.targetMajors.slice(0, 2).join(', ')}`
            : 'Для всех технических направлений'}
        </span>
        <Link href={`/vacancies/${vacancy.id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs hover:text-indigo-600">
            Подробнее
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
