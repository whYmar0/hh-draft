import * as React from 'react';
import { Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getGpaBadge, GpaScale } from '@/lib/gpa';
import { cn } from '@/lib/utils';

export interface GpaBadgeProps {
  gpa: number;
  scale?: GpaScale;
  showDetails?: boolean;
  className?: string;
}

export function GpaBadge({
  gpa,
  scale = 'SCALE_5',
  showDetails = true,
  className,
}: GpaBadgeProps) {
  const badgeInfo = getGpaBadge(gpa, scale);
  const maxScale = scale === 'SCALE_5' ? '5.0' : '4.0';

  return (
    <div className={cn('inline-flex items-center gap-2 flex-wrap', className)}>
      <div className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1 shadow-sm">
        <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span className="font-semibold text-sm tracking-tight text-foreground">
          GPA {gpa.toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">/ {maxScale}</span>
      </div>

      {showDetails && badgeInfo.tier === 'HIGH_HONORS' && (
        <Badge variant="academic" className="gap-1">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {badgeInfo.label}
        </Badge>
      )}

      {showDetails && badgeInfo.tier === 'HONORS' && (
        <Badge variant="honors" className="gap-1">
          <Award className="h-3 w-3" />
          {badgeInfo.label}
        </Badge>
      )}
    </div>
  );
}
