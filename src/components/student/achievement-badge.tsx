import * as React from 'react';
import Link from 'next/link';
import { Trophy, BookOpen, Presentation, Code, Award, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AchievementType } from '@prisma/client';

export interface AchievementBadgeProps {
  type: AchievementType;
  title: string;
  description?: string | null;
  year: number;
  verificationUrl?: string | null;
}

const TYPE_CONFIG: Record<
  AchievementType,
  { label: string; icon: React.ElementType; variant: 'academic' | 'honors' | 'tech' | 'secondary' }
> = {
  OLYMPIAD: { label: 'Олимпиада', icon: Trophy, variant: 'academic' },
  PUBLICATION: { label: 'Публикация', icon: BookOpen, variant: 'honors' },
  CONFERENCE: { label: 'Конференция', icon: Presentation, variant: 'honors' },
  HACKATHON: { label: 'Хакатон', icon: Code, variant: 'tech' },
  SCHOLARSHIP: { label: 'Именная стипендия', icon: Award, variant: 'academic' },
  HONOR: { label: 'Отличие', icon: Award, variant: 'academic' },
};

export function AchievementBadge({
  type,
  title,
  description,
  year,
  verificationUrl,
}: AchievementBadgeProps) {
  const config = TYPE_CONFIG[type] || {
    label: 'Достижение',
    icon: Award,
    variant: 'secondary' as const,
  };
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card/60 hover:border-indigo-500/30 transition-colors">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground mt-0.5">
        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Badge variant={config.variant} className="text-[10px] py-0 px-2">
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{year} г.</span>
          {verificationUrl && (
            <Link
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 ml-auto"
            >
              Подтверждение
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
        <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
