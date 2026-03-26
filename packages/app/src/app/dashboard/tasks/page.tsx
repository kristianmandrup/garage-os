'use client';

import { useState, useEffect } from 'react';
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
  todo: { label: 'รอดำเนินการ', labelEn: 'To Do', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Circle },
  in_progress: { label: 'กำลังดำเนินการ', labelEn: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  done: { label: 'เสร็จสิ้น', labelEn: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
};

const priorityConfig = {
  0: { label: 'ฉุกเฉิน', labelEn: 'Urgent', color: 'text-red-600 dark:text-red-400' },
  1: { label: 'สูง', labelEn: 'High', color: 'text-orange-600 dark:text-orange-400' },
  2: { label: 'ปกติ', labelEn: 'Normal', color: 'text-blue-600 dark:text-blue-400' },
  3: { label: 'ต่ำ', labelEn: 'Low', color: 'text-slate-600 dark:text-slate-400' },
  4: { label: 'ต่ำสุด', labelEn: 'Lowest', color: 'text-slate-400' },
};

export default function TasksPage() {
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
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถดึงข้อมูลงานได้',
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
          title: 'งานเสร็จสิ้น',
          description: task.title,
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Failed to mark task as done:', error);
      addToast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัปเดตงานได้',
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

    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    return `${diffDays} วันที่แล้ว`;
  };

  const statusTabs = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'todo', label: 'รอดำเนินการ' },
    { value: 'in_progress', label: 'กำลังดำเนินการ' },
    { value: 'done', label: 'เสร็จสิ้น' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">งานที่ต้องทำ</h1>
          <p className="text-muted-foreground">
            งานที่ซิงค์จาก TaskMaster
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
              title="ไม่มีงาน"
              description="ยังไม่มีงานที่ซิงค์จาก TaskMaster"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => {
            const status = statusConfig[task.status] || statusConfig.todo;
            const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig[2];
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
                          {status.label}
                        </Badge>
                        <span className={`text-xs ${priority.color}`}>
                          {priority.label}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {task.assignee && (
                          <span>ผู้รับผิดชอบ: {task.assignee.name}</span>
                        )}
                        {task.due_date && (
                          <span>กำหนด: {new Date(task.due_date).toLocaleDateString('th-TH')}</span>
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
                  <Badge className={statusConfig[selectedTask.status]?.color}>
                    {statusConfig[selectedTask.status]?.label}
                  </Badge>
                  <span className={`text-sm ${priorityConfig[selectedTask.priority as keyof typeof priorityConfig]?.color}`}>
                    {priorityConfig[selectedTask.priority as keyof typeof priorityConfig]?.label}
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
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">รายละเอียด</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              )}

              {selectedTask.assignee && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">ผู้รับผิดชอบ</h4>
                  <p className="text-sm">{selectedTask.assignee.name}</p>
                </div>
              )}

              {selectedTask.due_date && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">กำหนดส่ง</h4>
                  <p className="text-sm">{new Date(selectedTask.due_date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              )}

              {selectedTask.linked_entity_type && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">ลิงก์กับ</h4>
                  <p className="text-sm capitalize">
                    {selectedTask.linked_entity_type === 'job_card' ? 'ใบงาน' :
                     selectedTask.linked_entity_type === 'invoice' ? 'ใบแจ้งหนี้' :
                     selectedTask.linked_entity_type === 'reminder' ? 'การแจ้งเตือน' :
                     selectedTask.linked_entity_type === 'low_stock' ? 'สินค้าใกล้หมด' :
                     selectedTask.linked_entity_type}
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
                    ทำเครื่องหมายเสร็จสิ้น
                  </Button>
                )}
                {process.env.NEXT_PUBLIC_TASKMASTER_URL && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_TASKMASTER_URL}/tasks/${selectedTask.taskmaster_id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    เปิดใน TaskMaster
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
