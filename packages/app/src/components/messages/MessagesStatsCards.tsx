'use client';

import { Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface Message {
  status: string;
}

interface MessagesStatsCardsProps {
  messages: Message[];
  loading: boolean;
}

export function MessagesStatsCards({ messages, loading }: MessagesStatsCardsProps) {
  const t = useTranslation();

  const statCards = [
    { labelKey: 'totalSent' as const, value: messages.length, icon: Send, color: 'blue' },
    { labelKey: 'delivered' as const, value: messages.filter(m => ['delivered', 'read'].includes(m.status)).length, icon: CheckCircle, color: 'emerald' },
    { labelKey: 'pending' as const, value: messages.filter(m => m.status === 'pending').length, icon: Clock, color: 'amber' },
    { labelKey: 'failed' as const, value: messages.filter(m => m.status === 'failed').length, icon: XCircle, color: 'red' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.labelKey}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                <p className="text-sm text-muted-foreground">{t.message[stat.labelKey]}</p>
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
