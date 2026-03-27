import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { cookies } from 'next/headers';
import { Providers } from './providers';
import { ThemeInit } from './components/ThemeInit';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: 'GarageOS - Smart Garage Management',
    template: '%s | GarageOS',
  },
  description: 'Mobile-first, AI-powered shop management for auto repair shops. Digitize job cards, AI inspect vehicles, manage inventory, and delight customers.',
  keywords: [
    'garage management',
    'auto repair',
    'shop management',
    'AI inspection',
    'vehicle tracking',
    'inventory management',
    'Thailand',
  ],
  authors: [{ name: 'GarageOS' }],
  creator: 'GarageOS',
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  const isDark = themeCookie === 'dark';

  return (
    <html lang="en" suppressHydrationWarning className={isDark ? 'dark' : ''}>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to content
        </a>
        <ThemeInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
