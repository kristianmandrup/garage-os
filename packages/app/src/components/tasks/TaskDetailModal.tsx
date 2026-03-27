'use client';

import { X, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { useTranslation } from '@/i18n';

interface Task {
  id: string;
  taskmaster_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: number;
  due_date: string | null;
  linked_entity_type: string | null;
  linked_entity_id: string | null;
  taskmaster_assignee_id: string | null;
  garageos_assignee_id: string | null;
  assignee: { name: string } | null;
  created_at: string;
  updated_at: string;
}

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onMarkDone: (task: Task) => void;
}

const statusConfig = {
  todo: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  in_progress: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  done: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const priorityKeys = ['priorityUrgent', 'priorityHigh', 'priorityNormal', 'priorityLow', 'priorityLowest'] as const;

export function TaskDetailModal({ task, onClose, onMarkDone }: TaskDetailModalProps) {
  const t = useTranslation();

  if (!task) return null;

  const getPriorityLabel = (priority: number) => {
    return priorityKeys[priority] || 'priorityNormal';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return t.tasks.todo;
      case 'in_progress': return t.tasks.inProgress;
      case 'done': return t.tasks.done;
      default: return status;
    }
  };

  const getLinkedEntityLabel = (type: string) => {
    switch (type) {
      case 'job_card': return t.jobCard.title;
      case 'invoice': return t.invoice.title;
      case 'reminder': return t.reminder.title;
      case 'low_stock': return 'Low Stock';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusConfig[task.status as keyof typeof statusConfig]?.color}>
                {getStatusLabel(task.status)}
              </Badge>
              <span className={`text-sm ${
                task.priority === 0 ? 'text-red-600 dark:text-red-400' :
                task.priority === 1 ? 'text-orange-600 dark:text-orange-400' :
                'text-slate-600 dark:text-slate-400'
              }`}>
                {t.tasks[getPriorityLabel(task.priority)]}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {task.description && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-sm whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {task.assignee && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.assignee}</h4>
              <p className="text-sm">{task.assignee.name}</p>
            </div>
          )}

          {task.due_date && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.dueDate}</h4>
              <p className="text-sm">{new Date(task.due_date).toLocaleDateString()}</p>
            </div>
          )}

          {task.linked_entity_type && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.linkedTo}</h4>
              <p className="text-sm capitalize">
                {getLinkedEntityLabel(task.linked_entity_type)}
              </p>
            </div>
          )}

          <div className="pt-4 border-t flex gap-2">
            {task.status !== 'done' && (
              <Button
                onClick={() => onMarkDone(task)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t.tasks.markDone}
              </Button>
            )}
            {process.env.NEXT_PUBLIC_TASKMASTER_URL && (
              <Button
                variant="outline"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_TASKMASTER_URL}/tasks/${task.taskmaster_id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t.tasks.openInTaskMaster}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
