import * as React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProfileCompletenessResult } from '@/server/services/student-profile-service';

export interface ProfileCompletenessCardProps {
  completeness: ProfileCompletenessResult;
  onEditClick?: () => void;
}

export function ProfileCompletenessCard({
  completeness,
  onEditClick,
}: ProfileCompletenessCardProps) {
  const isComplete = completeness.score >= 90;

  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardContent className="p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Заполненность резюме
          </span>
          <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
            {completeness.score}%
          </span>
        </div>

        <Progress
          value={completeness.score}
          className="h-1.5 bg-muted"
          indicatorClassName={isComplete ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'}
        />

        {completeness.recommendations.length > 0 ? (
          <p className="text-[11px] text-muted-foreground leading-tight pt-0.5 truncate">
            Совет: {completeness.recommendations[0]}
          </p>
        ) : (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            Резюме полностью заполнено
          </p>
        )}
      </CardContent>
    </Card>
  );
}
