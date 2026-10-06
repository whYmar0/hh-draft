import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  ExternalLink,
  Github,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatusBadge } from '@/components/applications/application-status-badge';
import { ApplicationStatus, STATUS_LABELS } from '@/server/services/application-state-machine';
import { formatDate } from '@/lib/utils';

export interface StudentApplicationCardProps {
  application: {
    id: string;
    jobPosting: {
      id: string;
      title: string;
      companyName: string;
      employmentType: string;
      locationType: string;
      isStipend: boolean;
      salaryMin?: number | null;
      salaryMax?: number | null;
    };
    status: ApplicationStatus;
    appliedAt: Date | string;
    coverLetter?: string | null;
    testSubmissionUrl?: string | null;
    employerFeedback?: string | null;
    history: Array<{
      id: string;
      fromStatus: ApplicationStatus;
      toStatus: ApplicationStatus;
      note?: string | null;
      changedAt: Date | string;
    }>;
  };
}

export function StudentApplicationCard({ application }: StudentApplicationCardProps) {
  const { jobPosting } = application;

  return (
    <Card className="border-border/80 hover:border-indigo-500/40 shadow-sm transition-all overflow-hidden">
      <CardHeader className="pb-3 bg-accent/20 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                {jobPosting.companyName}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Отклик подан: {formatDate(application.appliedAt)}
              </span>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground hover:text-indigo-600 transition-colors">
              <Link href={`/vacancies/${jobPosting.id}`}>{jobPosting.title}</Link>
            </CardTitle>
          </div>

          <div className="shrink-0">
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 text-xs">
        {/* Обратная связь от компании / наставника */}
        {application.employerFeedback && (
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-1">
            <span className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Комментарий работодателя:
            </span>
            <p className="text-muted-foreground italic leading-relaxed">
              «{application.employerFeedback}»
            </p>
          </div>
        )}

        {/* Ссылка на отправленное тестовое */}
        {application.testSubmissionUrl && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Прикрепленное тестовое задание:</span>
            <Link
              href={application.testSubmissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Github className="h-3.5 w-3.5" />
              Репозиторий решения
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* История этапов отбора (Timeline) */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
            Хронология рассмотрения заявки:
          </span>
          <div className="space-y-1.5">
            {application.history.map((hist, idx) => (
              <div key={hist.id} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-foreground">
                    {STATUS_LABELS[hist.toStatus]}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    ({formatDate(hist.changedAt)})
                  </span>
                  {hist.note && <span className="block italic text-[10px]">{hist.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
