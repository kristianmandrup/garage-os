import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// POST /api/webhooks/line - Handle LINE webhook events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-line-signature');

    // Validate webhook signature
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // For production, validate the signature using LINE channel secret
    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    if (channelSecret) {
      const hash = crypto
        .createHmac('sha256', channelSecret)
        .update(JSON.stringify(body))
        .digest('base64');

      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Process webhook events
    const events = body.events || [];

    for (const event of events) {
      if (event.type === 'follow') {
        // User added LINE Official Account
        await handleFollow(event);
      } else if (event.type === 'unfollow') {
        // User blocked LINE Official Account
        await handleUnfollow(event);
      } else if (event.type === 'message') {
        // Handle incoming message
        await handleMessage(event);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LINE webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleFollow(event: any) {
  const supabase = await createClient();
  const lineUserId = event.source?.userId;

  if (!lineUserId) return;

  // Find shop with this LINE user ID and update customer's line_id
  // This links the LINE user to their customer record
  const { data: shops } = await supabase
    .from('shops')
    .select('id')
    .not('line_user_id', 'is', null);

  if (shops) {
    for (const shop of shops) {
      // Search for customers with matching LINE ID or create link
      const { data: customers } = await supabase
        .from('customers')
        .select('id, line_id')
        .eq('shop_id', shop.id)
        .not('line_id', 'is', null);

      // This would typically involve a lookup table for LINE user IDs
      // For now, we'll just log the follow event
      console.log(`User ${lineUserId} followed LINE OA for shop ${shop.id}`);
    }
  }
}

async function handleUnfollow(event: any) {
  const supabase = await createClient();
  const lineUserId = event.source?.userId;

  if (!lineUserId) return;

  // Log unfollow event
  console.log(`User ${lineUserId} unfollowed LINE OA`);

  // Optionally: Mark customer as having unfollowed
  // This could affect their LINE messaging permissions
}

async function handleMessage(event: any) {
  const supabase = await createClient();
  const lineUserId = event.source?.userId;
  const messageType = event.message?.type;
  const messageText = event.message?.text;
  const replyToken = event.replyToken;

  if (!lineUserId || !replyToken) return;

  // Find the shop this LINE user belongs to
  const { data: customer } = await supabase
    .from('customers')
    .select('*, shop:shops(*)')
    .eq('line_id', lineUserId)
    .single();

  if (customer) {
    // Create a message record for this incoming message
    await supabase
      .from('messages')
      .insert({
        shop_id: customer.shop_id,
        customer_id: customer.id,
        type: 'customer_message',
        channel: 'line',
        content: messageText || `[${messageType} message]`,
        status: 'received',
      });
  }

  // Auto-reply with a confirmation message
  // In production, this would check if the user is a known customer first
  const lineChannelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (lineChannelAccessToken && replyToken) {
    try {
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineChannelAccessToken}`,
        },
        body: JSON.stringify({
          replyToken,
          messages: [{
            type: 'text',
            text: customer
              ? `ขอบคุณครับ/ค่ะ ${customer.name}! เราได้รับข้อความของคุณแล้ว และจะติดต่อกลับเร็วๆ นี้`
              : 'ขอบคุณที่ติดต่อมาครับ/ค่ะ! หากต้องการใช้บริการ กรุณาลงทะเบียนที่ร้านของเราก่อนครับ',
          }],
        }),
      });
    } catch (error) {
      console.error('Failed to send LINE reply:', error);
    }
  }
}

// GET /api/webhooks/line - Webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // LINE doesn't use this verification method, but keeping for compatibility
  // LINE verifies webhooks through the POST signature

  if (mode === 'subscribe' && token === process.env.LINE_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}
