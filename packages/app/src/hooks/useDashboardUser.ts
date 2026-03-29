'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DashboardUser {
  userName: string;
  userEmail: string;
  userRole: string | null;
  isLoading: boolean;
}

export function useDashboardUser(): DashboardUser {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Garage Owner');
  const [userEmail, setUserEmail] = useState<string>('owner@garage.com');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserRole(profile.role || 'owner');
          setUserName(profile.name || 'User');
          setUserEmail(user.email || '');
        } else {
          setUserRole('owner');
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return { userName, userEmail, userRole, isLoading };
}
