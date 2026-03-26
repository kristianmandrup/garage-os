import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/notifications/stream - SSE endpoint for real-time notifications
export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      // Poll for new notifications every 5 seconds
      let lastCheck = new Date().toISOString();

      const pollInterval = setInterval(async () => {
        if (isClosed) {
          clearInterval(pollInterval);
          return;
        }

        try {
          // Check for new unread notifications since last check
          const { data: newNotifications } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('read', false)
            .gt('created_at', lastCheck)
            .order('created_at', { ascending: false });

          if (newNotifications && newNotifications.length > 0) {
            const data = JSON.stringify({
              type: 'new_notifications',
              notifications: newNotifications,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Also send periodic heartbeat
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`));

          lastCheck = new Date().toISOString();
        } catch (error) {
          console.error('SSE poll error:', error);
        }
      }, 5000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(pollInterval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
