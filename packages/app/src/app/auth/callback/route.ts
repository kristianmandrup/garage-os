import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a shop, if not redirect to onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: shops } = await supabase
          .from('shops')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1)
          .single();

        if (!shops) {
          return NextResponse.redirect(`${origin}/auth/onboarding`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to error page with error message
  return NextResponse.redirect(`${origin}/auth/error?message=Authentication failed`);
}
