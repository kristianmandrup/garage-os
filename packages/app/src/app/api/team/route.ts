import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/permissions';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/api-utils';

// GET /api/team - List team members for the current shop
export async function GET(request: Request) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const auth = await requireRole('manager');
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = await createClient();

    // Get shop owner and any users linked to this shop
    const { data: members, error } = await supabase
      .from('users')
      .select('id, name, email, role, avatar_url, created_at')
      .or(`id.eq.${auth.user.id}`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(members || []);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

// POST /api/team - Invite a new team member
export async function POST(request: Request) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const auth = await requireRole('owner');
  if (auth instanceof NextResponse) return auth;

  try {
    const { email, name, role } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, role' },
        { status: 400 },
      );
    }

    if (!['manager', 'mechanic'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be manager or mechanic.' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 },
      );
    }

    const { data: member, error } = await supabase
      .from('users')
      .insert({ email, name, role })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error inviting member:', error);
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 });
  }
}
