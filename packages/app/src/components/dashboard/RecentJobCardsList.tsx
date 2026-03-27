'use client';

import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation, useLocale } from '@/i18n';
import { formatRelativeTime } from '@/i18n';

interface RecentJobCardsListProps {
  recentJobs: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
    vehicle: { license_plate: string; brand: string; model: string };
  }>;
  loading: boolean;
}

const statusConfig: Record<string, { labelKey: string; color: string; icon: typeof Wrench }> = {
  inspection: { labelKey: 'inspection', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Wrench },
  diagnosed: { labelKey: 'diagnosed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Wrench },
  parts_ordered: { labelKey: 'partsOrdered', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Wrench },
  in_progress: { labelKey: 'inProgress', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Wrench },
  pending_approval: { labelKey: 'pendingApproval', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: Wrench },
  completed: { labelKey: 'completed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: Wrench },
  cancelled: { labelKey: 'cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', icon: Wrench },
};

export function RecentJobCardsList({ recentJobs, loading }: RecentJobCardsListProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    return formatRelativeTime(date, locale, t.dateTime);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t.dashboard.recentJobCards}</CardTitle>
          <CardDescription>{t.dashboard.welcome}</CardDescription>
        </div>
        <Link href="/dashboard/job-cards">
          <Button variant="ghost" size="sm">
            {t.dashboard.viewAll}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t.dashboard.noJobCards}</p>
            <Link href="/dashboard/job-cards/new" className="mt-2 inline-block">
              <Button size="sm">{t.dashboard.createFirstJobCard}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => {
              const status = statusConfig[job.status] || statusConfig.inspection;
              return (
                <Link key={job.id} href={`/dashboard/job-cards/${job.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.vehicle?.brand} {job.vehicle?.model} - {job.vehicle?.license_plate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.color}>
                        <status.icon className="h-3 w-3 mr-1" />
                        {t.dashboard.statuses[status.labelKey as keyof typeof t.dashboard.statuses]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(job.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
