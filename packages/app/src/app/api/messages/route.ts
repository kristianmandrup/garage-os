import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/messages - List messages for current shop
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
    const customerId = searchParams.get('customer_id');
    const jobCardId = searchParams.get('job_card_id');
    const channel = searchParams.get('channel');

    let query = supabase
      .from('messages')
      .select(`
        *,
        customer:customers(name, phone),
        job_card:job_cards(title)
      `)
      .eq('shop_id', shop.id)
      .order('sent_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (jobCardId) {
      query = query.eq('job_card_id', jobCardId);
    }

    if (channel) {
      query = query.eq('channel', channel);
    }

    const { data: messages, error } = await query;

    if (error) throw error;

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/messages - Send a message
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
    const { customer_id, job_card_id, type, channel, content } = body;

    if (!customer_id || !channel || !content) {
      return NextResponse.json(
        { error: 'customer_id, channel, and content are required' },
        { status: 400 }
      );
    }

    // Verify customer exists and belongs to shop
    const { data: customer } = await supabase
      .from('customers')
      .select('id, name, phone')
      .eq('id', customer_id)
      .eq('shop_id', shop.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Create message record
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        shop_id: shop.id,
        customer_id,
        job_card_id,
        type: type || 'custom',
        channel,
        content,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Actually send via external API (LINE, Twilio, etc.)
    // For now, simulate successful send
    const { error: updateError } = await supabase
      .from('messages')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', message.id);

    if (updateError) {
      console.error('Failed to update message status:', updateError);
    }

    return NextResponse.json({ ...message, status: 'sent' }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
