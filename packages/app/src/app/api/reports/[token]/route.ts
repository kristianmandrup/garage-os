import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/reports/[token] - Get public report by token (no auth required)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Report token is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get job card with report token
    const { data: jobCard, error: jobCardError } = await supabase
      .from('job_cards')
      .select(`
        id,
        title,
        description,
        status,
        estimated_cost,
        actual_cost,
        completed_at,
        created_at,
        vehicle:vehicles(
          id,
          license_plate,
          brand,
          model,
          year,
          color
        ),
        customer:customers(
          id,
          name,
          phone,
          email
        ),
        shop:shops(
          id,
          name,
          phone,
          email,
          logo_url
        )
      `)
      .eq('report_token', token)
      .single();

    if (jobCardError || !jobCard) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Get inspection results with photos
    const { data: photos } = await supabase
      .from('job_card_photos')
      .select(`
        id,
        url,
        thumbnail_url,
        caption,
        is_damage_photo
      `)
      .eq('job_card_id', jobCard.id);

    // Get AI inspection results
    const photoIds = photos?.map(p => p.id) || [];
    let inspectionResults: any[] = [];

    if (photoIds.length > 0) {
      const { data: results } = await supabase
        .from('ai_inspection_results')
        .select('*')
        .in('photo_id', photoIds);

      inspectionResults = results || [];
    }

    // Get parts used
    const { data: partUsages } = await supabase
      .from('part_usage')
      .select(`
        id,
        quantity,
        unit_price,
        part:parts(
          id,
          name,
          part_number
        )
      `)
      .eq('job_card_id', jobCard.id);

    // Get invoice if exists
    const { data: invoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('job_card_id', jobCard.id)
      .single();

    return NextResponse.json({
      jobCard,
      photos: photos || [],
      inspectionResults,
      partsUsed: partUsages || [],
      invoice,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
