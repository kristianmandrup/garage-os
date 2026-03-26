'use client';

import * as React from 'react';
import { type Locale, locales, defaultLocale } from './config';
import { translations, type TranslationKeys } from './translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function useLocale() {
  const context = React.useContext(I18nContext);
  if (!context) {
    return { locale: defaultLocale as Locale, setLocale: () => {}, t: translations.en as TranslationKeys };
  }
  return context;
}

export function useTranslation() {
  const { t } = useLocale();
  return t;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale);

  React.useEffect(() => {
    // Read locale from cookie on mount
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale;

    if (cookieLocale && locales.includes(cookieLocale)) {
      setLocaleState(cookieLocale);
    }
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
  }, []);

  const t = translations[locale] as TranslationKeys;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
