'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useLocale } from './LocaleProvider';

interface HeroSectionProps {
  onContact?: () => void;
}

export function HeroSection({ onContact }: HeroSectionProps) {
  const { locale, t } = useLocale();

  return (
    <section data-testid="hero-section" className="relative py-20 md:py-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M0%200h1v1H0zM20%200h1v1h-1zM0%2020h1v1H0zM20%2020h1v1h-1z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E')] opacity-[0.03] dark:opacity-[0.05]" />
      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div data-testid="hero-pill" className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" /> AI-Powered Shop Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                data-testid="hero-cta-primary"
                onClick={onContact}
                size="lg"
                className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 shadow-xl shadow-blue-600/40 dark:shadow-blue-500/30 h-auto"
              >
                {t('startFreeTrial')} <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                data-testid="hero-cta-secondary"
                onClick={onContact}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg h-auto"
              >
                {t('watchDemo')}
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Image
              src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80"
              alt="Modern auto repair garage"
              width={800}
              height={600}
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl" />
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">500+ {t('shops')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('acrossThailand')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
