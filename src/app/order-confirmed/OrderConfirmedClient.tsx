'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Package, MessageCircle, Copy, ExternalLink, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/lib/types';

interface OrderWithItems extends Order {
  order_items?: OrderItem[];
}

interface OrderConfirmedClientProps {
  orderId?: string;
}

export default function OrderConfirmedClient({ orderId }: OrderConfirmedClientProps) {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No Order ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single();

        if (fetchError || !data) {
          setError('Order not found');
          return;
        }

        setOrder(data as OrderWithItems);
      } catch (err) {
        setError('Failed to fetch order');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      alert('Order ID copied to clipboard!');
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

  const getWhatsAppMessage = () => {
    if (!order) return '';
    return `Hello, I just placed an order!
Order ID: ${order.id}
Total: ₦${order.total_amount.toFixed(2)}
Please confirm my payment.`;
  };

  const getWhatsAppUrl = () => {
    return `https://wa.me/2347086879592?text=${encodeURIComponent(getWhatsAppMessage())}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-butter-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Order Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error 
              ? 'There was an issue loading your order details.'
              : 'We couldn\'t find an order with that ID.'
            }
          </p>
          <div className="space-y-4">
            <a
              href="/track"
              className="block w-full px-6 py-3 bg-butter-500 text-white rounded-xl font-semibold hover:bg-butter-600 transition-colors"
            >
              Track Your Order
            </a>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your order, {order.nickname}!
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-gradient-to-r from-butter-500 to-caramel-500 rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-white/90 text-sm mb-2 flex items-center justify-center">
            Your Order ID
          </p>
          <div className="flex items-center justify-center space-x-3">
            <code className="font-mono font-bold text-2xl text-white bg-white/10 px-4 py-2 rounded-xl">
              {order.id}
            </code>
            <button
              onClick={copyOrderId}
              className="bg-white/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors flex items-center"
              title="Copy Order ID"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </button>
          </div>
          <p className="text-white/70 text-xs mt-3 text-center">
            Save this Order ID to track your order status
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            Order Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
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
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {order.status === 'Pending' ? 'Awaiting Confirmation' :
                 order.status === 'Confirmed' ? 'Payment Confirmed' :
                 'Cancelled'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.order_items?.map((item: OrderItem, index: number) => (
                <div key={index} className="flex justify-between items-center py-2">
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
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Send Order Confirmation to WhatsApp
          </a>
          
          <a
            href={`/track?id=${order.id}`}
            className="flex items-center justify-center px-6 py-4 bg-butter-500 text-white rounded-xl font-semibold hover:bg-butter-600 transition-colors shadow-lg shadow-butter-500/30"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Track Order Status
          </a>
          
          <a
            href="/"
            className="flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Order More Popcorn
          </a>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-green-50 to-butter-50 rounded-2xl p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Have questions about your order? Contact us directly on WhatsApp!
          </p>
          <a
            href={`https://wa.me/2347086879592?text=Hi, I have a question about my order ${order.id.slice(0, 8)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-600 font-semibold hover:underline"
          >
            <MessageCircle className="w-5 h-5 mr-1" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

