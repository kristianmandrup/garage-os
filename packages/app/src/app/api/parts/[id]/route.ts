import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/parts/[id] - Get single part
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

    const { data: part, error } = await supabase
      .from('parts')
      .select('*, supplier:suppliers(id, name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error('Error fetching part:', error);
    return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 });
  }
}

// PATCH /api/parts/[id] - Update part
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
    const { name, part_number, category, brand, supplier_id, cost_price, sell_price, quantity, min_quantity } = body;

    // Calculate status based on quantity
    let status = 'in_stock';
    if (quantity === 0) {
      status = 'out_of_stock';
    } else if (min_quantity && quantity <= min_quantity) {
      status = 'low_stock';
    }

    const { data: part, error } = await supabase
      .from('parts')
      .update({
        name,
        part_number,
        category,
        brand,
        supplier_id,
        cost_price,
        sell_price,
        quantity,
        min_quantity,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(part);
  } catch (error) {
    console.error('Error updating part:', error);
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 });
  }
}

// DELETE /api/parts/[id] - Delete part
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
      .from('parts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting part:', error);
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 });
  }
}
