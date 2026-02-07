'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-3xl popcorn-grain">🍿</span>
            <span className="font-display text-xl font-bold text-gray-900 group-hover:text-butter-600 transition-colors">
              Visionary Popcorn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/checkout" 
              className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
            >
              Checkout
            </Link>
            <Link 
              href="/track" 
              className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
            >
              Track Order
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
            >
              About
            </Link>
            <a 
              href="https://wa.me/2347086879592" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              WhatsApp
            </a>
            <Link 
              href="/admin" 
              className="text-gray-500 hover:text-butter-600 font-medium transition-colors text-sm"
            >
              Admin
            </Link>
            
            {/* Cart Button */}
            <Link 
              href="/checkout"
              className="relative p-2 bg-butter-100 rounded-full hover:bg-butter-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-butter-600" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-caramel-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pop">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/checkout" 
                className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Checkout
              </Link>
              <Link 
                href="/track" 
                className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-butter-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="https://wa.me/2347086879592" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                WhatsApp
              </a>
              <Link 
                href="/admin" 
                className="text-gray-500 hover:text-butter-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
