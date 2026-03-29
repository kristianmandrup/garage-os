import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const ROLE_HIERARCHY: Record<string, number> = {
  owner: 4,
  manager: 3,
  mechanic: 2,
  client: 1,
};

export type Role = 'owner' | 'manager' | 'mechanic' | 'client';

export function hasMinRole(userRole: string, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

/**
 * Require a minimum role for an API route.
 * Returns the auth context if authorized, or a NextResponse error if not.
 */
export async function requireRole(requiredRole: Role): Promise<
  | { user: { id: string; email: string }; shop: { id: string }; userRole: string }
  | NextResponse
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: dbUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!shop) return NextResponse.json({ error: 'No shop found' }, { status: 404 });

  const userRole = dbUser?.role || 'client';
  if (!hasMinRole(userRole, requiredRole)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  return { user: { id: user.id, email: user.email || '' }, shop, userRole };
}
