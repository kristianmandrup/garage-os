'use client';

import { Globe } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '@garageos/ui/dropdown-menu';
import { useLocale, localeNames, locales } from '@/i18n';

const localeFlags: Record<string, string> = {
  en: '🇺🇸',
  th: '🇹🇭',
};

interface LocaleSwitcherProps {
  /** Show only the flag icon (for mobile header and collapsed sidebar) */
  compact?: boolean;
}

export function LocaleSwitcher({ compact = false }: LocaleSwitcherProps) {
  const { locale, setLocale } = useLocale();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="sm" aria-label="Switch language">
            <span className="text-base leading-none">{localeFlags[locale]}</span>
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            {localeNames[locale]}
          </Button>
        )}
      </DropdownTrigger>
      <DropdownContent align="end">
        {locales.map((loc) => (
          <DropdownItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={locale === loc ? 'bg-accent' : ''}
          >
            <span className="mr-2">{localeFlags[loc]}</span>
            {localeNames[loc]}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}
