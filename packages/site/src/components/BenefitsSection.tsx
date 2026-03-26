'use client';

import { CheckCircle } from 'lucide-react';
import { useLocale } from './LocaleProvider';

const benefitKeys = [
  'benefit1',
  'benefit2',
  'benefit3',
  'benefit4',
  'benefit5',
  'benefit6',
];

export function BenefitsSection() {
  const { t } = useLocale();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('benefitsTitle')}
            </h2>
            <ul className="space-y-4">
              {benefitKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('readyInMinutes')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('readyDesc')}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('setupTime')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{t('lessThan5Min')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">{t('trainingNeeded')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{t('none')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">{t('monthlyCost')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{t('from20')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
