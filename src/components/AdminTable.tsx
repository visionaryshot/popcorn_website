'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle, Clock, XCircle, Image as ImageIcon, Loader2, Lock, LogOut, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';

export default function AdminTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check for existing session
    const isAuth = sessionStorage.getItem('visionary_admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {
    setUpdatingId(orderId);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order:', error);
      window.alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setUpdatingId(orderId);

    try {
      // Delete order items first
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) {
        console.warn('Warning: Could not delete order items:', itemsError.message);
      }

      // Delete the order
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (deleteError) throw deleteError;

      // Update local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Close modal if open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      
      window.alert('Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      window.alert('Failed to delete order');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // SPECIAL ADMIN CREDENTIALS
    if (username.trim() === 'admin' && password === 'visionary123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('visionary_admin_auth', 'true');
      fetchOrders();
    } else {
      window.alert('Invalid credentials. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('visionary_admin_auth');
    setUsername('');
    setPassword('');
    setOrders([]);
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    revenue: orders.reduce((acc, order) => {
      return order.status !== 'Cancelled' ? acc + order.total_amount : acc;
    }, 0)
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-butter-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-butter-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-2">Restricted Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-butter-500 focus:ring-2 focus:ring-butter-200 outline-none transition-all"
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-butter-500 focus:ring-2 focus:ring-butter-200 outline-none transition-all"
            placeholder="Password"
            required
          />
          <button type="submit" className="w-full btn-primary py-3 flex justify-center items-center">
            Login
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-butter-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage orders and view performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Revenue</p>
          <p className="text-2xl font-bold text-butter-600">₦{stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-butter-500 to-butter-400 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Nickname</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Cohort</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">WhatsApp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📋</span>
                      <p>No orders yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-600">
                        {order.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customer_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{order.nickname}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{order.cohort}</div>
                    </td>
                    <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.whatsapp_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-butter-600">
                        ₦{order.total_amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-butter-600 hover:bg-butter-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                            disabled={updatingId === order.id}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {updatingId === order.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            <span>Confirm</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          disabled={updatingId === order.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-butter-600">
                    ₦{selectedOrder.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="text-gray-900">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nickname</p>
                    <p className="text-gray-900">{selectedOrder.nickname}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cohort</p>
                    <p className="text-gray-900">{selectedOrder.cohort}</p>
                  </div>
              <div className="col-span-2">
                <p className="text-gray-500">WhatsApp</p>
                <p className="text-gray-900">{selectedOrder.whatsapp_number}</p>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              {selectedOrder.proof_of_payment_url && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Proof of Payment
                  </h4>
                  <a
                    href={selectedOrder.proof_of_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={selectedOrder.proof_of_payment_url}
                      alt="Proof of Payment"
                      className="max-w-full rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              {selectedOrder.status === 'Pending' && (
                <>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Cancelled');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Confirmed');
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Confirm Order
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  deleteOrder(selectedOrder.id);
                }}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Order</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
