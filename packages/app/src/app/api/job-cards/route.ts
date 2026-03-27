import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createTaskForJobCard, isTaskMasterEnabled } from '@/lib/taskmaster/service';
import { checkRateLimit } from '@/lib/api-utils';

// GET /api/job-cards - List job cards for current shop
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
    const status = searchParams.get('status');
    const vehicleId = searchParams.get('vehicle_id');
    const assignedTo = searchParams.get('assigned_to');

    let query = supabase
      .from('job_cards')
      .select(`
        *,
        vehicle:vehicles(license_plate, brand, model),
        customer:customers(name, phone),
        assigned_to:users(name, avatar_url)
      `)
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }

    if (assignedTo) {
      query = query.eq('assigned_to_id', assignedTo);
    }

    const { data: jobCards, error } = await query;

    if (error) throw error;

    return NextResponse.json(jobCards);
  } catch (error) {
    console.error('Error fetching job cards:', error);
    return NextResponse.json({ error: 'Failed to fetch job cards' }, { status: 500 });
  }
}

// POST /api/job-cards - Create new job card
export async function POST(request: Request) {
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

    const body = await request.json();
    const { vehicle_id, customer_id, title, description, assigned_to_id, estimated_cost, estimated_hours, scheduled_date } = body;

    const { data: jobCard, error } = await supabase
      .from('job_cards')
      .insert({
        shop_id: shop.id,
        vehicle_id,
        customer_id,
        title,
        description,
        assigned_to_id,
        estimated_cost,
        estimated_hours,
        scheduled_date,
        status: 'inspection',
      })
      .select()
      .single();

    if (error) throw error;

    // Create TaskMaster task if enabled
    if (isTaskMasterEnabled() && jobCard) {
      // Fetch vehicle and customer info for the task
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('license_plate, brand, model')
        .eq('id', vehicle_id)
        .single();

      const { data: customer } = await supabase
        .from('customers')
        .select('name')
        .eq('id', customer_id)
        .single();

      createTaskForJobCard(
        { ...jobCard, vehicle, customer },
        'created'
      ).catch(err => console.error('Failed to create TaskMaster task:', err));
    }

    return NextResponse.json(jobCard, { status: 201 });
  } catch (error) {
    console.error('Error creating job card:', error);
    return NextResponse.json({ error: 'Failed to create job card' }, { status: 500 });
  }
}
