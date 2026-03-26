'use client';

import { useState } from 'react';
import { SiteHeader } from './SiteHeader';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { BenefitsSection } from './BenefitsSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import { ContactModal } from './ContactModal';
import { useLocale } from './LocaleProvider';

export function LandingPageClient() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { locale } = useLocale();

  return (
    <main className="min-h-screen">
      <SiteHeader onContact={() => setIsContactOpen(true)} />
      <HeroSection onContact={() => setIsContactOpen(true)} />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <CTASection onContact={() => setIsContactOpen(true)} />
      <Footer />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        locale={locale}
      />
    </main>
  );
}
