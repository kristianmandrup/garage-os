'use client';

import { useState } from 'react';
import { Wrench, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useLocale } from './LocaleProvider';

interface SiteHeaderProps {
  onGetStarted?: () => void;
}

export function SiteHeader({ onGetStarted }: SiteHeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useLocale();

  const navItems = [
    { href: '#features', label: t('features') },
    { href: '#pricing', label: t('pricing') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-blue-600 shrink-0" />
            <span className="text-xl font-bold text-gray-900">GarageOS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-semibold text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all"
            >
              {t('getStarted')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-semibold text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <LocaleSwitcher />
              <ThemeToggle />
              <button
                onClick={onGetStarted}
                className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                {t('getStarted')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
