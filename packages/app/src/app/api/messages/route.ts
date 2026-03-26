import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendMessage, isMessagingConfigured } from '@/lib/messaging/service';

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

    // Get user's shop with messaging credentials
    const { data: shop } = await supabase
      .from('shops')
      .select(`
        id,
        twilio_account_sid,
        twilio_auth_token,
        twilio_phone_number,
        twilio_whatsapp_from,
        line_channel_access_token,
        line_user_id
      `)
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const body = await request.json();
    const { customer_id, job_card_id, type, channel, content, customer_line_id } = body;

    if (!customer_id || !channel || !content) {
      return NextResponse.json(
        { error: 'customer_id, channel, and content are required' },
        { status: 400 }
      );
    }

    // Verify customer exists and belongs to shop
    const { data: customer } = await supabase
      .from('customers')
      .select('id, name, phone, line_id')
      .eq('id', customer_id)
      .eq('shop_id', shop.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Determine LINE ID - use provided one or customer's stored one
    const lineId = customer_line_id || customer.line_id || shop.line_user_id;

    // Set environment variables from shop credentials for the messaging service
    if (channel === 'sms' || channel === 'whatsapp') {
      if (shop.twilio_account_sid) process.env.TWILIO_ACCOUNT_SID = shop.twilio_account_sid;
      if (shop.twilio_auth_token) process.env.TWILIO_AUTH_TOKEN = shop.twilio_auth_token;
      if (shop.twilio_phone_number) process.env.TWILIO_PHONE_NUMBER = shop.twilio_phone_number;
      if (shop.twilio_whatsapp_from) process.env.TWILIO_WHATSAPP_FROM = shop.twilio_whatsapp_from;
    }

    if (channel === 'line') {
      if (shop.line_channel_access_token) process.env.LINE_CHANNEL_ACCESS_TOKEN = shop.line_channel_access_token;
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

    // Send via external API
    const result = await sendMessage({
      customer_id,
      customer_phone: customer.phone || undefined,
      customer_line_id: lineId,
      channel,
      content,
      job_card_id,
    });

    if (result.success) {
      await supabase
        .from('messages')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', message.id);

      return NextResponse.json({ ...message, status: 'sent', external_id: result.message_id }, { status: 201 });
    } else {
      // Mark as failed
      await supabase
        .from('messages')
        .update({
          status: 'failed',
        })
        .eq('id', message.id);

      return NextResponse.json(
        { ...message, status: 'failed', error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET /api/messages/config - Check messaging provider status
export async function OPTIONS() {
  const config = isMessagingConfigured();
  return NextResponse.json(config);
}
