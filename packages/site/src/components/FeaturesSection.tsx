'use client';

import { Wrench, Camera, FileText, Users, Package, Bell } from 'lucide-react';

const features = [
  {
    icon: Wrench,
    title: 'Digital Job Cards',
    description: 'Track vehicle repairs from inspection to completion. Status workflow: inspection → diagnosed → parts ordered → in progress → complete.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  },
  {
    icon: Camera,
    title: 'AI Visual Inspection',
    description: 'Mechanics upload photos, AI analyzes brake wear, tire damage, oil leaks, rust, and cracked belts. Generates visual inspection reports.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80',
  },
  {
    icon: FileText,
    title: 'Customer Transparency Reports',
    description: 'Visual repair recommendations with photo evidence and cost estimates. Increases trust and repair approval rates.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80',
  },
  {
    icon: Package,
    title: 'Parts & Inventory',
    description: 'Parts catalog with supplier integrations, stock tracking, and auto reorder alerts. Never run out of critical parts.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&q=80',
  },
  {
    icon: Bell,
    title: 'Customer Messaging',
    description: 'Automated status updates via LINE, WhatsApp, SMS. Customers know when inspection is done, repair approved, vehicle ready.',
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400&q=80',
  },
  {
    icon: Users,
    title: 'Vehicle History Database',
    description: 'Cumulative service records per vehicle. Increases customer retention and enables predictive maintenance reminders.',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&q=80',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Garage
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            From digital job cards to AI-powered inspection, GarageOS has all the tools modern auto repair shops need.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
