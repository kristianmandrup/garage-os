'use client';

import { Badge } from '@garageos/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { useTranslation } from '@/i18n';

const STATUS_COLORS: Record<string, string> = {
  inspection: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  diagnosed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  parts_ordered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  pending_approval: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
};

interface JobsByStatusCardProps {
  byStatus: Record<string, number>;
  total: number;
}

export function JobsByStatusCard({ byStatus, total }: JobsByStatusCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analytics.jobStatusDistribution}</CardTitle>
        <CardDescription>{t.analytics.currentJobBreakdown}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(byStatus).map(([status, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const statusKey = status.replace('_', '') as keyof typeof t.jobCards.detail.statuses;
            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Badge className={cn(STATUS_COLORS[status] || 'bg-slate-100')}>
                    {t.jobCards.detail.statuses[statusKey] || status}
                  </Badge>
                  <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', STATUS_COLORS[status]?.replace('bg-', 'bg-').replace('text-', 'text-') || 'bg-slate-500')}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
