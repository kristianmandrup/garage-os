'use client';

import { Bell, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface RemindersStatsCardsProps {
  loading: boolean;
  totalReminders: number;
  dueToday: number;
  overdue: number;
  completed: number;
}

export function RemindersStatsCards({
  loading,
  totalReminders,
  dueToday,
  overdue,
  completed,
}: RemindersStatsCardsProps) {
  const t = useTranslation();

  const statCards = [
    { labelKey: 'totalReminders' as const, value: totalReminders, icon: Bell, color: 'blue' },
    { labelKey: 'dueToday' as const, value: dueToday, icon: Calendar, color: 'amber' },
    { labelKey: 'overdue' as const, value: overdue, icon: AlertTriangle, color: 'red' },
    { labelKey: 'completed' as const, value: completed, icon: CheckCircle, color: 'emerald' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.labelKey}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                <p className="text-sm text-muted-foreground">{t.reminder[stat.labelKey]}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <stat.icon className={`h-5 w-5 ${
                  stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                  stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-600 dark:text-red-400'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
