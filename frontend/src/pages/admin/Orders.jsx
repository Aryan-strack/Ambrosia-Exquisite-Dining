import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders', { params: { status: statusFilter || undefined, limit: 50 } });
      setOrders(res.data.data || []);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setMessage('Order status updated');
      load();
    } catch {
      setMessage('Failed to update order');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-500 mt-1">Track and manage all orders</p>
          </div>
          <Button variant="outline" onClick={load} className="bg-white hover:bg-gray-50">
            Refresh List
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Filter by Status:</span>
              <div className="flex gap-2 flex-wrap">
                {['', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === status
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {status === '' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {message && <div className="p-3 bg-green-50 text-green-700 text-sm font-medium border-b border-green-100 text-center">{message}</div>}
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium border-b border-red-100 text-center">{error}</div>}

          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-20 text-center text-gray-500">
              No orders found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
              {orders.map(o => (
                <div key={o._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                    <div className="min-w-0">
                      <div className="text-xl font-bold text-gray-900 truncate">
                        {o.orderNumber?.toString().length > 8 ? `#...${o.orderNumber.toString().slice(-4)}` : `#${o.orderNumber}`}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        o.status === 'ready' ? 'bg-green-100 text-green-700' :
                          o.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                      }`}>
                      {o.status}
                    </span>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        {o.customer?.name?.charAt(0) || 'G'}
                      </div>
                      <span className="font-medium text-gray-900">{o.customer?.name || 'Guest'}</span>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1">
                      {o.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.menuItem?.name}</span>
                        </div>
                      ))}
                      {o.items?.length > 3 && <div className="text-xs text-gray-500 pt-1 border-t border-gray-100 mt-1">+{o.items.length - 3} more items</div>}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="text-lg font-bold text-gray-900 bg-green-50 px-2 py-0.5 rounded">${o.totalAmount?.toFixed(2)}</span>
                    </div>

                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-gray-900 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer text-center"
                        value={o.status}
                        onChange={e => updateStatus(o._id, e.target.value)}
                      >
                        <option value="pending">Mark as Pending</option>
                        <option value="confirmed">Confirm Order</option>
                        <option value="preparing">Start Preparing</option>
                        <option value="ready">Mark Ready</option>
                        <option value="completed">Complete Order</option>
                        <option value="cancelled">Cancel Order</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
