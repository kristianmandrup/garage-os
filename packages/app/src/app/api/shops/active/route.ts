import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/shops/active - Get active shop
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for active shop in cookie first
    const cookieStore = await cookies();
    const activeShopId = cookieStore.get('active_shop_id')?.value;

    // Get all user's shops
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Find active shop
    let activeShop = shops?.find(s => s.id === activeShopId);

    // Default to first shop if no active shop or not found
    if (!activeShop && shops && shops.length > 0) {
      activeShop = shops[0];
    }

    return NextResponse.json({
      shops: shops || [],
      activeShop: activeShop || null,
    });
  } catch (error) {
    console.error('Error fetching active shop:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

// POST /api/shops/active - Set active shop
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shop_id } = body;

    if (!shop_id) {
      return NextResponse.json({ error: 'shop_id is required' }, { status: 400 });
    }

    // Verify user owns this shop
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shop_id)
      .eq('owner_id', user.id)
      .single();

    if (shopError || !shop) {
      return NextResponse.json({ error: 'Shop not found or access denied' }, { status: 404 });
    }

    // Set cookie (in production, this would be done via response headers)
    // For now, we'll return success and the client will store in localStorage

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error('Error setting active shop:', error);
    return NextResponse.json({ error: 'Failed to set active shop' }, { status: 500 });
  }
}
