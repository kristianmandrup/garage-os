'use client';

import { CheckCircle } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Small Garage',
    price: '$20/mo',
    description: 'Perfect for independent shops',
    features: ['Up to 50 job cards/month', 'Digital job cards', 'Customer messaging', 'Basic AI inspection'],
  },
  {
    name: 'Medium Shop',
    price: '$50/mo',
    description: 'For growing repair shops',
    features: ['Unlimited job cards', 'Everything in Small', 'Parts & inventory', 'Analytics dashboard', 'Priority support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For shop chains',
    features: ['Everything in Medium', 'Multi-shop management', 'API access', 'Custom integrations', 'Dedicated account manager'],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees, no long-term contracts.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border ${
                plan.popular
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-gray-900 mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
