'use client';

import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface TasksStatusTabsProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function TasksStatusTabs({ statusFilter, onStatusChange }: TasksStatusTabsProps) {
  const t = useTranslation();

  const statusTabs = [
    { value: 'all', label: t.tasks.all },
    { value: 'todo', label: t.tasks.todo },
    { value: 'in_progress', label: t.tasks.inProgress },
    { value: 'done', label: t.tasks.done },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {statusTabs.map(tab => (
        <Button
          key={tab.value}
          variant={statusFilter === tab.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
