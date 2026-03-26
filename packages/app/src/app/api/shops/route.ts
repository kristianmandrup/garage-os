import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/shops - List shops for current user
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get shops where user is owner
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

// POST /api/shops - Create new shop
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, address, phone, email, logo_url, timezone, currency } = body;

    const { data: shop, error } = await supabase
      .from('shops')
      .insert({
        owner_id: user.id,
        name,
        description,
        address,
        phone,
        email,
        logo_url,
        timezone: timezone || 'Asia/Bangkok',
        currency: currency || 'THB',
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
  }
}
