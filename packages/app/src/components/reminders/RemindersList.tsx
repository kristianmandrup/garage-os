'use client';

import { Bell, Car, User, Phone } from 'lucide-react';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { Card, CardContent } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { useTranslation, useLocale, formatDateOnly } from '@/i18n';

interface Vehicle {
  license_plate: string;
}

interface Customer {
  name: string;
  phone: string | null;
}

interface Reminder {
  id: string;
  vehicle_id: string;
  customer_id: string;
  reminder_type: string;
  description: string;
  due_date: string;
  status: string;
  vehicle?: Vehicle;
  customer?: Customer;
}

interface RemindersListProps {
  reminders: Reminder[];
  loading: boolean;
  onMarkComplete: (id: string) => void;
  onCreateNew: () => void;
}

const STATUS_CONFIG = {
  pending: { labelKey: 'pending', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Bell },
  sent: { labelKey: 'sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Bell },
  completed: { labelKey: 'completed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: Bell },
  cancelled: { labelKey: 'cancelled', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: Bell },
};

const REMINDER_TYPE_KEYS: Record<string, 'oilChange' | 'tireRotation' | 'inspection' | 'insurance' | 'custom'> = {
  oil_change: 'oilChange',
  tire_rotation: 'tireRotation',
  inspection: 'inspection',
  insurance: 'insurance',
  custom: 'custom',
};

export function RemindersList({ reminders, loading, onMarkComplete, onCreateNew }: RemindersListProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t.reminder.noRemindersYet}</h3>
          <p className="text-muted-foreground mb-4">
            {t.reminder.createFirstReminder}
          </p>
          <Button onClick={onCreateNew}>
            <Bell className="h-4 w-4 mr-2" />
            {t.reminder.newReminder}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {reminders.map((reminder) => {
            const status = STATUS_CONFIG[reminder.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
            const isOverdue = new Date(reminder.due_date) < new Date() && reminder.status === 'pending';
            const typeKey = REMINDER_TYPE_KEYS[reminder.reminder_type] || 'custom';

            return (
              <div key={reminder.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'
                    )}>
                      <Bell className={cn('h-5 w-5', isOverdue ? 'text-red-600' : 'text-muted-foreground')} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{t.reminder.types[typeKey]}</p>
                        <Badge className={cn('text-xs', status.color)}>
                          <status.icon className="h-3 w-3 mr-1" />
                          {t.reminder.statuses[status.labelKey as keyof typeof t.reminder.statuses]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reminder.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {reminder.vehicle?.license_plate}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {reminder.customer?.name}
                        </span>
                        {reminder.customer?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {reminder.customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm',
                      isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                    )}>
                      {isOverdue ? `${t.reminder.overdueLabel} ` : ''} {formatDateOnly(new Date(reminder.due_date), locale)}
                    </span>
                    {reminder.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkComplete(reminder.id)}
                      >
                        {t.reminder.markComplete}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
