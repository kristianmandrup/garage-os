'use client';

import { useEffect } from 'react';
import { initPerfMonitoring, logNavigationTiming } from '@/lib/perf';

export function PerfMonitor() {
  useEffect(() => {
    initPerfMonitoring();
    logNavigationTiming();
  }, []);

  return null;
}
