'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, CreditCard, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';

interface FormData {
  customerName: string;
  whatsappNumber: string;
  cohort: string;
  nickname: string;
}

interface FormErrors {
  customerName?: string;
  whatsappNumber?: string;
  cohort?: string;
  nickname?: string;
  payment?: string;
}

export default function CheckoutForm() {
  const { cart, totalPrice, clearCart, removeFromCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    whatsappNumber: '',
    cohort: '',
    nickname: '',
  });
  
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [lastOrderTotal, setLastOrderTotal] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    // Check for existing order ID in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setLastOrderId(id);
        const savedTotal = localStorage.getItem('lastOrderTotal');
        if (savedTotal) {
          setLastOrderTotal(parseFloat(savedTotal));
        }
      }
    }
  }, []);

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    
    if (!formData.customerName.trim()) {
      errors.customerName = 'Name is required';
    }
    
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = 'WhatsApp number is required';
    } else if (!phoneRegex.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      errors.whatsappNumber = 'Please enter a valid WhatsApp number (e.g., 08012345678)';
    }

    if (!formData.cohort.trim()) errors.cohort = 'Cohort is required';
    if (!formData.nickname.trim()) {
      errors.nickname = 'Nickname is required';
    }
    
    if (!paymentProof) {
      errors.payment = 'Proof of payment is required';
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        window.alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        window.alert('Please upload an image file');
        return;
      }
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePaymentProof = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors)[0]);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let paymentProofUrl = null;
      
      if (paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('proof-of-payment')
          .upload(fileName, paymentProof);
        
        if (uploadError) {
          if (uploadError.message === 'Failed to fetch') {
            throw new Error('Connection failed. Please check your internet or AdBlocker.');
          }
          throw new Error('Failed to upload payment proof: ' + uploadError.message);
        }
        
        const { data: urlData } = supabase.storage
          .from('proof-of-payment')
          .getPublicUrl(fileName);
        
        paymentProofUrl = urlData.publicUrl;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customerName,
          whatsapp_number: formData.whatsappNumber,
          cohort: formData.cohort,
          nickname: formData.nickname,
          total_amount: totalPrice,
          proof_of_payment_url: paymentProofUrl,
          status: 'Pending',
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error('Failed to create order: ' + (orderError?.message || 'Unknown error'));
      }

      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      try {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) {
          console.warn('Warning: Could not save order items:', itemsError.message);
        }
      } catch (itemsCatchError) {
        console.warn('Warning: Error saving order items:', itemsCatchError);
      }

      // Store order info and redirect
      localStorage.setItem('lastOrderId', orderData.id);
      localStorage.setItem('lastOrderTotal', totalPrice.toString());
      clearCart();
      
      // Redirect to order confirmation page
      const newUrl = new URL(window.location.href);
      newUrl.pathname = '/order-confirmed';
      newUrl.searchParams.set('id', orderData.id);
      window.location.href = newUrl.toString();
      
    } catch (error: unknown) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message when order was placed
  if (lastOrderId && submitStatus !== 'error') {
    const whatsappMessage = `Hello, I just placed an order!
Order ID: ${lastOrderId}
Total: ₦${lastOrderTotal.toFixed(2)}
Please confirm my payment.`;
    const whatsappUrl = `https://wa.me/2347086879592?text=${encodeURIComponent(whatsappMessage)}`;
    const trackOrderUrl = `/track?id=${lastOrderId}`;

    const copyOrderId = () => {
      if (lastOrderId) {
        navigator.clipboard.writeText(lastOrderId);
        window.alert('Order ID copied!');
      }
    };

    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-2">Thank you for your order!</p>
        
        <div className="bg-gradient-to-r from-butter-500 to-caramel-500 rounded-2xl p-6 mx-auto max-w-md mb-6">
          <p className="text-white/90 text-sm mb-2">Your Order ID:</p>
          <div className="flex items-center justify-center space-x-3">
            <p className="font-mono font-bold text-2xl text-white">{lastOrderId}</p>
            <button
              onClick={copyOrderId}
              className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              [Copy]
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          <a href={trackOrderUrl} className="text-butter-600 font-semibold hover:underline">
            Track Your Order →
          </a>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Send Order to WhatsApp
          </a>
          <a href={trackOrderUrl} className="inline-flex items-center px-6 py-3 bg-butter-500 text-white rounded-xl font-semibold hover:bg-butter-600 transition-colors shadow-lg shadow-butter-500/30">
            <span>🔍</span>
            <span className="ml-2">Track Order</span>
          </a>
          <a href="/" className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Order More
          </a>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-gray-100 rounded-2xl"></div>
        <div className="h-96 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🍿</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious popcorn to get started!</p>
        <a href="/" className="btn-primary inline-block">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-gradient-to-br from-butter-50 to-cream-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🧺</span> Order Summary
        </h3>
        <div className="space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center group">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.image}</span>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × ₦{item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-900">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Remove from cart"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-butter-200 mt-4 pt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-butter-600">₦{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-butter-500" />
          Customer Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 gap-y-6">
          <div>
            <label className="label">Full Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
            {errorMessage && !formData.customerName && <p className="text-red-500 text-xs mt-1">Name is required</p>}
          </div>

          <div>
            <label className="label">WhatsApp Number *</label>
            <input
              type="text"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              className="input-field"
              placeholder="08012345678"
              required
            />
            {errorMessage && !formData.whatsappNumber && <p className="text-red-500 text-xs mt-1">WhatsApp number is required</p>}
          </div>

          <div>
            <label className="label">Nickname *</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Maverick"
              required
            />
            {errorMessage && !formData.nickname && <p className="text-red-500 text-xs mt-1">Nickname is required</p>}
          </div>

          <div>
            <label className="label">Cohort *</label>
            <input
              type="text"
              name="cohort"
              value={formData.cohort}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Cohort 1"
              required
            />
            {errorMessage && !formData.cohort && <p className="text-red-500 text-xs mt-1">Cohort is required</p>}
          </div>
        </div>
      </div>

      {/* Payment Proof Upload */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">💳</span> Proof of Payment
        </h3>
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Bank Transfer Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Name:</span>
              <span className="font-medium text-gray-900">Opay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-mono font-bold text-gray-900">7086879592</span>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-butter-400 transition-colors">
          {paymentProofPreview ? (
            <div className="relative inline-block">
              <img
                src={paymentProofPreview}
                alt="Payment Proof Preview"
                className="max-w-xs rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={removePaymentProof}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop your payment proof here, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Accepted formats: JPG, PNG, GIF (Max 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="btn-secondary inline-block mt-4 cursor-pointer"
              >
                Choose File
              </label>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Order...
          </span>
        ) : (
          `Place Order - ₦${totalPrice.toFixed(2)}`
        )}
      </button>
    </form>
  );
}
