'use client';

import Link from 'next/link';
import { Wrench, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { LocaleSwitcher } from '@/components/locale/LocaleSwitcher';
import { NotificationCenter } from '@/components/NotificationCenter';

interface MobileHeaderProps {
  onMenuOpen: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function MobileHeader({ onMenuOpen, isDark, onThemeToggle }: MobileHeaderProps) {
  return (
    <header
      data-testid="mobile-header"
      className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b flex items-center justify-between px-4"
    >
      <button
        data-testid="mobile-menu-btn"
        onClick={onMenuOpen}
        className="p-2 hover:bg-accent rounded-lg"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
          <Wrench className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold gradient-text">GarageOS</span>
      </Link>
      <div className="flex items-center gap-1">
        <LocaleSwitcher compact />
        <NotificationCenter />
        <Button
          data-testid="theme-toggle"
          variant="ghost"
          size="sm"
          onClick={onThemeToggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
