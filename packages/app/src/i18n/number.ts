'use client';

import type { Locale } from './config';

const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

function toThaiDigits(num: string): string {
  return num.replace(/\d/g, (d) => thaiDigits[parseInt(d)]);
}

export function formatNumber(num: number, locale: Locale): string {
  if (locale === 'th') {
    return toThaiDigits(num.toLocaleString('th-TH'));
  }
  return num.toLocaleString('en-US');
}

export function formatCurrency(amount: number, locale: Locale, currency: string = 'THB'): string {
  const formatter = new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  if (locale === 'th') {
    // Convert Latin digits to Thai
    return toThaiDigits(formatted);
  }
  return formatted;
}

export function formatPercent(value: number, locale: Locale): string {
  const formatter = new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  const formatted = formatter.format(value / 100);
  if (locale === 'th') {
    return toThaiDigits(formatted);
  }
  return formatted;
}

export function formatCompact(num: number, locale: Locale): string {
  const formatter = new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  const formatted = formatter.format(num);
  if (locale === 'th') {
    return toThaiDigits(formatted);
  }
  return formatted;
}
