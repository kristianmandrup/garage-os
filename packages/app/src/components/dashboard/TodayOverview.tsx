'use client';

import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface TodayOverviewProps {
  activeJobs: number;
  completedToday: number;
  pendingApprovals: number;
}

export function TodayOverview({ activeJobs, completedToday, pendingApprovals }: TodayOverviewProps) {
  const t = useTranslation();
  const items = [
    { icon: Clock, label: t.dashboard.inProgressLabel, value: activeJobs, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { icon: CheckCircle, label: t.dashboard.completedToday, value: completedToday, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { icon: AlertCircle, label: t.dashboard.needsApproval, value: pendingApprovals, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  return (
    <div className="flex items-center gap-6 p-4 rounded-xl bg-card border border-border overflow-x-auto">
      <div className="flex items-center gap-2 shrink-0">
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t.dashboard.today}</span>
      </div>
      <div className="h-8 w-px bg-border shrink-0" />
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 shrink-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
