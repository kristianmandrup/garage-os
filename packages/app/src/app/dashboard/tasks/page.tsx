'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { CheckCircle, Circle, Clock, ExternalLink, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { EmptyState } from '@garageos/ui/empty-state';
import { useToast } from '@garageos/ui';

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

const statusConfig = {
  todo: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Circle },
  in_progress: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  done: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
};

const priorityKeys = ['priorityUrgent', 'priorityHigh', 'priorityNormal', 'priorityLow', 'priorityLowest'] as const;
type PriorityKey = typeof priorityKeys[number];

function getPriorityLabel(priority: number): PriorityKey {
  return priorityKeys[priority] || 'priorityNormal';
}

export default function TasksPage() {
  const t = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'all' ? `/api/tasks?status=${statusFilter}` : '/api/tasks';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      addToast({
        title: t.errors.generic,
        description: t.errors.networkError,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (task: Task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_done' }),
      });

      if (res.ok) {
        setTasks(tasks.map(t =>
          t.id === task.id ? { ...t, status: 'done' as const } : t
        ));
        addToast({
          title: t.tasks.done,
          description: task.title,
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to mark task as done:', error);
      addToast({
        title: t.errors.generic,
        description: t.errors.networkError,
        variant: 'destructive',
      });
    }
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

  const getLinkedEntityLabel = (type: string) => {
    switch (type) {
      case 'job_card': return t.jobCard.title;
      case 'invoice': return t.invoice.title;
      case 'reminder': return t.reminder.title;
      case 'low_stock': return 'Low Stock';
      default: return type;
    }
  };

  const statusTabs = [
    { value: 'all', label: t.tasks.all },
    { value: 'todo', label: t.tasks.todo },
    { value: 'in_progress', label: t.tasks.inProgress },
    { value: 'done', label: t.tasks.done },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.tasks.title}</h1>
          <p className="text-muted-foreground">
            {t.tasks.description}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map(tab => (
          <Button
            key={tab.value}
            variant={statusFilter === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title={t.tasks.noTasks}
              description={t.tasks.noTasksDescription}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => {
            const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo;
            const priorityKey = getPriorityLabel(task.priority);
            const StatusIcon = status.icon;

            return (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task.status !== 'done') {
                          handleMarkDone(task);
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
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">{selectedTask.title}</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={statusConfig[selectedTask.status as keyof typeof statusConfig]?.color}>
                    {getStatusLabel(selectedTask.status)}
                  </Badge>
                  <span className={`text-sm ${
                    selectedTask.priority === 0 ? 'text-red-600 dark:text-red-400' :
                    selectedTask.priority === 1 ? 'text-orange-600 dark:text-orange-400' :
                    'text-slate-600 dark:text-slate-400'
                  }`}>
                    {t.tasks[getPriorityLabel(selectedTask.priority)]}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTask(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTask.description && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.descriptionLabel}</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              )}

              {selectedTask.assignee && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.assignee}</h4>
                  <p className="text-sm">{selectedTask.assignee.name}</p>
                </div>
              )}

              {selectedTask.due_date && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.dueDate}</h4>
                  <p className="text-sm">{new Date(selectedTask.due_date).toLocaleDateString()}</p>
                </div>
              )}

              {selectedTask.linked_entity_type && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">{t.tasks.linkedTo}</h4>
                  <p className="text-sm capitalize">
                    {getLinkedEntityLabel(selectedTask.linked_entity_type)}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t flex gap-2">
                {selectedTask.status !== 'done' && (
                  <Button
                    onClick={() => handleMarkDone(selectedTask)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t.tasks.markDone}
                  </Button>
                )}
                {process.env.NEXT_PUBLIC_TASKMASTER_URL && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_TASKMASTER_URL}/tasks/${selectedTask.taskmaster_id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t.tasks.openInTaskMaster}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
