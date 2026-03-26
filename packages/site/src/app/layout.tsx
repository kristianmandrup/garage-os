import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GarageOS - Smart Garage Management for Auto Repair Shops',
  description: 'Mobile-first shop management OS for auto repair shops. AI-powered inspection, digital job cards, inventory management, and customer communication.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
