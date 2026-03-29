'use client';

import { Card, CardContent, CardHeader } from '@garageos/ui/card';
import { Sun, Moon, Globe } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useLocale } from '@/i18n';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingHeader } from '@/components/auth/OnboardingHeader';
import { OnboardingForm } from '@/components/auth/OnboardingForm';

export default function OnboardingPage() {
  const { isDark, setTheme } = useAppStore();
  const { locale, setLocale } = useLocale();
  const { formData, handleChange, handleSubmit, loading, mounted } = useOnboarding();

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const toggleLocale = () => setLocale(locale === 'en' ? 'th' : 'en');

  return (
    <div data-testid="onboarding-page" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 relative overflow-hidden">
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
          <OnboardingHeader t={{}} />
        </CardHeader>
        <CardContent>
          <OnboardingForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            t={{}}
          />
        </CardContent>
      </Card>
    </div>
  );
}
