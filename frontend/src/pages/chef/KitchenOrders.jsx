import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const KitchenOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      const allOrders = res.data.data || [];
      // Filter orders that need chef attention
      const chefOrders = allOrders.filter(
        o => ['confirmed', 'preparing', 'ready'].includes(o.status)
      );
      setOrders(chefOrders);
    } catch (error) {
      setError('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // 30s refresh
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ready': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 flex justify-center items-start">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mt-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">Kitchen Board</h1>
            <p className="text-gray-500 mt-1">Live active orders requiring preparation</p>
          </div>
          <Button variant="outline" onClick={loadOrders} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Board
          </Button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">{error}</div>}

        {orders.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-500">No active food orders at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {orders.map(o => (
              <div key={o._id} className="bg-white flex flex-col rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Header */}
                <div className={`p-4 border-b ${getStatusColor(o.status)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">#{o.orderNumber}</h3>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(o.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-white/50 backdrop-blur-sm rounded-lg font-bold capitalize">
                      {o.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
                  <ul className="space-y-3">
                    {o.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-start text-sm">
                        <span className="font-bold text-gray-900 w-6">{item.quantity}x</span>
                        <span className="flex-1 text-gray-700 font-medium">{item.menuItem?.name || 'Unknown Item'}</span>
                      </li>
                    ))}
                  </ul>
                  {o.specialInstructions && (
                    <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg border border-yellow-100">
                      <strong>Note:</strong> {o.specialInstructions}
                    </div>
                  )}
                </div>

                {/* Footer / Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>Type: {o.orderType}</span>
                    <span>Table: {o.tableNumber || 'N/A'}</span>
                  </div>

                  <div className="flex gap-2">
                    {o.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(o._id, 'preparing')}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-sm transition-colors"
                      >
                        Start Cooking
                      </button>
                    )}
                    {o.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(o._id, 'ready')}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-sm transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                    {o.status === 'ready' && (
                      <div className="w-full py-2.5 bg-green-100 text-green-700 rounded-xl font-semibold text-center border border-green-200">
                        Waiting Pickup
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

export default KitchenOrders;
