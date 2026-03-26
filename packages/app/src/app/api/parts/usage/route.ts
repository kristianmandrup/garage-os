import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/parts/usage - Add part usage to a job card
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { job_card_id, part_id, quantity } = body;

    if (!job_card_id || !part_id || !quantity) {
      return NextResponse.json(
        { error: 'job_card_id, part_id, and quantity are required' },
        { status: 400 }
      );
    }

    // Get part details for pricing
    const { data: part, error: partError } = await supabase
      .from('parts')
      .select('sell_price, quantity')
      .eq('id', part_id)
      .single();

    if (partError || !part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    // Check stock
    if (part.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Create part usage record
    const { data: usage, error: usageError } = await supabase
      .from('part_usage')
      .insert({
        job_card_id,
        part_id,
        quantity,
        unit_price: part.sell_price,
      })
      .select()
      .single();

    if (usageError) throw usageError;

    // Update part quantity
    const { error: updateError } = await supabase
      .from('parts')
      .update({
        quantity: part.quantity - quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', part_id);

    if (updateError) throw updateError;

    return NextResponse.json(usage, { status: 201 });
  } catch (error) {
    console.error('Error adding part usage:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add part usage' },
      { status: 500 }
    );
  }
}

// GET /api/parts/usage?job_card_id=xxx - Get parts usage for a job card
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobCardId = searchParams.get('job_card_id');

    if (!jobCardId) {
      return NextResponse.json(
        { error: 'job_card_id is required' },
        { status: 400 }
      );
    }

    const { data: usage, error } = await supabase
      .from('part_usage')
      .select(`
        *,
        part:parts(id, name, part_number, brand)
      `)
      .eq('job_card_id', jobCardId);

    if (error) throw error;

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error fetching part usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch part usage' },
      { status: 500 }
    );
  }
}

// DELETE /api/parts/usage?id=xxx&part_id=xxx&quantity=xxx - Remove part usage from job card
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const usageId = searchParams.get('id');
    const partId = searchParams.get('part_id');
    const quantity = parseInt(searchParams.get('quantity') || '0');

    if (!usageId) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    // Get the usage record to find the part and quantity
    const { data: usage, error: fetchError } = await supabase
      .from('part_usage')
      .select('*')
      .eq('id', usageId)
      .single();

    if (fetchError || !usage) {
      return NextResponse.json({ error: 'Part usage not found' }, { status: 404 });
    }

    // Delete usage record
    const { error: deleteError } = await supabase
      .from('part_usage')
      .delete()
      .eq('id', usageId);

    if (deleteError) throw deleteError;

    // Restore part quantity
    const { data: part } = await supabase
      .from('parts')
      .select('quantity')
      .eq('id', usage.part_id)
      .single();

    if (part) {
      await supabase
        .from('parts')
        .update({
          quantity: part.quantity + usage.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', usage.part_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing part usage:', error);
    return NextResponse.json(
      { error: 'Failed to remove part usage' },
      { status: 500 }
    );
  }
}
