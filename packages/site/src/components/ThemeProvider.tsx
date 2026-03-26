'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('garageos-site-theme') as Theme | null;
    const initialTheme = stored || 'system';
    setThemeState(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateDarkMode = () => {
      const dark = initialTheme === 'dark' ||
        (initialTheme === 'system' && mediaQuery.matches);
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    };

    updateDarkMode();
    mediaQuery.addEventListener('change', updateDarkMode);

    return () => mediaQuery.removeEventListener('change', updateDarkMode);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('garageos-site-theme', newTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const dark = newTheme === 'dark' ||
      (newTheme === 'system' && mediaQuery.matches);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
