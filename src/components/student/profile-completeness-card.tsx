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
    <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-50/50 via-card to-card dark:from-indigo-950/20 dark:via-card dark:to-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Индекс академического резюме
          </CardTitle>
          <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
            {completeness.score}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress
          value={completeness.score}
          className="h-2.5 bg-indigo-100 dark:bg-indigo-950/60"
          indicatorClassName={isComplete ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'}
        />

        {completeness.recommendations.length > 0 ? (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-muted-foreground">
              Рекомендации для повышения шансов на отклик:
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {completeness.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-1">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Ваш профиль максимально заполнен и готов к просмотру работодателями!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
