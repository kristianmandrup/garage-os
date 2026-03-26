'use client';

import { Wrench } from 'lucide-react';
import { useLocale } from './LocaleProvider';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">GarageOS</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footerTagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('product')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400">{t('features')}</a></li>
              <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400">{t('pricing')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('integrations')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('about')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('careers')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('privacy')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">{t('security')}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
