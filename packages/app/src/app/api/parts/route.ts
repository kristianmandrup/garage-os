import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/api-utils';

// GET /api/parts - List parts for current shop
export async function GET(request: Request) {
  const rateLimited = checkRateLimit(request);
  if (rateLimited) return rateLimited;

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
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const lowStock = searchParams.get('low_stock');

    let query = supabase
      .from('parts')
      .select('*, supplier:suppliers(name)')
      .eq('shop_id', shop.id)
      .order('name');

    if (search) {
      query = query.or(`name.ilike.%${search}%,part_number.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (lowStock === 'true') {
      query = query.lte('quantity', supabase.rpc('coalesce', { x: 'min_quantity', y: 0 }));
    }

    const { data: parts, error } = await query;

    if (error) throw error;

    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}

// POST /api/parts - Create new part
export async function POST(request: Request) {
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

    const body = await request.json();
    const { name, part_number, category, brand, supplier_id, cost_price, sell_price, quantity, min_quantity } = body;

    // Calculate status based on quantity
    let status = 'in_stock';
    if (quantity === 0) {
      status = 'out_of_stock';
    } else if (min_quantity && quantity <= min_quantity) {
      status = 'low_stock';
    }

    const { data: part, error } = await supabase
      .from('parts')
      .insert({
        shop_id: shop.id,
        name,
        part_number,
        category,
        brand,
        supplier_id,
        cost_price,
        sell_price,
        quantity,
        min_quantity,
        status,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    console.error('Error creating part:', error);
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
  }
}
