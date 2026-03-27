'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { useToast } from '@garageos/ui';
import {
  TasksHeader,
  TasksStatusTabs,
  TasksList,
  TaskDetailModal,
} from '@/components/tasks';

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

export default function TasksPage() {
  const t = useTranslation();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
        setSelectedTask(null);
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

  return (
    <div className="space-y-6">
      <TasksHeader />
      <TasksStatusTabs statusFilter={statusFilter} onStatusChange={setStatusFilter} />
      <TasksList
        tasks={tasks}
        loading={loading}
        onTaskClick={setSelectedTask}
        onMarkDone={handleMarkDone}
      />
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onMarkDone={handleMarkDone}
      />
    </div>
  );
}
