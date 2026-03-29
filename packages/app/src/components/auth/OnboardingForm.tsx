'use client';

import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { FormField } from '@garageos/ui/form-field';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';
import type { OnboardingFormData } from '@/hooks/useOnboarding';

interface OnboardingFormProps {
  formData: OnboardingFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  t: Record<string, any>;
}

export function OnboardingForm({ formData, onChange, onSubmit, loading, t }: OnboardingFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Shop Name" required htmlFor="shopName">
        <div className="relative">
          <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            id="shopName"
            name="shopName"
            placeholder="e.g., Bangkok Auto Repair"
            value={formData.shopName}
            onChange={onChange}
            className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
            required
          />
        </div>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="shopPhone">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="shopPhone"
              name="shopPhone"
              placeholder="02-xxx-xxxx"
              value={formData.shopPhone}
              onChange={onChange}
              className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
            />
          </div>
        </FormField>

        <FormField label="Email" htmlFor="shopEmail">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="shopEmail"
              name="shopEmail"
              type="email"
              placeholder="contact@garage.com"
              value={formData.shopEmail}
              onChange={onChange}
              className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
            />
          </div>
        </FormField>
      </div>

      <FormField label="Address" htmlFor="shopAddress">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            id="shopAddress"
            name="shopAddress"
            placeholder="123 Main Street, Bangkok"
            value={formData.shopAddress}
            onChange={onChange}
            className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
          />
        </div>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Timezone" htmlFor="timezone">
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={onChange}
            className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          >
            <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
            <option value="Asia/Jakarta">Jakarta (GMT+7)</option>
            <option value="Asia/Singapore">Singapore (GMT+8)</option>
          </select>
        </FormField>

        <FormField label="Currency" htmlFor="currency">
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={onChange}
            className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          >
            <option value="THB">THB - Thai Baht</option>
            <option value="USD">USD - US Dollar</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
          </select>
        </FormField>
      </div>

      <Button
        data-testid="onboarding-submit"
        type="submit"
        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25"
        size="lg"
        disabled={loading}
      >
        {loading ? 'Creating Shop...' : 'Create My Shop'}
      </Button>
    </form>
  );
}
