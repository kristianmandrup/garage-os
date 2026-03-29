// TaskMaster API Integration
// Barrel re-export for backward compatibility
// Individual modules: types, config, client, events, webhook, helpers

export type { TaskMasterConfig, TaskMasterTask, TaskMasterResponse, TaskMasterWebhookPayload } from './types';
export { DEFAULT_API_URL, getTaskMasterConfigFromEnv, isTaskMasterEnabled } from './config';
export { TaskMasterService, taskmasterService } from './client';
export { createTaskForJobCard, createTaskForInvoice, createTaskForReminder, createTaskForLowStock } from './events';
export { syncTaskFromWebhook } from './webhook';
export { updateTaskStatus, getTask } from './helpers';
