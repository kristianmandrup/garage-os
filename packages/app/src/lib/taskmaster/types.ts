// TaskMaster type definitions

export interface TaskMasterConfig {
  apiUrl: string;
  apiKey: string;
  defaultProjectId: string;
}

export interface TaskMasterTask {
  id?: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority?: 0 | 1 | 2 | 3 | 4;
  dueDate?: string;
}

export interface TaskMasterResponse {
  success: boolean;
  task?: TaskMasterTask;
  error?: string;
}

export interface TaskMasterWebhookPayload {
  event: 'task.created' | 'task.updated' | 'task.status_changed' | 'task.deleted';
  task: {
    id: string;
    projectId?: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority?: 0 | 1 | 2 | 3 | 4;
    dueDate?: string;
    assigneeId?: string;
    assigneeEmail?: string;
    linkedEntityType?: 'job_card' | 'invoice' | 'reminder' | 'low_stock';
    linkedEntityId?: string;
  };
  shopId: string;
}
