# TaskMaster Integration Guide

## Overview

GarageOS integrates with TaskMaster to synchronize tasks. When garage events occur (job cards, invoices), tasks are created in TaskMaster. TaskMaster can then push updates back to GarageOS via webhooks.

## Quick Start

### 1. Environment Variables

Add these to `packages/app/.env.local`:

```env
# Required for webhook signature validation (generate with: openssl rand -hex 32)
TASKMASTER_WEBHOOK_SECRET=your-60-char-secret-here

# TaskMaster API credentials (from TaskMaster dashboard)
TASKMASTER_API_URL=https://taskmaster.vercel.app
TASKMASTER_API_KEY=your-api-key
TASKMASTER_DEFAULT_PROJECT_ID=your-default-project-id

# Public URL for "Open in TaskMaster" links in UI
NEXT_PUBLIC_TASKMASTER_URL=https://taskmaster.vercel.app
```

### 2. Database Migration

The migration was pushed to Supabase in `supabase/migrations/0002_add_taskmaster_tables.sql`. It creates:

- `taskmaster_tasks` - Sync table storing TaskMaster tasks locally
- `taskmaster_user_mappings` - Maps TaskMaster users to GarageOS users

### 3. Configure TaskMaster

In your TaskMaster dashboard, add a webhook:

```
URL: https://your-garageos-domain.com/api/webhooks/taskmaster
Secret: <same as TASKMASTER_WEBHOOK_SECRET>
Events: task.created, task.updated, task.status_changed, task.deleted
```

### 4. Link Users

Insert user mappings to connect GarageOS users with TaskMaster users:

```sql
INSERT INTO taskmaster_user_mappings (shop_id, garageos_user_id, taskmaster_user_id, taskmaster_email)
VALUES (
  'your-shop-id',
  'garageos-user-uuid',
  'taskmaster-user-id',
  'user@example.com'
);
```

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│  GarageOS   │────────▶│  TaskMaster  │────────▶│  TaskMaster     │
│  (Creates   │  POST   │  API         │  Webhook│  Dashboard      │
│   tasks)    │         │              │         │                 │
└─────────────┘         └──────────────┘         └─────────────────┘
                                  │
                                  │ task.created
                                  │ task.updated
                                  │ task.status_changed
                                  │ task.deleted
                                  ▼
                         ┌──────────────────┐
                         │  GarageOS        │
                         │  /api/webhooks/  │
                         │  taskmaster      │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
             ┌───────────┐ ┌───────────┐ ┌─────────────┐
             │ taskmaster│ │notifica-  │ │ Toasts      │
             │ _tasks    │ │tions      │ │ (real-time) │
             │ table     │ │table      │ │             │
             └───────────┘ └───────────┘ └─────────────┘
```

## Webhook Payload

TaskMaster sends JSON payloads:

```typescript
{
  event: 'task.created' | 'task.updated' | 'task.status_changed' | 'task.deleted',
  shopId: 'uuid-of-shop',
  task: {
    id: 'taskmaster-task-id',
    projectId?: 'project-id',
    title: 'Task title',
    description?: 'Task description',
    status: 'todo' | 'in_progress' | 'done',
    priority?: 0 | 1 | 2 | 3 | 4,
    dueDate?: '2024-12-31T23:59:59Z',
    assigneeId?: 'taskmaster-user-id',
    assigneeEmail?: 'user@example.com',
    linkedEntityType?: 'job_card' | 'invoice' | 'reminder' | 'low_stock',
    linkedEntityId?: 'uuid-of-linked-entity'
  }
}
```

## Notification Types

| Type | Thai Label | Trigger |
|------|------------|---------|
| `task_assigned` | มีงานใหม่ | Task assigned to user |
| `task_updated` | อัปเดตงาน | Task updated |
| `task_completed` | งานเสร็จสิ้น | Task marked as done |

## API Endpoints

### Webhook
- `POST /api/webhooks/taskmaster` - Receives TaskMaster events

### Tasks
- `GET /api/tasks` - List synced tasks (supports `?status=`, `?assignee_id=`)
- `PATCH /api/tasks/[id]` - Update task (action: `mark_done`)

### Notifications
- `GET /api/notifications` - List user notifications
- `PATCH /api/notifications/[id]` - Mark as read
- `POST /api/notifications` - Mark all as read (`{ action: 'mark_all_read' }`)
- `GET /api/notifications/stream` - SSE stream for real-time updates

## Troubleshooting

### Webhook not receiving events
1. Check TaskMaster webhook is configured with correct URL
2. Verify `TASKMASTER_WEBHOOK_SECRET` matches
3. Check Supabase logs for incoming requests

### User not receiving notifications
1. Verify `taskmaster_user_mappings` has correct mapping
2. Check `garageos_assignee_id` is set on task
3. Verify user has notifications enabled

### Tasks not syncing
1. Check `taskmaster_tasks` table has data
2. Verify `shop_id` matches between webhook payload and database

## Development

```bash
# Test webhook locally with curl
curl -X POST http://localhost:3330/api/webhooks/taskmaster \
  -H "Content-Type: application/json" \
  -H "x-taskmaster-signature: <hmac-sha256>" \
  -d '{
    "event": "task.created",
    "shopId": "test-shop-id",
    "task": {
      "id": "tm-123",
      "title": "Test Task",
      "status": "todo"
    }
  }'
```

## Security

- Webhook signatures validated with HMAC-SHA256
- TaskMaster API key stored server-side only
- User mappings scoped per shop
