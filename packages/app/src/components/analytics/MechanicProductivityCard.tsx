'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface Mechanic {
  id: string;
  name: string;
  completed: number;
  inProgress: number;
  totalHours: number;
}

interface MechanicProductivityCardProps {
  mechanics: Mechanic[];
}

export function MechanicProductivityCard({ mechanics }: MechanicProductivityCardProps) {
  const t = useTranslation();

  if (mechanics.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analytics.mechanicProductivity}</CardTitle>
        <CardDescription>{t.analytics.jobsCompletedHours}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mechanics.map((mechanic) => (
            <div key={mechanic.id} className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium">{mechanic.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{mechanic.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {mechanic.inProgress} {t.analytics.inProgress}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{mechanic.completed}</p>
                  <p className="text-xs text-muted-foreground">{t.analytics.completed}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{mechanic.totalHours.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{t.analytics.hours}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {mechanic.completed > 0 ? (mechanic.totalHours / mechanic.completed).toFixed(1) : 0}h
                  </p>
                  <p className="text-xs text-muted-foreground">{t.analytics.avgPerJob}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
