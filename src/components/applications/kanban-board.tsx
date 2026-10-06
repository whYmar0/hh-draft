'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  Award,
  Github,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Send,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GpaBadge } from '@/components/student/gpa-badge';
import { ApplicationStatusBadge } from '@/components/applications/application-status-badge';
import {
  ApplicationStatus,
  STATUS_LABELS,
  getNextAllowedStatuses,
} from '@/server/services/application-state-machine';

export interface KanbanApplicant {
  id: string;
  candidateName: string;
  university: string;
  fieldOfStudy: string;
  currentCourse: number;
  normalizedGpa: number;
  jobTitle: string;
  coverLetter?: string | null;
  testSubmissionUrl?: string | null;
  status: ApplicationStatus;
  appliedAt: string | Date;
  employerFeedback?: string | null;
}

export interface KanbanBoardProps {
  applicants: KanbanApplicant[];
  onStatusChange: (
    applicantId: string,
    newStatus: ApplicationStatus,
    note?: string
  ) => void;
}

const COLUMNS: Array<{ id: ApplicationStatus; title: string; colorClass: string }> = [
  { id: 'NEW', title: 'Новые отклики', colorClass: 'border-t-blue-500' },
  { id: 'SCREENING', title: 'Скрининг', colorClass: 'border-t-indigo-500' },
  { id: 'TEST_TASK', title: 'Тестовое задание', colorClass: 'border-t-amber-500' },
  { id: 'INTERVIEW', title: 'Интервью', colorClass: 'border-t-purple-500' },
  { id: 'OFFER', title: 'Оффер', colorClass: 'border-t-emerald-500' },
  { id: 'REJECTED', title: 'Отказ', colorClass: 'border-t-rose-500' },
];

export function KanbanBoard({ applicants, onStatusChange }: KanbanBoardProps) {
  const [selectedApplicant, setSelectedApplicant] = React.useState<KanbanApplicant | null>(null);
  const [targetStatus, setTargetStatus] = React.useState<ApplicationStatus | null>(null);
  const [feedbackNote, setFeedbackNote] = React.useState('');

  const openMoveModal = (applicant: KanbanApplicant, nextStatus: ApplicationStatus) => {
    setSelectedApplicant(applicant);
    setTargetStatus(nextStatus);
    setFeedbackNote('');
  };

  const confirmMove = () => {
    if (selectedApplicant && targetStatus) {
      onStatusChange(selectedApplicant.id, targetStatus, feedbackNote);
      setSelectedApplicant(null);
      setTargetStatus(null);
      setFeedbackNote('');
    }
  };

  return (
    <div className="relative">
      {/* Сетка колонок Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApplicants = applicants.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col min-w-[280px] xl:min-w-0 rounded-xl bg-card/60 border border-border/70 border-t-4 ${col.colorClass} shadow-sm`}
            >
              {/* Шапка колонки */}
              <div className="p-3 border-b border-border/40 flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
                  {col.title}
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                  {colApplicants.length}
                </span>
              </div>

              {/* Карточки кандидатов в колонке */}
              <div className="p-2 space-y-2.5 flex-1 min-h-[300px]">
                {colApplicants.length > 0 ? (
                  colApplicants.map((applicant) => {
                    const nextAllowed = getNextAllowedStatuses(applicant.status);

                    return (
                      <Card
                        key={applicant.id}
                        className="p-3 bg-card border-border/70 hover:border-indigo-500/40 hover:shadow-md transition-all text-xs space-y-2"
                      >
                        {/* Имя и ВУЗ */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <span className="font-bold text-sm text-foreground block">
                              {applicant.candidateName}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3 w-3 text-indigo-500 shrink-0" />
                              {applicant.university}
                            </span>
                          </div>
                        </div>

                        {/* Академические сигналы */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <GpaBadge gpa={applicant.normalizedGpa} scale="SCALE_4" showDetails={false} />
                          <Badge variant="secondary" className="text-[10px] py-0">
                            {applicant.currentCourse} курс
                          </Badge>
                        </div>

                        <div className="text-[11px] font-medium text-foreground bg-accent/40 p-1.5 rounded">
                          {applicant.jobTitle}
                        </div>

                        {/* Сопроводительное письмо */}
                        {applicant.coverLetter && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 italic bg-muted/30 p-1.5 rounded">
                            «{applicant.coverLetter}»
                          </p>
                        )}

                        {/* Ссылка на решение тестового */}
                        {applicant.testSubmissionUrl && (
                          <Link
                            href={applicant.testSubmissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                          >
                            <Github className="h-3 w-3" />
                            Решение тестового задания
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}

                        {/* Фидбек наставника */}
                        {applicant.employerFeedback && (
                          <div className="p-1.5 rounded bg-indigo-50/50 dark:bg-indigo-950/30 text-[10px] text-muted-foreground border border-indigo-500/10">
                            <strong>Заметка:</strong> {applicant.employerFeedback}
                          </div>
                        )}

                        {/* Действия по смене статуса */}
                        {nextAllowed.length > 0 && (
                          <div className="pt-2 border-t border-border/40 flex flex-wrap gap-1">
                            {nextAllowed.map((next) => (
                              <Button
                                key={next}
                                variant={next === 'REJECTED' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => openMoveModal(applicant, next)}
                                className="h-6 text-[10px] px-2 py-0 flex-1"
                              >
                                {next === 'REJECTED' ? 'Отказ' : `→ ${STATUS_LABELS[next]}`}
                              </Button>
                            ))}
                          </div>
                        )}
                      </Card>
                    );
                  })
                ) : (
                  <div className="h-24 flex items-center justify-center text-[11px] text-muted-foreground border border-dashed border-border/50 rounded-lg">
                    Кандидатов нет
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно смены статуса и фиксации фидбека */}
      {selectedApplicant && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-base font-bold text-foreground">
                Смена этапа отбора кандидата
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedApplicant(null)}
                className="h-8 w-8 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs space-y-2">
              <p>
                Кандидат: <strong className="text-foreground">{selectedApplicant.candidateName}</strong>
              </p>
              <div className="flex items-center gap-2">
                <span>Перевод:</span>
                <ApplicationStatusBadge status={selectedApplicant.status} />
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <ApplicationStatusBadge status={targetStatus} />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label htmlFor="modalNote" className="font-semibold block text-foreground">
                Комментарий / Обратная связь кандидату:
              </label>
              <Textarea
                id="modalNote"
                rows={3}
                placeholder="Например: 'Тестовое задание принято, приглашаем на собеседование в Google Meet' или причина отказа..."
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApplicant(null)}
                className="text-xs"
              >
                Отмена
              </Button>
              <Button
                variant={targetStatus === 'REJECTED' ? 'destructive' : 'gradient'}
                size="sm"
                onClick={confirmMove}
                className="text-xs gap-1"
              >
                <Send className="h-3 w-3" />
                Подтвердить перевод
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
