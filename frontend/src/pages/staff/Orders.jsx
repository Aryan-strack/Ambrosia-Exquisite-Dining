import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, ready, completed

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      setError('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error('Update error:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to update order');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mt-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Order Management</h1>
            <p className="text-gray-500">Track and manage customer orders</p>
          </div>
          <Button variant="outline" onClick={loadOrders} className="bg-white">
            Refresh List
          </Button>
        </div>

        {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 border border-red-200">{error}</div>}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 mb-8 flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'ready', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 capitalize flex-1 sm:flex-none text-center ${filter === status
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-2 text-6xl">📝</div>
            <h3 className="text-xl font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500">Try changing the filter or refresh.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map(o => (
              <div key={o._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-6">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          o.status === 'ready' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                      }`}>
                      {o.status}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">Order #{o.orderNumber}</h3>
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    {new Date(o.createdAt).toLocaleString()} • {o.orderType}
                    {o.tableNumber && <span className="ml-2 font-medium text-gray-700">• Table {o.tableNumber}</span>}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <ul className="text-sm space-y-2">
                      {o.items?.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="text-gray-700"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.menuItem?.name || 'Item'}</span>
                          <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 mt-3 pt-2 flex justify-between items-center font-bold text-gray-900">
                      <span>Total</span>
                      <span>${o.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Actions */}
                <div className="flex flex-col justify-between md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium uppercase">Payment Status</div>
                    <div className={`font-semibold capitalize flex items-center gap-2 ${o.paymentStatus === 'paid' ? 'text-green-600' :
                        o.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${o.paymentStatus === 'paid' ? 'bg-green-500' :
                          o.paymentStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                      {o.paymentStatus || 'Pending'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    {o.status === 'pending' && (
                      <Button
                        onClick={() => updateOrderStatus(o._id, 'confirmed')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 border-none"
                      >
                        Confirm Order
                      </Button>
                    )}
                    {o.status === 'ready' && (
                      <Button
                        onClick={() => updateOrderStatus(o._id, 'completed')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 border-none"
                      >
                        Complete Order
                      </Button>
                    )}
                    {o.status === 'completed' && (
                      <div className="w-full py-2 bg-gray-100 text-gray-500 font-medium text-sm rounded-lg text-center">
                        Archived
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffOrders;
