'use client';

import type { Locale } from './config';

const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

function toThaiDigits(num: number): string {
  return num.toString().replace(/\d/g, (d) => thaiDigits[parseInt(d)]);
}

function formatTime(date: Date, locale: Locale): string {
  if (locale === 'th') {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${toThaiDigits(parseInt(hours))}:${toThaiDigits(parseInt(minutes))}`;
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatDate(date: Date, locale: Locale): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (locale === 'th') {
    return `${toThaiDigits(day)}/${toThaiDigits(month)}/${toThaiDigits(year)}`;
  }
  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
}

function formatShortDate(date: Date, locale: Locale): string {
  const shortMonthNames: Record<Locale, string[]> = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  };
  const months = shortMonthNames[locale];
  const day = date.getDate();
  const month = months[date.getMonth()];

  if (locale === 'th') {
    return `${toThaiDigits(day)} ${month}`;
  }
  return `${month} ${day}`;
}

function formatLongDate(date: Date, locale: Locale): string {
  const longMonthNames: Record<Locale, string[]> = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    th: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
  };
  const months = longMonthNames[locale];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (locale === 'th') {
    return `${toThaiDigits(day)} ${month} ${toThaiDigits(year)}`;
  }
  return `${month} ${day}, ${year}`;
}

export function formatDateTime(date: Date, locale: Locale): string {
  const dateStr = formatDate(date, locale);
  const timeStr = formatTime(date, locale);
  return `${dateStr} ${timeStr}`;
}

export function formatDateOnly(date: Date, locale: Locale): string {
  return formatDate(date, locale);
}

export function formatTimeOnly(date: Date, locale: Locale): string {
  return formatTime(date, locale);
}

export function formatShortDateOnly(date: Date, locale: Locale): string {
  return formatShortDate(date, locale);
}

export function formatLongDateOnly(date: Date, locale: Locale): string {
  return formatLongDate(date, locale);
}

export function formatRelativeTime(date: Date, locale: Locale, translations: { today: string; yesterday: string; tomorrow: string; justNow: string; minutesAgo: string; hoursAgo: string; daysAgo: string; inMinutes: string; inHours: string; inDays: string }): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Same day check
  const isSameDay = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
  const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === date.toDateString();

  if (isSameDay && diffMs >= 0 && diffMs < 60000) {
    return translations.justNow;
  }
  if (isSameDay && diffMs < 0) {
    if (diffMins > -60) {
      return translations.minutesAgo.replace('{count}', Math.abs(diffMins).toString());
    }
    if (diffHours > -24) {
      return translations.hoursAgo.replace('{count}', Math.abs(diffHours).toString());
    }
  }
  if (isYesterday) return translations.yesterday;
  if (isTomorrow) return translations.tomorrow;

  if (diffMs >= 0) {
    if (diffMins > 0 && diffMins < 60) {
      return translations.inMinutes.replace('{count}', diffMins.toString());
    }
    if (diffHours > 0 && diffHours < 24) {
      return translations.inHours.replace('{count}', diffHours.toString());
    }
    return translations.inDays.replace('{count}', diffDays.toString());
  } else {
    if (diffMins < 0 && diffMins > -60) {
      return translations.minutesAgo.replace('{count}', Math.abs(diffMins).toString());
    }
    if (diffHours < 0 && diffHours > -24) {
      return translations.hoursAgo.replace('{count}', Math.abs(diffHours).toString());
    }
    return translations.daysAgo.replace('{count}', Math.abs(diffDays).toString());
  }
}
