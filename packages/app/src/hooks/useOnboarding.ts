'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export interface OnboardingFormData {
  shopName: string;
  shopPhone: string;
  shopEmail: string;
  shopAddress: string;
  timezone: string;
  currency: string;
}

export function useOnboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState<OnboardingFormData>({
    shopName: '',
    shopPhone: '',
    shopEmail: '',
    shopAddress: '',
    timezone: 'Asia/Bangkok',
    currency: 'THB',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Create shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert({
          owner_id: user.id,
          name: formData.shopName,
          phone: formData.shopPhone || null,
          email: formData.shopEmail || null,
          address: formData.shopAddress || null,
          timezone: formData.timezone,
          currency: formData.currency,
          status: 'active',
        })
        .select()
        .single();

      if (shopError) throw shopError;

      // Update user role to owner
      await supabase
        .from('users')
        .update({ role: 'owner' })
        .eq('id', user.id);

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to create shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, mounted };
}
