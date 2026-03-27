'use client';

import { useTranslation } from '@/i18n';

interface ReminderFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function ReminderFilters({ statusFilter, onStatusChange }: ReminderFiltersProps) {
  const t = useTranslation();

  return (
    <select
      value={statusFilter}
      onChange={(e) => onStatusChange(e.target.value)}
      className="h-10 px-3 rounded-md border border-input bg-background text-sm"
    >
      <option value="">{t.reminder.allStatus}</option>
      <option value="pending">{t.reminder.statuses.pending}</option>
      <option value="sent">{t.reminder.statuses.sent}</option>
      <option value="completed">{t.reminder.statuses.completed}</option>
      <option value="cancelled">{t.reminder.statuses.cancelled}</option>
    </select>
  );
}
