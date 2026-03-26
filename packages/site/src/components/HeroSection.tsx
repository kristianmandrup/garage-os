'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';

export function HeroSection() {
  return (
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
              <button className="border-2 border-gray-300 bg-white px-8 py-4 rounded-lg text-lg font-semibold text-gray-700 hover:bg-gray-50">
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
                  <p className="font-semibold text-gray-900">500+ Shops</p>
                  <p className="text-sm text-gray-500">Across Thailand</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
