'use client';

import { Globe } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '@garageos/ui/dropdown-menu';
import { useLocale, localeNames, locales, type Locale } from '@/i18n';

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {localeNames[locale]}
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        {locales.map((loc) => (
          <DropdownItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={locale === loc ? 'bg-accent' : ''}
          >
            <span className="mr-2">{loc === 'th' ? '🇹🇭' : '🇺🇸'}</span>
            {localeNames[loc]}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}
