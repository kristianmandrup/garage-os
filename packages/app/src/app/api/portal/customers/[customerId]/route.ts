import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/portal/customers/[customerId] - Get customer portal data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const supabase = await createClient();

    // Optional: verify portal token from header for additional security
    const portalToken = request.headers.get('x-portal-token');

    // Fetch customer with shop info
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select(`
        *,
        shop:shops(id, name, phone, email, logo_url)
      `)
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // If portal token is provided, verify it matches the customer
    if (portalToken) {
      const { data: tokenData } = await supabase
        .from('customers')
        .select('portal_token')
        .eq('id', customerId)
        .eq('portal_token', portalToken)
        .single();

      if (!tokenData) {
        return NextResponse.json({ error: 'Invalid portal token' }, { status: 401 });
      }
    }

    // Fetch vehicles for this customer
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select(`
        *,
        job_cards(
          id, title, status, created_at, completed_at,
          shop:shops(name)
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    // Fetch pending job cards (need approval)
    const { data: pendingApprovals } = await supabase
      .from('job_cards')
      .select(`
        *,
        vehicle:vehicles(license_plate, brand, model),
        shop:shops(name)
      `)
      .eq('customer_id', customerId)
      .eq('status', 'pending_approval')
      .order('updated_at', { ascending: false });

    // Fetch invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select(`
        *,
        job_card:job_cards(title, vehicle:vehicles(license_plate, brand, model))
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    // Fetch reminders
    const { data: reminders } = await supabase
      .from('maintenance_reminders')
      .select(`
        *,
        vehicle:vehicles(license_plate, brand, model)
      `)
      .eq('customer_id', customerId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    // Fetch recent service history
    const { data: serviceHistory } = await supabase
      .from('job_cards')
      .select(`
        id, title, status, created_at, completed_at, actual_cost,
        vehicle:vehicles(license_plate, brand, model, year)
      `)
      .eq('customer_id', customerId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        shop: customer.shop,
      },
      vehicles,
      pendingApprovals,
      invoices,
      reminders,
      serviceHistory,
    });
  } catch (error) {
    console.error('Error fetching customer portal data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
