'use client';

import * as React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Toaster } from '@garageos/ui';
import { I18nProvider } from '@/i18n';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function Providers({ children }: { children: React.ReactNode }) {
  const initTheme = useAppStore((state) => state.initTheme);

  useServiceWorker();

  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <I18nProvider>
      <Toaster />
      {children}
    </I18nProvider>
  );
}
