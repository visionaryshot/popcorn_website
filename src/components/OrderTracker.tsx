'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Package, CheckCircle, Clock, XCircle, Image as ImageIcon, MessageCircle, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/lib/types';

// Extended Order type with order_items for this component
interface OrderWithItems extends Order {
  order_items?: OrderItem[];
}

export default function OrderTracker() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const searchOrderFromId = useCallback(async (id: string) => {
    if (!id.trim()) return;

    setLoading(true);
    setError('');
    setNotFound(false);
    setOrder(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id.trim())
        .single();

      if (fetchError || !data) {
        setNotFound(true);
        return;
      }

      // Cast data to include order_items
      setOrder(data as OrderWithItems);
    } catch (err: any) {
      setError('Failed to fetch order. Please try again.');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load order from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlOrderId = params.get('id');
      if (urlOrderId) {
        setOrderId(urlOrderId);
        searchOrderFromId(urlOrderId);
      }
    }
  }, [searchOrderFromId]);

  const searchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchOrderFromId(orderId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-4 h-4 mr-2" />
            Awaiting Confirmation
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Payment Confirmed! 🎉
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <XCircle className="w-4 h-4 mr-2" />
            Order Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">📋 Order Received</h4>
            <p className="text-yellow-700 text-sm">
              Your order has been received and is awaiting payment verification. 
              We&apos;ll confirm your payment shortly!
            </p>
          </div>
        );
      case 'Confirmed':
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Payment Confirmed!</h4>
            <p className="text-green-700 text-sm">
              Great news! Your payment has been confirmed and your order is being prepared. 
              We&apos;ll contact you for delivery soon!
            </p>
          </div>
        );
      case 'Cancelled':
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-800 mb-2">❌ Order Cancelled</h4>
            <p className="text-red-700 text-sm">
              This order has been cancelled. If you believe this is a mistake, 
              please contact us below.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={searchOrder} className="mb-8">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          🔍 Track Your Order
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g., abc12345-...)"
              className="w-full px-4 py-4 pr-12 rounded-xl border border-gray-200 focus:border-butter-500 focus:ring-2 focus:ring-butter-200 outline-none transition-all font-mono text-sm"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-butter-500 text-white font-semibold rounded-xl hover:bg-butter-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Track'
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <XCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </form>

      {/* Order Not Found */}
      {notFound && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find an order with that ID. Please check and try again.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tip: Your Order ID was sent to you after checkout. 
            It starts with a format like: <code className="bg-gray-100 px-2 py-1 rounded">abc12345-...</code>
          </p>
          <a
            href="https://wa.me/2347086879592"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Us on WhatsApp
          </a>
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="animate-fade-in">
          {/* Status Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
              <span className="text-sm text-gray-500 font-mono">
                {order.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex items-center justify-between">
              {getStatusBadge(order.status)}
              <span className="text-sm text-gray-500">
                {formatDate(order.created_at)}
              </span>
            </div>
            {getStatusMessage(order.status)}
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-butter-500" />
              Order Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer Name</p>
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Nickname</p>
                <p className="font-medium text-gray-900">{order.nickname}</p>
              </div>
              <div>
                <p className="text-gray-500">Cohort</p>
                <p className="font-medium text-gray-900">{order.cohort}</p>
              </div>
              <div>
                <p className="text-gray-500">WhatsApp</p>
                <p className="font-medium text-gray-900">{order.whatsapp_number}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🧺 Order Items</h3>
            <div className="space-y-3">
              {order.order_items?.map((item: OrderItem, index: number) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🍿</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₦{item.unit_price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-butter-600">
                    ₦{(item.quantity * item.unit_price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-butter-200 mt-4 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-butter-600">
                ₦{order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Proof */}
          {order.proof_of_payment_url && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-butter-500" />
                Payment Proof
              </h3>
              <a
                href={order.proof_of_payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={order.proof_of_payment_url}
                  alt="Proof of Payment"
                  className="max-w-full rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                />
              </a>
            </div>
          )}

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-green-50 to-butter-50 rounded-2xl p-6 border border-green-100">
            <h4 className="font-semibold text-gray-900 mb-2">💬 Need Help?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Have questions about your order? Contact us directly on WhatsApp!
            </p>
            <a
              href={`https://wa.me/2347086879592?text=Hi, I have a question about my order ${order.id.slice(0, 8)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
