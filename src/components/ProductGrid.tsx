'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  color: string;
  badge: string;
}

const products: Product[] = [
  {
    id: 'visionary-popcorn',
    name: 'Visionary Popcorn',
    description: 'Classic rich flavor with a perfect golden coating. Made with real premium ingredients for that authentic taste.',
    price: 600,
    image: '🍿',
    color: 'from-butter-400 to-butter-600',
    badge: 'Fresh',
  },
  {
    id: 'small-popcorn',
    name: 'Small Popcorn',
    description: 'Perfect individual size! Classic buttery goodness in a convenient portion.',
    price: 300,
    image: '🍿',
    color: 'from-butter-300 to-butter-500',
    badge: 'Snack',
  },
  {
    id: 'sachet-water',
    name: 'Sachet Water',
    description: 'Pure, clean drinking water. Stay hydrated while enjoying your popcorn!',
    price: 500,
    image: '💧',
    color: 'from-blue-400 to-cyan-500',
    badge: 'Essential',
  },
];

interface QuantitySelectorProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

function QuantitySelector({ product, onAddToCart }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={decrement}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
        <button
          onClick={increment}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <button
        onClick={() => onAddToCart(product, quantity)}
        className="flex items-center space-x-2 bg-gradient-to-r from-butter-500 to-butter-400 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-butter-500/30 transition-all duration-300 active:scale-95"
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="font-medium">Add ₦{(product.price * quantity).toFixed(2)}</span>
      </button>
    </div>
  );
}

export default function ProductGrid() {
  const { addToCart, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: Product, quantity: number) => {
    // Add product multiple times based on quantity selected
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-butter-500 font-semibold tracking-wide uppercase text-sm">
            Handcrafted with Love
          </span>
          <h2 className="section-title mt-2">Our Visionary Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Each batch is carefully crafted using premium ingredients for that perfect balance of flavor and crunch.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="card overflow-hidden group"
            >
              {/* Product Image/Badge Area */}
              <div className={`h-48 bg-gradient-to-br ${product.color} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                    {product.image}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                </div>
                {/* Decorative popcorn pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-8 text-4xl">🍿</div>
                  <div className="absolute bottom-4 left-4 text-3xl">🍿</div>
                  <div className="absolute top-4 left-1/4 text-2xl">🍿</div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className="text-lg font-bold text-butter-600">₦{product.price}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <QuantitySelector product={product} onAddToCart={handleAddToCart} />
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {mounted && totalItems > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <div className="bg-gradient-to-r from-butter-500 to-caramel-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-butter-500/40 animate-slide-up">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🍿</span>
                <div>
                  <p className="font-semibold">{totalItems} items in cart</p>
                  <Link
                    href="/checkout"
                    className="text-sm underline hover:text-white/80 transition-colors"
                  >
                    Proceed to Checkout →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
