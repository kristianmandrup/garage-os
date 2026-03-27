'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { TrendingUp, Users } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface CustomerGrowthCardProps {
  retention: {
    total: number;
    returning: number;
    rate: number;
  };
}

export function CustomerGrowthCard({ retention }: CustomerGrowthCardProps) {
  const t = useTranslation();
  const newCustomers = retention.total - retention.returning;

  const segments = [
    { label: 'Returning', value: retention.returning, color: 'bg-emerald-500' },
    { label: 'New', value: newCustomers, color: 'bg-blue-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Customer Growth
        </CardTitle>
        <CardDescription>New vs returning customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Donut-style visualization */}
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  strokeWidth="3"
                  strokeDasharray={`${retention.rate} ${100 - retention.rate}`}
                  strokeLinecap="round"
                  className="text-emerald-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{retention.rate}%</span>
                <span className="text-xs text-muted-foreground">Retention</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4">
            {segments.map(seg => (
              <div key={seg.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${seg.color}`} />
                <div>
                  <p className="text-sm font-medium">{seg.value}</p>
                  <p className="text-xs text-muted-foreground">{seg.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
