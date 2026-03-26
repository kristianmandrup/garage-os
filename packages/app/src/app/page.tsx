import type { Metadata } from 'next';
import { Wrench, Camera, FileText, Users, Package, Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@garageos/ui/card';
import { Button } from '@garageos/ui/button';

export const metadata: Metadata = {
  title: 'GarageOS - Smart Garage Management',
  description: 'AI-powered shop management for auto repair shops',
};

const features = [
  {
    icon: Wrench,
    title: 'Digital Job Cards',
    description: 'Track vehicle repairs from inspection to completion with status workflow',
  },
  {
    icon: Camera,
    title: 'AI Visual Inspection',
    description: 'Upload photos for AI analysis - brake wear, tire damage, leaks detection',
  },
  {
    icon: FileText,
    title: 'Customer Reports',
    description: 'Visual repair recommendations with photo evidence for customer transparency',
  },
  {
    icon: Package,
    title: 'Parts & Inventory',
    description: 'Track parts, manage stock alerts, and integrate with suppliers',
  },
  {
    icon: Bell,
    title: 'Customer Messaging',
    description: 'Automated updates via LINE, WhatsApp, SMS when status changes',
  },
  {
    icon: Users,
    title: 'Vehicle History',
    description: 'Cumulative service records per vehicle for predictive maintenance',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            GarageOS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            "Shopify for auto repair workflows" — mobile-first, AI-powered shop management
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to digitize your garage?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of auto repair shops in Thailand and Southeast Asia
          </p>
          <div className="inline-flex items-center gap-8 text-sm text-muted-foreground">
            <span>Starting at $20/mo</span>
            <span>•</span>
            <span>14-day free trial</span>
            <span>•</span>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </main>
  );
}
