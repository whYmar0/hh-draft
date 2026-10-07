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
    <div className={cn('inline-flex items-center gap-1.5 flex-wrap', className)}>
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1 shadow-2xs text-xs">
        <Award className="h-3.5 w-3.5 text-indigo-500" />
        <span className="font-semibold text-foreground">
          GPA {gpa.toFixed(2)}
        </span>
        <span className="text-muted-foreground text-[11px]">/ {maxScale}</span>
      </div>

      {showDetails && badgeInfo.tier === 'HIGH_HONORS' && (
        <Badge variant="academic" className="text-[10px] py-0.5 px-2">
          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500 mr-1" />
          {badgeInfo.label}
        </Badge>
      )}

      {showDetails && badgeInfo.tier === 'HONORS' && (
        <Badge variant="honors" className="text-[10px] py-0.5 px-2">
          {badgeInfo.label}
        </Badge>
      )}
    </div>
  );
}
