import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createTaskForJobCard, createTaskForInvoice, createTaskForReminder, createTaskForLowStock, isTaskMasterEnabled } from '@/lib/taskmaster/service';

// POST /api/integrations/taskmaster/tasks - Manually create a task
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isTaskMasterEnabled()) {
      return NextResponse.json(
        { error: 'TaskMaster integration not configured. Set TASKMASTER_API_KEY and TASKMASTER_DEFAULT_PROJECT_ID environment variables.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, data, event } = body;

    let result;

    switch (type) {
      case 'job_card':
        result = await createTaskForJobCard(data, event || 'created');
        break;

      case 'invoice':
        result = await createTaskForInvoice(data, event || 'created');
        break;

      case 'reminder':
        result = await createTaskForReminder(data, data.isOverdue || false);
        break;

      case 'low_stock':
        result = await createTaskForLowStock(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be: job_card, invoice, reminder, or low_stock' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating TaskMaster task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create task' },
      { status: 500 }
    );
  }
}
