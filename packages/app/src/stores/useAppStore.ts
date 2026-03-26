import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  initTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
        localStorage.setItem('garageos-theme', theme);
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
    }),
    {
      name: 'garageos-app-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
