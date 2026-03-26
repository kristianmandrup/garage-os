'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Locale = 'en' | 'th';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  en: {
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    getStarted: 'Get Started',
  },
  th: {
    features: 'คุณสมบัติ',
    pricing: 'ราคา',
    contact: 'ติดต่อ',
    getStarted: 'เริ่มต้น',
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('garageos-site-locale') as Locale | null;
    const browserLocale = navigator.language.startsWith('th') ? 'th' : 'en';
    const initialLocale = stored || browserLocale;
    setLocaleState(initialLocale);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('garageos-site-locale', newLocale);
  };

  const t = (key: string) => translations[locale][key] || key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
