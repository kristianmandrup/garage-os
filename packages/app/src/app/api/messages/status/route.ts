import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/messages/status - Check messaging provider configuration status
export async function GET() {
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
        line_channel_access_token
      `)
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    const status = {
      twilio: !!(shop.twilio_account_sid && shop.twilio_auth_token),
      line: !!shop.line_channel_access_token,
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking messaging status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
