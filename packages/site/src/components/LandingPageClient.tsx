'use client';

import { Wrench, Camera, FileText, Users, Package, Bell, ArrowRight, CheckCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import { useLocale } from './LocaleProvider';

const features = [
  {
    icon: Wrench,
    title: 'Digital Job Cards',
    description: 'Track vehicle repairs from inspection to completion. Status workflow: inspection → diagnosed → parts ordered → in progress → complete.',
  },
  {
    icon: Camera,
    title: 'AI Visual Inspection',
    description: 'Mechanics upload photos, AI analyzes brake wear, tire damage, oil leaks, rust, and cracked belts. Generates visual inspection reports.',
  },
  {
    icon: FileText,
    title: 'Customer Transparency Reports',
    description: 'Visual repair recommendations with photo evidence and cost estimates. Increases trust and repair approval rates.',
  },
  {
    icon: Package,
    title: 'Parts & Inventory',
    description: 'Parts catalog with supplier integrations, stock tracking, and auto reorder alerts. Never run out of critical parts.',
  },
  {
    icon: Bell,
    title: 'Customer Messaging',
    description: 'Automated status updates via LINE, WhatsApp, SMS. Customers know when inspection is done, repair approved, vehicle ready.',
  },
  {
    icon: Users,
    title: 'Vehicle History Database',
    description: 'Cumulative service records per vehicle. Increases customer retention and enables predictive maintenance reminders.',
  },
];

const benefits = [
  'Mobile-first design works on any device',
  'AI-powered diagnostics assist mechanics',
  'Reduce paperwork and manual tracking',
  'Increase customer trust with visual reports',
  'Predictive maintenance reminders',
  'Support for LINE, WhatsApp, SMS',
];

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
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For shop chains',
    features: ['Everything in Medium', 'Multi-shop management', 'API access', 'Custom integrations', 'Dedicated account manager'],
  },
];

export function LandingPageClient() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Wrench className="h-8 w-8 text-blue-600 shrink-0" />
            <span className="text-xl font-bold truncate">GarageOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">{t('features')}</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">{t('pricing')}</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900">{t('contact')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/25">
              {t('getStarted')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                "Shopify for Auto Repair"
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8">
                Mobile-first, AI-powered shop management for auto repair shops.
                Digitize job cards, AI inspect vehicles, manage inventory, and delight customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-input bg-background px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 hover:text-accent-foreground">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80"
                alt="Modern auto repair garage"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">500+ Shops</p>
                    <p className="text-sm text-gray-600">Across Thailand</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Run Your Garage</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From digital job cards to AI-powered inspection, GarageOS has all the tools modern auto repair shops need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="p-6 rounded-lg border bg-white overflow-hidden">
                <img
                  src={[
                    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80",
                    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80",
                    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80",
                    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80",
                    "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400&q=80",
                    "https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&q=80",
                  ][index]}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why GarageOS?</h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Ready in Minutes</h3>
              <p className="text-gray-600 mb-6">
                No complicated setup. No expensive hardware. Just sign up, add your shop details, and start managing jobs digitally.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Setup time</span>
                  <span className="font-medium">Less than 5 minutes</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Training needed</span>
                  <span className="font-medium">None</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Monthly cost</span>
                  <span className="font-medium">From $20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Start free, scale as you grow. No hidden fees, no long-term contracts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="p-8 rounded-lg border bg-white">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="text-3xl font-bold mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-md border border-input hover:bg-gray-100 hover:text-accent-foreground font-medium">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Go Digital?</h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Join thousands of auto repair shops in Thailand and Southeast Asia that trust GarageOS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50">
              Start Your Free Trial
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">GarageOS</span>
              </div>
              <p className="text-sm text-gray-600">
                Mobile-first shop management for auto repair shops.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
            © 2026 GarageOS. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
