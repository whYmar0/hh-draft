import * as React from 'react';
import {
  Clock,
  Search,
  FileCode2,
  CalendarCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus, STATUS_LABELS } from '@/server/services/application-state-machine';
import { cn } from '@/lib/utils';

export interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showIcon?: boolean;
}

const STATUS_STYLE_CONFIG: Record<
  ApplicationStatus,
  {
    icon: React.ElementType;
    badgeVariant: 'default' | 'secondary' | 'honors' | 'academic' | 'destructive' | 'tech';
    customClasses?: string;
  }
> = {
  NEW: {
    icon: Clock,
    badgeVariant: 'secondary',
    customClasses:
      'border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500/30',
  },
  SCREENING: {
    icon: Search,
    badgeVariant: 'tech',
    customClasses:
      'border-indigo-500/20 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-500/30',
  },
  TEST_TASK: {
    icon: FileCode2,
    badgeVariant: 'academic',
    customClasses:
      'border-amber-500/30 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30',
  },
  INTERVIEW: {
    icon: CalendarCheck,
    badgeVariant: 'default',
    customClasses:
      'border-purple-500/20 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-500/30',
  },
  OFFER: {
    icon: CheckCircle2,
    badgeVariant: 'honors',
    customClasses:
      'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold',
  },
  REJECTED: {
    icon: XCircle,
    badgeVariant: 'destructive',
    customClasses: 'opacity-85',
  },
};

export function ApplicationStatusBadge({
  status,
  className,
  showIcon = true,
}: ApplicationStatusBadgeProps) {
  const config = STATUS_STYLE_CONFIG[status] || STATUS_STYLE_CONFIG.NEW;
  const Icon = config.icon;
  const label = STATUS_LABELS[status] || status;

  return (
    <Badge
      variant={config.badgeVariant}
      className={cn('gap-1 text-xs py-0.5 px-2.5', config.customClasses, className)}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{label}</span>
    </Badge>
  );
}
