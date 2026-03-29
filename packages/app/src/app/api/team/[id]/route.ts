import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/permissions';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/api-utils';

// PATCH /api/team/[id] - Update a team member's role
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const auth = await requireRole('owner');
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const { role } = await request.json();

    if (!role || !['manager', 'mechanic'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be manager or mechanic.' },
        { status: 400 },
      );
    }

    if (id === auth.user.id) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: member, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, name, email, role, avatar_url, created_at')
      .single();

    if (error) throw error;
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

// DELETE /api/team/[id] - Remove a team member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const auth = await requireRole('owner');
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  if (id === auth.user.id) {
    return NextResponse.json(
      { error: 'Cannot remove yourself from the team' },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
