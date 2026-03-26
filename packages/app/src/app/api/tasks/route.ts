import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/tasks - List tasks from taskmaster_tasks table
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's shop
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assignee_id');
    const linkedEntityType = searchParams.get('linked_entity_type');

    let query = supabase
      .from('taskmaster_tasks')
      .select(`
        *,
        assignee:users(name, avatar_url)
      `)
      .eq('shop_id', shop.id)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (assigneeId) {
      query = query.eq('garageos_assignee_id', assigneeId);
    }

    if (linkedEntityType) {
      query = query.eq('linked_entity_type', linkedEntityType);
    }

    const { data: tasks, error } = await query;

    if (error) throw error;

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
