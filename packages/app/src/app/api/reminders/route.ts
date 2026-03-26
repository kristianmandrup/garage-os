import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/reminders - List reminders for current shop
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
    const vehicleId = searchParams.get('vehicle_id');
    const customerId = searchParams.get('customer_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('maintenance_reminders')
      .select(`
        *,
        vehicle:vehicles(id, license_plate, brand, model),
        customer:customers(id, name, phone)
      `)
      .eq('shop_id', shop.id)
      .order('due_date', { ascending: true });

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: reminders, error } = await query;

    if (error) throw error;

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

// POST /api/reminders - Create a reminder
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
    const { vehicle_id, customer_id, reminder_type, description, due_date, due_mileage } = body;

    if (!vehicle_id || !customer_id || !reminder_type || !description || !due_date) {
      return NextResponse.json(
        { error: 'vehicle_id, customer_id, reminder_type, description, and due_date are required' },
        { status: 400 }
      );
    }

    const { data: reminder, error } = await supabase
      .from('maintenance_reminders')
      .insert({
        shop_id: shop.id,
        vehicle_id,
        customer_id,
        reminder_type,
        description,
        due_date,
        due_mileage,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create reminder' },
      { status: 500 }
    );
  }
}
