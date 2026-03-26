import type { Metadata } from 'next';
import { LandingPageClient } from '@/components/LandingPageClient';

export const metadata: Metadata = {
  title: 'GarageOS - Smart Garage Management for Auto Repair Shops',
  description: 'Mobile-first shop management OS for auto repair shops. AI-powered inspection, digital job cards, inventory management, and customer communication.',
};

export default function LandingPage() {
  return <LandingPageClient />;
}
