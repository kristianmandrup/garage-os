// TaskMaster standalone helper wrappers

import type { TaskMasterResponse } from './types';
import { getTaskMasterConfigFromEnv } from './config';
import { taskmasterService } from './client';

// Update task status and sync back to TaskMaster
export async function updateTaskStatus(
  taskId: string,
  status: 'todo' | 'in_progress' | 'done'
): Promise<TaskMasterResponse> {
  const config = getTaskMasterConfigFromEnv();
  if (!config) {
    return { success: false, error: 'TaskMaster not configured' };
  }

  taskmasterService.configure(config);
  return taskmasterService.updateTask(taskId, { status });
}

// Get single task from TaskMaster
export async function getTask(taskId: string): Promise<TaskMasterResponse> {
  const config = getTaskMasterConfigFromEnv();
  if (!config) {
    return { success: false, error: 'TaskMaster not configured' };
  }

  taskmasterService.configure(config);
  return taskmasterService.getTask(taskId);
}
