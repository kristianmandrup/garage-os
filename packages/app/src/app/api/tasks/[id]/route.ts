import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { updateTaskStatus } from '@/lib/taskmaster/service';

// PATCH /api/tasks/[id] - Update task (mark as done, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, action } = body;

    // Get user's shop
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Get the task first
    const { data: task } = await supabase
      .from('taskmaster_tasks')
      .select('taskmaster_id, status, shop_id')
      .eq('id', id)
      .eq('shop_id', shop.id)
      .single();

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Handle mark as done action
    if (action === 'mark_done') {
      // Update local task
      const { error: updateError } = await supabase
        .from('taskmaster_tasks')
        .update({
          status: 'done',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Sync back to TaskMaster
      if (task.taskmaster_id) {
        await updateTaskStatus(task.taskmaster_id, 'done');
      }

      return NextResponse.json({ success: true });
    }

    // Handle general status update
    if (status) {
      const { error: updateError } = await supabase
        .from('taskmaster_tasks')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Sync back to TaskMaster
      if (task.taskmaster_id) {
        await updateTaskStatus(task.taskmaster_id, status);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No update provided' }, { status: 400 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
