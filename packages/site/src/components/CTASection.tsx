'use client';

export function CTASection() {
  return (
    <section id="contact" className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Go Digital?
        </h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8">
          Join thousands of auto repair shops in Thailand and Southeast Asia that trust GarageOS.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50">
            Start Your Free Trial
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
}
