'use client';

import Image from 'next/image';
import { Wrench, Camera, FileText, Users, Package, Bell } from 'lucide-react';
import { useLocale } from './LocaleProvider';
import { AnimateIn } from './AnimateIn';

const features = [
  {
    icon: Wrench,
    key: 'digitalJobCards',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  },
  {
    icon: Camera,
    key: 'aiInspection',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80',
  },
  {
    icon: FileText,
    key: 'customerCommunication',
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400&q=80',
  },
  {
    icon: Package,
    key: 'inventoryManagement',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80',
  },
  {
    icon: Bell,
    key: 'paymentTracking',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80',
  },
  {
    icon: Users,
    key: 'analyticsDashboard',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&q=80',
  },
];

export function FeaturesSection() {
  const { t } = useLocale();

  return (
    <section id="features" className="py-20 bg-gray-50/50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>
        </AnimateIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimateIn key={feature.key} delay={index * 100}>
              <div
                className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 border-t-2 border-t-transparent hover:border-t-blue-500 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image src={feature.image} alt={t(feature.key)} width={400} height={240} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t(feature.key)}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{t(`${feature.key}Desc`)}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
