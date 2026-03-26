import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/messages/[id] - Get single message
export async function GET(
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

    const { data: message, error } = await supabase
      .from('messages')
      .select(`
        *,
        customer:customers(name, phone),
        job_card:job_cards(title)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 });
  }
}

// PATCH /api/messages/[id] - Update message status
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
    const { status, delivered_at, read_at } = body;

    const updates: Record<string, any> = {};

    if (status) updates.status = status;
    if (delivered_at) updates.delivered_at = delivered_at;
    if (read_at) updates.read_at = read_at;

    const { data: message, error } = await supabase
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
