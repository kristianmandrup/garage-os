import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/vehicles - List vehicles for current shop
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
    const search = searchParams.get('search');
    const customerId = searchParams.get('customer_id');

    let query = supabase
      .from('vehicles')
      .select('*, customer:customers(name, phone)')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`license_plate.ilike.%${search}%,vin.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: vehicles, error } = await query;

    if (error) throw error;

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// POST /api/vehicles - Create new vehicle
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
    const { license_plate, brand, model, year, vin, color, mileage, fuel_type, transmission, customer_id } = body;

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        shop_id: shop.id,
        license_plate,
        brand,
        model,
        year,
        vin,
        color,
        mileage,
        fuel_type,
        transmission,
        customer_id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
