// TaskMaster webhook handling

import type { TaskMasterWebhookPayload } from './types';

// Sync task from webhook (called after local DB update)
export async function syncTaskFromWebhook(payload: TaskMasterWebhookPayload): Promise<void> {
  // This function can be extended to sync with external systems
  // or trigger real-time updates via WebSockets/SSE
  console.log(`TaskMaster webhook synced: ${payload.event} - ${payload.task.id}`);
}
