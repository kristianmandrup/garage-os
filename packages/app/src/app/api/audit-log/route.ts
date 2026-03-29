import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/permissions';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/api-utils';

// GET /api/audit-log - Paginated activity log for the shop
export async function GET(request: Request) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

  const auth = await requireRole('manager');
  if (auth instanceof NextResponse) return auth;

  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const type = searchParams.get('type');
    const userId = searchParams.get('user_id');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const offset = (page - 1) * limit;

    // Build query for items
    let query = supabase
      .from('activity_items')
      .select('*, user:users(id, name, avatar_url)', { count: 'exact' })
      .eq('shop_id', auth.shop.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (from) {
      query = query.gte('created_at', from);
    }
    if (to) {
      query = query.lte('created_at', to);
    }

    const { data: items, count, error } = await query;

    if (error) throw error;

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      items: items || [],
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit log' },
      { status: 500 }
    );
  }
}
