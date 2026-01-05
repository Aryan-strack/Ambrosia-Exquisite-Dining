import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        setOrders(res.data.data || []);
      } catch {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-orange-100 text-orange-700',
      ready: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      paid: 'text-green-600',
      failed: 'text-red-600',
      refunded: 'text-purple-600'
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading && <div className="text-center py-12">Loading...</div>}
      {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(o => (
          <div key={o._id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-lg font-bold text-gray-900">#{o.orderNumber}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString()}
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${getStatusColor(o.status)}`}>
                {o.status}
              </span>
            </div>

            {/* Order Details */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items:</span>
                <span className="font-medium">{o.items?.length || 0} items</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{o.orderType}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment:</span>
                <span className={`font-semibold capitalize ${getPaymentColor(o.paymentStatus)}`}>
                  {o.paymentStatus}
                  {o.paymentStatus === 'paid' && ' ✓'}
                  {o.paymentStatus === 'pending' && ' ⏳'}
                  {o.paymentStatus === 'failed' && ' ✗'}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium capitalize">{o.paymentMethod}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="text-2xl font-bold text-orange-600">${o.totalAmount?.toFixed(2)}</span>
            </div>

            {/* Actions */}
            <div className="mt-4">
              {o.status === 'pending' && o.paymentStatus === 'pending' && (
                <Button variant="outline" size="small" className="w-full">
                  Cancel Order
                </Button>
              )}
              {o.status === 'ready' && (
                <div className="text-center text-sm text-green-600 font-medium py-2">
                  🍽️ Ready for pickup!
                </div>
              )}
              {o.status === 'completed' && (
                <Button variant="ghost" size="small" className="w-full">
                  ⭐ Rate Order
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <div className="bg-white p-12 rounded-lg shadow border text-center">
          <div className="text-gray-600 mb-4">No orders found.</div>
          <Button variant="primary" onClick={() => window.location.href = '/menu'}>
            Browse Menu
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
