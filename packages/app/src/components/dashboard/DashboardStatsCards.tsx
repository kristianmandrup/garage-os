'use client';

import { Wrench, Car, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface DashboardStatsCardsProps {
  stats: {
    activeJobs: number;
    totalVehicles: number;
    totalCustomers: number;
    lowStockCount: number;
  };
  loading: boolean;
}

const iconMap = { Wrench, Car, Users, AlertCircle };
const colorMap = ['blue', 'emerald', 'purple', 'amber'] as const;
const keyMap = ['activeJobs', 'totalVehicles', 'totalCustomers', 'lowStockItems'] as const;

export function DashboardStatsCards({ stats, loading }: DashboardStatsCardsProps) {
  const t = useTranslation();

  const statCards = [
    { key: 'activeJobs' as const, value: stats.activeJobs, icon: Wrench, color: 'blue' },
    { key: 'totalVehicles' as const, value: stats.totalVehicles, icon: Car, color: 'emerald' },
    { key: 'totalCustomers' as const, value: stats.totalCustomers, icon: Users, color: 'purple' },
    { key: 'lowStockItems' as const, value: stats.lowStockCount, icon: AlertCircle, color: stats.lowStockCount > 0 ? 'red' : 'amber' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.key} className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                  stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                  'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
              <p className="text-sm text-muted-foreground">{t.dashboard[stat.key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
