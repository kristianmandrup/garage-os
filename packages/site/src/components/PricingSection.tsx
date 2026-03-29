'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useLocale } from './LocaleProvider';
import { AnimateIn } from './AnimateIn';

const pricingPlans = [
  {
    nameKey: 'smallGarage',
    descKey: 'smallGarageDesc',
    price: '$20/mo',
    featureKeys: ['smallGarageFeature1', 'smallGarageFeature2', 'smallGarageFeature3', 'smallGarageFeature4'],
  },
  {
    nameKey: 'mediumShop',
    descKey: 'mediumShopDesc',
    price: '$50/mo',
    featureKeys: ['mediumGarageFeature1', 'mediumGarageFeature2', 'mediumGarageFeature3', 'mediumGarageFeature4', 'mediumGarageFeature5'],
    popular: true,
  },
  {
    nameKey: 'enterprise',
    descKey: 'enterpriseDesc',
    price: 'Custom',
    featureKeys: ['enterpriseFeature1', 'enterpriseFeature2', 'enterpriseFeature3', 'enterpriseFeature4', 'enterpriseFeature5'],
  },
];

export function PricingSection() {
  const { t } = useLocale();

  return (
    <section id="pricing" data-testid="pricing-section" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pricingTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {t('pricingSubtitle')}
            </p>
          </div>
        </AnimateIn>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <AnimateIn key={plan.nameKey} delay={index * 150}>
            <div
              data-testid="pricing-card"
              className={`p-8 rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                plan.popular
                  ? 'relative ring-2 ring-blue-500/50 border-transparent bg-blue-50 dark:bg-blue-900/20 shadow-xl shadow-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              {plan.popular && (
                <span data-testid="popular-badge" className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  {t('mostPopular')}
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t(plan.nameKey)}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{t(plan.descKey)}</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{plan.price}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('perMonth')}</div>
              <ul className="space-y-3 mb-8">
                {plan.featureKeys.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'default' : 'outline'}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25'
                    : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t('getStartedBtn')}
              </Button>
            </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
