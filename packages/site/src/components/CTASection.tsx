'use client';

import { useLocale } from './LocaleProvider';

interface CTASectionProps {
  onContact?: () => void;
}

export function CTASection({ onContact }: CTASectionProps) {
  const { t } = useLocale();

  return (
    <section id="contact" className="py-20 bg-blue-600 dark:bg-blue-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('ctaTitle')}
        </h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8">
          {t('ctaSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContact}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {t('startFreeTrial')}
          </button>
          <button
            onClick={onContact}
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('talkToSales')}
          </button>
        </div>
      </div>
    </section>
  );
}
