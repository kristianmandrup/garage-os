'use client';

import { Globe } from 'lucide-react';
import { useLocale } from './LocaleProvider';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'th' : 'en')}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm text-gray-600"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span>{locale === 'th' ? '🇹🇭' : '🇺🇸'}</span>
    </button>
  );
}
