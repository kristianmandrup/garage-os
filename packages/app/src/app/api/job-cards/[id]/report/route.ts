import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/job-cards/[id]/report - Generate or regenerate report token
export async function POST(
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

    // Get user's shop
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Verify job card belongs to shop
    const { data: jobCard } = await supabase
      .from('job_cards')
      .select('id, report_token')
      .eq('id', id)
      .eq('shop_id', shop.id)
      .single();

    if (!jobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }

    // Generate new token (or use existing)
    const newToken = jobCard.report_token || crypto.randomUUID();

    const { data: updatedJobCard, error } = await supabase
      .from('job_cards')
      .update({ report_token: newToken })
      .eq('id', id)
      .select('report_token')
      .single();

    if (error) throw error;

    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://garage-os.vercel.app'}/reports/${newToken}`;

    return NextResponse.json({
      report_token: newToken,
      report_url: reportUrl,
    });
  } catch (error) {
    console.error('Error generating report token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    );
  }
}
