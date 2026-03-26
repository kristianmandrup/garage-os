# Internationalization (i18n) Setup

## Current Status

**NOT CONFIGURED** - The codebase has a `locale` field in the users table but no i18n system is currently set up.

## Planned i18n Architecture

### Supported Locales
- `en` - English (default)
- `th` - Thai (ภาษาไทย)

### Translation Files Structure

```
packages/app/src/messages/
├── en.json    # English translations
└── th.json   # Thai translations
```

### Translation Schema

```json
{
  "common": {
    "appName": "GarageOS",
    "save": "Save",
    "cancel": "Cancel"
  },
  "nav": {
    "dashboard": "Dashboard",
    "tasks": "งานที่ต้องทำ"
  },
  "tasks": {
    "title": "งานที่ต้องทำ",
    "description": "งานที่ซิงค์จาก TaskMaster"
  }
}
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install next-intl@latest --legacy-peer-deps
```

### 2. Create Translation Files

Create `packages/app/src/messages/en.json` and `packages/app/src/messages/th.json` with translation keys.

### 3. Configure next-intl

Create `packages/app/src/i18n/request.ts`:
```typescript
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 4. Update next.config.ts

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const nextConfig = { ... };

export default withNextIntl(nextConfig);
```

### 5. Update Root Layout

```typescript
import { getLocale, getMessages } from 'next-intl/server';

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 6. Add LocaleSwitcher Component

```typescript
'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onLocaleChange(newLocale: string) {
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      router.refresh();
    });
  }

  return (
    <select onChange={(e) => onLocaleChange(e.target.value)}>
      <option value="en">English</option>
      <option value="th">ภาษาไทย</option>
    </select>
  );
}
```

### 7. Update Components to Use Translations

```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function TasksPage() {
  const t = useTranslations('tasks');

  return <h1>{t('title')}</h1>;
}
```

## Current Manual Localization

For now, Thai strings are hardcoded in components with English fallbacks:

```typescript
const statusConfig = {
  todo: { label: 'รอดำเนินการ', labelEn: 'To Do', ... },
  in_progress: { label: 'กำลังดำเนินการ', labelEn: 'In Progress', ... },
  done: { label: 'เสร็จสิ้น', labelEn: 'Done', ... },
};
```

This approach works but is not scalable. Full i18n setup recommended.

## Database Schema

The `users` table has a `locale` field:

```sql
ALTER TABLE users ADD COLUMN locale varchar(10) NOT NULL DEFAULT 'en';
```

This can be used to:
1. Store user's preferred locale
2. Auto-detect locale on login
3. Send localized notifications based on user preference
