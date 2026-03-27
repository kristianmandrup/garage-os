import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/i18n';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  initTheme: () => void;
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      isDark: false,

      setTheme: (theme) => {
        let isDark = false;
        if (theme === 'dark') {
          isDark = true;
        } else if (theme === 'system') {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        set({ theme, isDark });
        document.documentElement.classList.toggle('dark', isDark);
        document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
      },

      initTheme: () => {
        const stored = localStorage.getItem('garageos-theme') as 'light' | 'dark' | 'system' | null;
        const theme = stored || 'system';
        let isDark = false;
        if (theme === 'dark') {
          isDark = true;
        } else if (theme === 'system') {
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        set({ theme, isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },

      locale: 'en',

      setLocale: (locale) => {
        set({ locale });
        document.cookie = `locale=${locale};path=/;max-age=31536000`;
      },
    }),
    {
      name: 'garageos-app-store',
      partialize: (state) => ({ theme: state.theme, locale: state.locale }),
    }
  )
);
