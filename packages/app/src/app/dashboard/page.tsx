import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={async () => {
              'use server';
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect('/auth/login');
            }}>
              <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to GarageOS</h2>
        <p className="text-muted-foreground">Your shop dashboard is ready.</p>
      </div>
    </main>
  );
}
