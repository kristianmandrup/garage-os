'use client';

import { SiteHeader } from './SiteHeader';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { BenefitsSection } from './BenefitsSection';
import { PricingSection } from './PricingSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export function LandingPageClient() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
