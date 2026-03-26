import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PATCH /api/reminders/[id] - Update reminder
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

    // Get user's shop
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const body = await request.json();
    const { status, description, due_date, due_mileage } = body;

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (description) updates.description = description;
    if (due_date) updates.due_date = due_date;
    if (due_mileage !== undefined) updates.due_mileage = due_mileage;

    const { data: reminder, error } = await supabase
      .from('maintenance_reminders')
      .update(updates)
      .eq('id', id)
      .eq('shop_id', shop.id)
      .select()
      .single();

    if (error) throw error;
    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders/[id] - Delete reminder
export async function DELETE(
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

    // Get user's shop
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('maintenance_reminders')
      .delete()
      .eq('id', id)
      .eq('shop_id', shop.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}
