'use client';

import { CheckCircle } from 'lucide-react';

const benefits = [
  'Mobile-first design works on any device',
  'AI-powered diagnostics assist mechanics',
  'Reduce paperwork and manual tracking',
  'Increase customer trust with visual reports',
  'Predictive maintenance reminders',
  'Support for LINE, WhatsApp, SMS',
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why GarageOS?
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready in Minutes</h3>
            <p className="text-gray-600 mb-6">
              No complicated setup. No expensive hardware. Just sign up, add your shop details, and start managing jobs digitally.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Setup time</span>
                <span className="font-medium text-gray-900">Less than 5 minutes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Training needed</span>
                <span className="font-medium text-gray-900">None</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Monthly cost</span>
                <span className="font-medium text-gray-900">From $20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
