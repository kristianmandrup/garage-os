'use client';

import * as React from 'react';
import { type Locale, locales } from './config';
import { translations, type TranslationKeys } from './translations';
import { useAppStore } from '@/stores/useAppStore';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function useLocale() {
  const context = React.useContext(I18nContext);
  if (!context) {
    return { locale: 'en' as Locale, setLocale: () => {}, t: translations.en as TranslationKeys };
  }
  return context;
}

export function useTranslation() {
  const { t } = useLocale();
  return t;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale: storeLocale, setLocale: storeSetLocale } = useAppStore();
  const [locale, setLocaleState] = React.useState<Locale>(storeLocale || 'en');

  React.useEffect(() => {
    // Sync from store on mount
    if (storeLocale && locales.includes(storeLocale)) {
      setLocaleState(storeLocale);
    }
  }, [storeLocale]);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    storeSetLocale(newLocale);
  }, [storeSetLocale]);

  const t = translations[locale] as TranslationKeys;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
