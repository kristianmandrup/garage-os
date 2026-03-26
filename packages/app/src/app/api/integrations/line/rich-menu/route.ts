import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/integrations/line/rich-menu - Create LINE Rich Menu for shop
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
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Check if LINE credentials are configured
    if (!shop.line_channel_access_token) {
      return NextResponse.json(
        { error: 'LINE integration not configured. Please add LINE credentials in Settings.' },
        { status: 400 }
      );
    }

    // Get shop portal URL for the menu link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://garage-os.vercel.app';
    const portalUrl = `${baseUrl}/portal/${shop.id}`;

    // Rich menu definition for Thai auto repair shop
    const richMenu = {
      size: { width: 2500, height: 843 },
      selected: true,
      name: 'GarageOS Menu',
      chatBarText: '📱 เปิดแอป',
      areas: [
        {
          bounds: { x: 0, y: 0, width: 833, height: 843 },
          action: {
            type: 'uri',
            uri: `tel:${shop.phone || ''}`,
            displayText: 'โทรหาร้าน',
          },
        },
        {
          bounds: { x: 833, y: 0, width: 833, height: 843 },
          action: {
            type: 'uri',
            uri: `https://line.me/R/ti/p/~${shop.line_user_id || ''}`,
            displayText: 'แชทกับร้าน',
          },
        },
        {
          bounds: { x: 1666, y: 0, width: 834, height: 843 },
          action: {
            type: 'uri',
            uri: portalUrl,
            displayText: 'ดูสถานะรถ',
          },
        },
      ],
    };

    // Create the rich menu via LINE API
    const response = await fetch('https://api.line.me/v2/bot/richmenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shop.line_channel_access_token}`,
      },
      body: JSON.stringify(richMenu),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE API error:', error);
      return NextResponse.json(
        { error: 'Failed to create LINE Rich Menu' },
        { status: 500 }
      );
    }

    const richMenuResult = await response.json();
    const richMenuId = richMenuResult.richMenuId;

    // Upload a simple colored background image
    // In production, you'd upload a branded image
    const imageResponse = await fetch('https://api.line.me/v2/bot/richmenu/' + richMenuId + '/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'Authorization': `Bearer ${shop.line_channel_access_token}`,
      },
      body: Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x09, 0xC4, 0x00, 0x00, 0x03, 0x43, 0x08, 0x06, 0x00, 0x00, 0x00, 0xD5, 0x60, 0x6E, 0x39,
      ]), // Minimal 1x1 blue PNG
    });

    if (imageResponse.ok) {
      // Set this rich menu as the default
      await fetch('https://api.line.me/v2/bot/user/all/richmenu/' + richMenuId, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${shop.line_channel_access_token}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      richMenuId,
      portalUrl,
    });
  } catch (error) {
    console.error('Error creating LINE Rich Menu:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create rich menu' },
      { status: 500 }
    );
  }
}

// GET /api/integrations/line/rich-menu - Check LINE Rich Menu status
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: shop } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    if (!shop.line_channel_access_token) {
      return NextResponse.json({
        configured: false,
        message: 'LINE integration not configured',
      });
    }

    // Check if rich menu exists
    const response = await fetch('https://api.line.me/v2/bot/richmenu/list', {
      headers: {
        'Authorization': `Bearer ${shop.line_channel_access_token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        configured: true,
        richMenus: data.richmenus || [],
      });
    }

    return NextResponse.json({
      configured: true,
      richMenus: [],
    });
  } catch (error) {
    console.error('Error checking LINE Rich Menu:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check rich menu' },
      { status: 500 }
    );
  }
}
