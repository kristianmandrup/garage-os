import type { Metadata } from 'next';
import { Wrench, Camera, FileText, Users, Package, Bell, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GarageOS - Smart Garage Management for Auto Repair Shops',
  description: 'Mobile-first shop management OS for auto repair shops. AI-powered inspection, digital job cards, inventory management, and customer communication.',
};

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

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">GarageOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </nav>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            "Shopify for Auto Repair"
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Mobile-first, AI-powered shop management for auto repair shops.
            Digitize job cards, AI inspect vehicles, manage inventory, and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 inline-flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border border-input bg-background px-8 py-3 rounded-md text-lg font-medium hover:bg-accent hover:text-accent-foreground">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Run Your Garage</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From digital job cards to AI-powered inspection, GarageOS has all the tools modern auto repair shops need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-lg border bg-card">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-zinc-50">
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
              <p className="text-muted-foreground mb-6">
                No complicated setup. No expensive hardware. Just sign up, add your shop details, and start managing jobs digitally.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Setup time</span>
                  <span className="font-medium">Less than 5 minutes</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Training needed</span>
                  <span className="font-medium">None</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Monthly cost</span>
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
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start free, scale as you grow. No hidden fees, no long-term contracts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="p-8 rounded-lg border bg-card">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="text-3xl font-bold mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-md border border-input hover:bg-accent hover:text-accent-foreground font-medium">
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
              <p className="text-sm text-muted-foreground">
                Mobile-first shop management for auto repair shops.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 GarageOS. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
