import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/api-utils';

// GET /api/invoices - List invoices for current shop
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
    const jobCardId = searchParams.get('job_card_id');

    let query = supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(name, phone),
        job_card:job_cards(title, vehicle:vehicles(license_plate, brand, model))
      `)
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (jobCardId) {
      query = query.eq('job_card_id', jobCardId);
    }

    const { data: invoices, error } = await query;

    if (error) throw error;

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST /api/invoices - Create invoice from job card
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
    const { job_card_id, customer_id, tax_rate = 7, discount = 0, due_date, notes } = body;

    if (!job_card_id || !customer_id) {
      return NextResponse.json(
        { error: 'job_card_id and customer_id are required' },
        { status: 400 }
      );
    }

    // Get job card with parts and labor info
    const { data: jobCard } = await supabase
      .from('job_cards')
      .select(`
        *,
        vehicle:vehicles(*),
        part_usages:part_usage(*, part:parts(*))
      `)
      .eq('id', job_card_id)
      .single();

    if (!jobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }

    // Generate invoice number (format: INV-YYYYMMDD-XXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .like('invoice_number', `INV-${dateStr}-%`);

    const invoiceNumber = `INV-${dateStr}-${String((count || 0) + 1).padStart(4, '0')}`;

    // Calculate subtotal from parts and labor
    const partsTotal = jobCard.part_usages?.reduce(
      (sum: number, pu: any) => sum + (pu.quantity * pu.unit_price),
      0
    ) || 0;
    const laborCost = jobCard.actual_cost || 0;
    const subtotal = partsTotal + laborCost;

    // Calculate totals with tax rate
    const tax = subtotal * (tax_rate / 100);
    const total = subtotal + tax - discount;

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        shop_id: shop.id,
        job_card_id,
        customer_id,
        invoice_number: invoiceNumber,
        subtotal,
        tax,
        discount,
        total,
        due_date,
        notes,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
