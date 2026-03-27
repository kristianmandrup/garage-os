'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { EmptyState } from '@garageos/ui/empty-state';
import { cn } from '@garageos/ui/utils';
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

interface TasksListProps {
  tasks: Task[];
  loading: boolean;
  onTaskClick: (task: Task) => void;
  onMarkDone: (task: Task) => void;
}

const statusConfig = {
  todo: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Circle },
  in_progress: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  done: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
};

const priorityKeys = ['priorityUrgent', 'priorityHigh', 'priorityNormal', 'priorityLow', 'priorityLowest'] as const;

export function TasksList({ tasks, loading, onTaskClick, onMarkDone }: TasksListProps) {
  const t = useTranslation();

  const getPriorityLabel = (priority: number) => {
    return priorityKeys[priority] || 'priorityNormal';
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return t.tasks.todo;
      case 'in_progress': return t.tasks.inProgress;
      case 'done': return t.tasks.done;
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            title={t.tasks.noTasks}
            description={t.tasks.noTasksDescription}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo;
        const priorityKey = getPriorityLabel(task.priority);
        const StatusIcon = status.icon;

        return (
          <Card
            key={task.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onTaskClick(task)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.status !== 'done') {
                      onMarkDone(task);
                    }
                  }}
                  disabled={task.status === 'done'}
                  className="mt-0.5 shrink-0"
                >
                  <StatusIcon
                    className={`h-6 w-6 ${
                      task.status === 'done'
                        ? 'text-emerald-500'
                        : 'text-slate-400 hover:text-blue-500'
                    }`}
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-medium ${
                      task.status === 'done' ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <Badge className={status.color} variant="secondary">
                      {getStatusLabel(task.status)}
                    </Badge>
                    <span className={`text-xs ${
                      task.priority === 0 ? 'text-red-600 dark:text-red-400' :
                      task.priority === 1 ? 'text-orange-600 dark:text-orange-400' :
                      'text-slate-600 dark:text-slate-400'
                    }`}>
                      {t.tasks[priorityKey]}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {task.assignee && (
                      <span>{t.tasks.assignee}: {task.assignee.name}</span>
                    )}
                    {task.due_date && (
                      <span>{t.tasks.dueDate}: {new Date(task.due_date).toLocaleDateString()}</span>
                    )}
                    <span>{getTimeAgo(task.created_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
