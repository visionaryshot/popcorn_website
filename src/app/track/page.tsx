import type { Metadata } from 'next';
import OrderTracker from '@/components/OrderTracker';

export const metadata: Metadata = {
  title: 'Track Your Order | Gourmet Popcorn Shop',
  description: 'Track your popcorn order status. Enter your Order ID to see if your payment has been confirmed.',
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-butter-50 via-cream-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-butter-100 rounded-full mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Enter your Order ID below to check your order status and payment confirmation.
          </p>
        </div>

        {/* Order Tracker */}
        <OrderTracker />

        {/* Help Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 How to Track Your Order</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-butter-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-butter-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Find your Order ID</p>
                  <p className="text-sm text-gray-600">
                    Your Order ID was shown on the checkout confirmation page and sent to your WhatsApp.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-butter-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-butter-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Enter the Order ID</p>
                  <p className="text-sm text-gray-600">
                    Copy and paste your Order ID (e.g., <code className="bg-gray-100 px-1 py-0.5 rounded">abc12345-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>) into the search box above.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-butter-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-butter-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check your status</p>
                  <p className="text-sm text-gray-600">
                    You&apos;ll see if your order is <strong>Pending</strong> (awaiting confirmation) or <strong>Confirmed</strong> (payment received!).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Questions? Contact us on{' '}
            <a 
              href="https://wa.me/2347086879592" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-butter-600 hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

