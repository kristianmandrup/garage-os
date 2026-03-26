import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { syncTaskFromWebhook } from '@/lib/taskmaster/service';

// Webhook secret for validating TaskMaster requests
const WEBHOOK_SECRET = process.env.TASKMASTER_WEBHOOK_SECRET;

type TaskMasterEvent = {
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
};

// Validate webhook signature
function validateSignature(body: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('TASKMASTER_WEBHOOK_SECRET not configured, skipping signature validation');
    return true;
  }

  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// POST /api/webhooks/taskmaster - Handle TaskMaster events
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-taskmaster-signature');

    // Validate signature
    if (!validateSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: TaskMasterEvent = JSON.parse(body);

    // Validate required fields
    if (!payload.event || !payload.task || !payload.shopId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify shop exists
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('id', payload.shopId)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Handle different event types
    switch (payload.event) {
      case 'task.created':
      case 'task.updated':
      case 'task.status_changed':
        await handleTaskUpsert(supabase, payload);
        break;

      case 'task.deleted':
        await handleTaskDelete(supabase, payload);
        break;

      default:
        console.log(`Unknown event type: ${payload.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TaskMaster webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleTaskUpsert(supabase: any, payload: TaskMasterEvent) {
  const { task, shopId } = payload;

  // Find GarageOS user mapping if assignee exists
  let garageosAssigneeId = null;
  if (task.assigneeId) {
    const { data: mapping } = await supabase
      .from('taskmaster_user_mappings')
      .select('garageos_user_id')
      .eq('shop_id', shopId)
      .eq('taskmaster_user_id', task.assigneeId)
      .single();

    garageosAssigneeId = mapping?.garageos_user_id || null;
  }

  // Upsert taskmaster_tasks
  const { error: upsertError } = await supabase
    .from('taskmaster_tasks')
    .upsert({
      taskmaster_id: task.id,
      shop_id: shopId,
      taskmaster_project_id: task.projectId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority ?? 2,
      due_date: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      linked_entity_type: task.linkedEntityType,
      linked_entity_id: task.linkedEntityId,
      taskmaster_assignee_id: task.assigneeId,
      garageos_assignee_id: garageosAssigneeId,
      updated_at: new Date().toISOString(),
      synced_at: new Date().toISOString(),
    }, {
      onConflict: 'taskmaster_id',
    });

  if (upsertError) {
    console.error('Failed to upsert task:', upsertError);
    throw upsertError;
  }

  // Create notification for assigned user
  if (garageosAssigneeId) {
    let notificationType: 'task_assigned' | 'task_updated' | 'task_completed';
    let notificationTitle: string;
    let notificationBody: string;

    switch (payload.event) {
      case 'task.created':
        notificationType = 'task_assigned';
        notificationTitle = 'มีงานใหม่'; // New task
        notificationBody = task.title;
        break;
      case 'task.status_changed':
        if (task.status === 'done') {
          notificationType = 'task_completed';
          notificationTitle = 'งานเสร็จสิ้น'; // Task completed
          notificationBody = task.title;
        } else {
          notificationType = 'task_updated';
          notificationTitle = 'อัปเดตงาน'; // Task updated
          notificationBody = `${task.title} - ${getStatusLabel(task.status)}`;
        }
        break;
      default:
        notificationType = 'task_updated';
        notificationTitle = 'อัปเดตงาน'; // Task updated
        notificationBody = task.title;
    }

    await supabase
      .from('notifications')
      .insert({
        user_id: garageosAssigneeId,
        type: notificationType,
        title: notificationTitle,
        body: notificationBody,
        data: {
          taskmaster_id: task.id,
          shop_id: shopId,
          status: task.status,
          linked_entity_type: task.linkedEntityType,
          linked_entity_id: task.linkedEntityId,
        },
        sent_at: new Date().toISOString(),
      });
  }

  // Sync back to TaskMaster service for local state update
  await syncTaskFromWebhook(payload);
}

async function handleTaskDelete(supabase: any, payload: TaskMasterEvent) {
  const { task, shopId } = payload;

  // Soft delete by setting status to 'deleted'
  const { error } = await supabase
    .from('taskmaster_tasks')
    .update({ status: 'deleted', updated_at: new Date().toISOString() })
    .eq('taskmaster_id', task.id)
    .eq('shop_id', shopId);

  if (error) {
    console.error('Failed to delete task:', error);
    throw error;
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, { th: string; en: string }> = {
    todo: { th: 'รอดำเนินการ', en: 'To Do' },
    in_progress: { th: 'กำลังดำเนินการ', en: 'In Progress' },
    done: { th: 'เสร็จสิ้น', en: 'Done' },
  };
  return labels[status]?.th || status;
}

// GET /api/webhooks/taskmaster - Webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');

  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ status: 'Webhook endpoint active' });
}
