import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, paid, pending, failed
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0
  });

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/orders', { params: { limit: 100 } });
      const allOrders = res.data.data || [];
      setOrders(allOrders);

      // Calculate stats
      const paid = allOrders.filter(o => o.paymentStatus === 'paid');
      const pending = allOrders.filter(o => o.paymentStatus === 'pending');
      const failed = allOrders.filter(o => o.paymentStatus === 'failed');
      const totalRevenue = paid.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        totalRevenue,
        paidCount: paid.length,
        pendingCount: pending.length,
        failedCount: failed.length
      });
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refund = async (orderId) => {
    if (!window.confirm('Are you sure you want to refund this payment?')) {
      return;
    }
    try {
      await api.post(`/payments/${orderId}/refund`);
      setMessage('✅ Refund processed successfully');
      setTimeout(() => setMessage(''), 3000);
      load();
    } catch (err) {
      console.error('Refund error:', err);
      setMessage('❌ Failed to process refund');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getPaymentColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.paymentStatus === filter);

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
            <p className="text-gray-500 mt-1">Track payments and revenue</p>
          </div>
          <Button variant="outline" onClick={load} className="bg-white hover:bg-gray-50">Refresh Data</Button>
        </div>

        {/* Financial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
            <div className="text-sm font-medium text-gray-400 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold tracking-tight">${stats.totalRevenue.toFixed(2)}</div>
            <div className="mt-2 text-xs text-gray-500">Lifetime earnings</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Successful Payments</div>
            <div className="text-3xl font-bold text-green-600">{stats.paidCount}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingCount}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Failed/Refunded</div>
            <div className="text-3xl font-bold text-red-600">{stats.failedCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-2 p-4 border-b border-gray-100 bg-gray-50/50">
            {[
              { value: 'all', label: 'All Transactions' },
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === tab.value
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {message && <div className="p-3 bg-blue-50 text-blue-700 text-sm">{message}</div>}
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm">{error}</div>}

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading transactions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Order ID</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Customer</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Amount</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Method</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Status</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Date</th>
                    <th className="py-4 px-6 text-right font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{order.customer?.name || 'Guest'}</div>
                        <div className="text-xs text-gray-500">{order.customer?.email}</div>
                      </td>
                      <td className="py-4 px-6 text-lg font-bold text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 capitalize text-gray-600">
                        {order.paymentMethod || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getPaymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {order.paymentStatus === 'paid' && order.status !== 'cancelled' ? (
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => refund(order._id)}
                            className="text-xs bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                          >
                            Refund
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td className="py-12 px-6 text-center text-gray-500" colSpan={7}>
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
