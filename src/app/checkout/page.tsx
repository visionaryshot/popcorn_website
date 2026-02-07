import CheckoutForm from '@/components/CheckoutForm';

export const metadata = {
  title: 'Checkout - Gourmet Popcorn Shop',
  description: 'Complete your order for premium gourmet popcorn',
};

export default function CheckoutPage() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-white to-butter-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-butter-500 to-caramel-500 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-5xl mb-4 block">🧺</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Checkout
            </h1>
            <p className="text-white/90 text-lg">
              Complete your order and we&apos;ll prepare your gourmet popcorn fresh!
            </p>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <CheckoutForm />
        </div>
      </div>
  );
}
