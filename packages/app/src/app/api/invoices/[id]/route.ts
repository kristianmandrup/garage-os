import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createTaskForInvoice, isTaskMasterEnabled } from '@/lib/taskmaster/service';

// GET /api/invoices/[id] - Get single invoice
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(*),
        job_card:job_cards(
          *,
          vehicle:vehicles(*),
          part_usages:part_usage(*, part:parts(*))
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

// PATCH /api/invoices/[id] - Update invoice
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, payment_method, notes } = body;

    // Get current invoice state before update
    const { data: currentInvoice } = await supabase
      .from('invoices')
      .select('status')
      .eq('id', id)
      .single();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status;
      if (status === 'paid') {
        updates.paid_at = new Date().toISOString();
      }
    }

    if (payment_method) {
      updates.payment_method = payment_method;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create TaskMaster task on status change
    if (isTaskMasterEnabled() && currentInvoice && status && status !== currentInvoice.status) {
      const { data: customer } = await supabase
        .from('customers')
        .select('name')
        .eq('id', invoice.customer_id)
        .single();

      const { data: jobCard } = await supabase
        .from('job_cards')
        .select('vehicle:vehicles(license_plate)')
        .eq('id', invoice.job_card_id)
        .single();

      let event: 'created' | 'sent' | 'overdue' = 'created';

      if (status === 'sent') {
        event = 'sent';
      } else if (status === 'overdue') {
        event = 'overdue';
      }

      createTaskForInvoice(
        {
          ...invoice,
          customer,
          vehicle: jobCard?.vehicle,
        },
        event
      ).catch(err => console.error('Failed to create TaskMaster task:', err));
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
