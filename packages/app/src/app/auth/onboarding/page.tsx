'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Wrench, Building2, MapPin, Phone, Mail, Sun, Moon, Globe } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useLocale } from '@/i18n';
import { useEffect, useState as useStateHook } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useStateHook(false);
  const { isDark, setTheme } = useAppStore();
  const { locale, setLocale } = useLocale();

  const [formData, setFormData] = useState({
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

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'th' : 'en');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184,0.1)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184,0.05)_1px,transparent_0)]" />

      {/* Theme and Locale Controls */}
      {mounted && (
        <div className="fixed top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={toggleLocale}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Globe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      )}

      <Card className="w-full max-w-lg border border-gray-100 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">GarageOS</span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Set Up Your Shop</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Tell us about your auto repair shop to get started
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-1.5 w-8 rounded-full bg-blue-600" />
            <div className="h-1.5 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-gray-700 dark:text-gray-300">Shop Name *</Label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="shopName"
                  name="shopName"
                  placeholder="e.g., Bangkok Auto Repair"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="shopPhone" className="text-gray-700 dark:text-gray-300">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="shopPhone"
                    name="shopPhone"
                    placeholder="02-xxx-xxxx"
                    value={formData.shopPhone}
                    onChange={handleChange}
                    className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopEmail" className="text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="shopEmail"
                    name="shopEmail"
                    type="email"
                    placeholder="contact@garage.com"
                    value={formData.shopEmail}
                    onChange={handleChange}
                    className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopAddress" className="text-gray-700 dark:text-gray-300">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  id="shopAddress"
                  name="shopAddress"
                  placeholder="123 Main Street, Bangkok"
                  value={formData.shopAddress}
                  onChange={handleChange}
                  className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-gray-700 dark:text-gray-300">Timezone</Label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                >
                  <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                  <option value="Asia/Jakarta">Jakarta (GMT+7)</option>
                  <option value="Asia/Singapore">Singapore (GMT+8)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">Currency</Label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                >
                  <option value="THB">THB - Thai Baht</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating Shop...' : 'Create My Shop'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
