import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  Calendar,
  Github,
  Globe,
  Linkedin,
  BookOpen,
  Briefcase,
  Code2,
  Trophy,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GpaBadge } from '@/components/student/gpa-badge';
import { ProjectCard } from '@/components/student/project-card';
import { AchievementBadge } from '@/components/student/achievement-badge';
import { EmptyState } from '@/components/ui/empty-state';

export interface StudentProfileViewProps {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    university: string;
    faculty?: string | null;
    fieldOfStudy: string;
    degreeLevel?: 'BACHELOR' | 'MASTER' | 'SPECIALIST' | 'POSTGRADUATE';
    currentCourse: number;
    graduationYear: number;
    gpa: number;
    gpaScale: 'SCALE_4' | 'SCALE_5';
    normalizedGpa: number;
    searchStatus: 'LOOKING_FOR_INTERNSHIP' | 'LOOKING_FOR_JOB' | 'NOT_LOOKING';
    bio?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
    linkedinUrl?: string | null;
    projects?: Array<{
      id: string;
      title: string;
      description: string;
      role?: string | null;
      repoUrl?: string | null;
      demoUrl?: string | null;
      technologies: string[];
    }>;
    achievements?: Array<{
      id: string;
      type: any;
      title: string;
      description?: string | null;
      year: number;
      verificationUrl?: string | null;
    }>;
    skills?: Array<{
      id: string;
      skill: { name: string; category: string };
      level: string;
    }>;
  };
  isOwner?: boolean;
  onEditClick?: () => void;
}

const STATUS_MAP: Record<string, { label: string; variant: 'honors' | 'academic' | 'secondary' }> = {
  LOOKING_FOR_INTERNSHIP: { label: 'Ищу стажировку', variant: 'honors' },
  LOOKING_FOR_JOB: { label: 'Ищу работу (part/full-time)', variant: 'academic' },
  NOT_LOOKING: { label: 'Не ищу работу', variant: 'secondary' },
};

export function StudentProfileView({
  profile,
  isOwner = false,
  onEditClick,
}: StudentProfileViewProps) {
  const statusConfig = STATUS_MAP[profile.searchStatus] || {
    label: profile.searchStatus,
    variant: 'secondary' as const,
  };

  return (
    <div className="space-y-8">
      {/* Шапка резюме студента */}
      <Card className="overflow-hidden border-border/80 shadow-md">
        {/* Декоративный баннер */}
        <div className="h-28 bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-700 dark:from-indigo-950 dark:to-slate-900" />

        <CardContent className="px-6 pb-6 pt-0">
          {/* Аватар, аккуратно выступающий над баннером */}
          <div className="flex justify-between items-start -mt-12 mb-2">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-indigo-600 text-white text-3xl font-bold shadow-lg">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </div>
          </div>

          {/* Имя, ВУЗ и действия на единой линии в светлой области карточки */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-1">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Building2 className="h-4 w-4 text-indigo-500 shrink-0" />
                {profile.university}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusConfig.variant} className="text-xs px-3 py-1 font-medium">
                {statusConfig.label}
              </Badge>
              {isOwner && onEditClick && (
                <Button onClick={onEditClick} variant="outline" size="sm" className="shadow-xs">
                  Редактировать резюме
                </Button>
              )}
            </div>
          </div>

          {/* Академические метаданные */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-accent/30 border border-border/50">
            <div>
              <span className="text-xs text-muted-foreground block">Направление обучения</span>
              <span className="text-sm font-medium text-foreground">{profile.fieldOfStudy}</span>
              {profile.faculty && (
                <span className="text-xs text-muted-foreground block truncate">
                  ({profile.faculty})
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Текущий курс</span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1 mt-0.5">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                {profile.currentCourse} курс
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Год выпуска</span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1 mt-0.5">
                <Calendar className="h-4 w-4 text-indigo-500" />
                {profile.graduationYear} г.
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Академический балл</span>
              <div className="mt-1">
                <GpaBadge gpa={profile.gpa} scale={profile.gpaScale} />
              </div>
            </div>
          </div>

          {/* Ссылки на портфолио / GitHub */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/40 flex-wrap">
            {profile.githubUrl && (
              <Link href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Github className="h-3.5 w-3.5" />
                  GitHub профиль
                </Button>
              </Link>
            )}
            {profile.portfolioUrl && (
              <Link href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Globe className="h-3.5 w-3.5" />
                  Портфолио
                </Button>
              </Link>
            )}
            {profile.linkedinUrl && (
              <Link href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* О себе и научные интересы */}
      {profile.bio && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              О себе и научные интересы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Проекты студента */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-500" />
            Курсовые и практические проекты
            <span className="text-xs font-normal text-muted-foreground">
              ({profile.projects?.length ?? 0})
            </span>
          </h2>
        </div>

        {profile.projects && profile.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                title={proj.title}
                description={proj.description}
                role={proj.role}
                repoUrl={proj.repoUrl}
                demoUrl={proj.demoUrl}
                technologies={proj.technologies}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Code2}
            title="Проекты пока не добавлены"
            description="Добавьте курсовые, дипломные или pet-проекты с репозиториями на GitHub, чтобы подтвердить практический опыт."
            actionLabel={isOwner ? 'Добавить проект' : undefined}
            onAction={onEditClick}
          />
        )}
      </div>

      {/* Научные достижения и олимпиады */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Олимпиады, конференции и публикации
            <span className="text-xs font-normal text-muted-foreground">
              ({profile.achievements?.length ?? 0})
            </span>
          </h2>
        </div>

        {profile.achievements && profile.achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.achievements.map((ach) => (
              <AchievementBadge
                key={ach.id}
                type={ach.type}
                title={ach.title}
                description={ach.description}
                year={ach.year}
                verificationUrl={ach.verificationUrl}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="Достижения пока не указаны"
            description="Укажите участие в олимпиадах («Я — профессионал», ICPC), хакатонах или научные публикации."
            actionLabel={isOwner ? 'Добавить достижение' : undefined}
            onAction={onEditClick}
          />
        )}
      </div>
    </div>
  );
}
