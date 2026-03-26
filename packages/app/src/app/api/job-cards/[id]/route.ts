import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/job-cards/[id] - Get single job card
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

    const { data: jobCard, error } = await supabase
      .from('job_cards')
      .select(`
        *,
        vehicle:vehicles(*),
        customer:customers(*),
        assigned_to:users(id, name, avatar_url),
        photos:job_card_photos(*),
        part_usages:part_usage(*, part:parts(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!jobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }

    return NextResponse.json(jobCard);
  } catch (error) {
    console.error('Error fetching job card:', error);
    return NextResponse.json({ error: 'Failed to fetch job card' }, { status: 500 });
  }
}

// PATCH /api/job-cards/[id] - Update job card
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
    const { title, description, status, assigned_to_id, estimated_cost, actual_cost, estimated_hours, actual_hours, scheduled_date, completed_at } = body;

    const { data: jobCard, error } = await supabase
      .from('job_cards')
      .update({
        title,
        description,
        status,
        assigned_to_id,
        estimated_cost,
        actual_cost,
        estimated_hours,
        actual_hours,
        scheduled_date,
        completed_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(jobCard);
  } catch (error) {
    console.error('Error updating job card:', error);
    return NextResponse.json({ error: 'Failed to update job card' }, { status: 500 });
  }
}

// DELETE /api/job-cards/[id] - Delete job card
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

    const { error } = await supabase
      .from('job_cards')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job card:', error);
    return NextResponse.json({ error: 'Failed to delete job card' }, { status: 500 });
  }
}
