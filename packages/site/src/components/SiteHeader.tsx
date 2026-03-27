'use client';

import { useState } from 'react';
import { Wrench, Menu, X } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useLocale } from './LocaleProvider';

interface SiteHeaderProps {
  onContact?: () => void;
}

export function SiteHeader({ onContact }: SiteHeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useLocale();

  const navItems = [
    { href: '#features', label: t('features') },
    { href: '#pricing', label: t('pricing') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">GarageOS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button
              onClick={onContact}
              className="bg-blue-600 dark:bg-blue-500 text-white px-5 py-2.5 font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg shadow-blue-600/25 dark:shadow-blue-500/25"
            >
              {t('getStarted')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <LocaleSwitcher />
              <ThemeToggle />
              <Button
                onClick={onContact}
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-5 py-3 font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 h-auto"
              >
                {t('getStarted')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
