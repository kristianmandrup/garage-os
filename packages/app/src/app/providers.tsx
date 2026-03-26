'use client';

import * as React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { Toaster } from '@garageos/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  const initTheme = useAppStore((state) => state.initTheme);

  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
