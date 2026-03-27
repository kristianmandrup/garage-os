import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { InvoicePDF } from '@/components/invoice/InvoicePDF';

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

    // Fetch invoice with relations
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(*),
        job_card:job_cards(
          *,
          vehicle:vehicles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Fetch shop info
    const { data: shop } = await supabase
      .from('shops')
      .select('*')
      .eq('id', invoice.shop_id)
      .single();

    // Fetch parts used
    const { data: partsUsed } = await supabase
      .from('part_usage')
      .select('*, part:parts(name, part_number)')
      .eq('job_card_id', invoice.job_card_id);

    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePDF, {
        invoice,
        shop: shop || { name: 'GarageOS Shop' },
        customer: invoice.customer,
        vehicle: invoice.job_card?.vehicle,
        partsUsed: partsUsed || [],
      }) as any
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
