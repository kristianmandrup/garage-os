'use client';

import { CardDescription, CardTitle } from '@garageos/ui/card';
import { Wrench, Building2 } from 'lucide-react';

interface OnboardingHeaderProps {
  t: Record<string, any>;
}

export function OnboardingHeader({ t }: OnboardingHeaderProps) {
  return (
    <>
      <div data-testid="onboarding-brand" className="flex items-center justify-center gap-2 mb-6">
        <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">GarageOS</span>
      </div>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
        <Building2 className="w-8 h-8 text-white" />
      </div>
      <CardTitle data-testid="onboarding-title" className="text-2xl text-gray-900 dark:text-white">Set Up Your Shop</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-400">
        Tell us about your auto repair shop to get started
      </CardDescription>
      <div data-testid="onboarding-step-indicator" className="flex items-center justify-center gap-2 mt-3">
        <div className="h-1.5 w-8 rounded-full bg-blue-600" />
        <div className="h-1.5 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </>
  );
}
