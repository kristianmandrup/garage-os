'use client';

import { Wrench, Camera, FileText, Users, Package, Bell } from 'lucide-react';
import { useLocale } from './LocaleProvider';

const features = [
  {
    icon: Wrench,
    key: 'digitalJobCards',
  },
  {
    icon: Camera,
    key: 'aiInspection',
  },
  {
    icon: FileText,
    key: 'customerCommunication',
  },
  {
    icon: Package,
    key: 'inventoryManagement',
  },
  {
    icon: Bell,
    key: 'paymentTracking',
  },
  {
    icon: Users,
    key: 'analyticsDashboard',
  },
];

export function FeaturesSection() {
  const { t } = useLocale();

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('featuresTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(feature.key)}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{t(`${feature.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
