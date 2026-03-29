// TaskMaster configuration helpers

import type { TaskMasterConfig } from './types';

// Default TaskMaster API URL (assumes same instance or configurable)
export const DEFAULT_API_URL = process.env.TASKMASTER_API_URL || 'https://taskmaster.vercel.app';

// Helper to get config from environment or shop settings
export function getTaskMasterConfigFromEnv(): TaskMasterConfig | null {
  const apiUrl = process.env.TASKMASTER_API_URL;
  const apiKey = process.env.TASKMASTER_API_KEY;
  const projectId = process.env.TASKMASTER_DEFAULT_PROJECT_ID;

  if (apiUrl && apiKey && projectId) {
    return { apiUrl, apiKey, defaultProjectId: projectId };
  }

  return null;
}

// Check if TaskMaster integration is enabled
export function isTaskMasterEnabled(): boolean {
  return getTaskMasterConfigFromEnv() !== null;
}
