import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    preparing: 0,
    ready: 0
  });

  useEffect(() => {
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
        setStats({
          assigned: chefOrders.filter(o => o.status === 'confirmed').length,
          preparing: chefOrders.filter(o => o.status === 'preparing').length,
          ready: chefOrders.filter(o => o.status === 'ready').length
        });
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // Reload orders
      const res = await api.get('/orders');
      const allOrders = res.data.data || [];
      const chefOrders = allOrders.filter(
        o => ['confirmed', 'preparing', 'ready'].includes(o.status)
      );
      setOrders(chefOrders);
      setStats({
        assigned: chefOrders.filter(o => o.status === 'confirmed').length,
        preparing: chefOrders.filter(o => o.status === 'preparing').length,
        ready: chefOrders.filter(o => o.status === 'ready').length
      });
    } catch (error) {
      console.error('Failed to update order:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">Kitchen Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage orders and kitchen workflow</p>
          </div>
          <Link to="/chef/orders">
            <Button variant="primary" className="shadow-lg shadow-orange-200">
              View Live Kitchen Board
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Pending Assign</div>
                <div className="text-4xl font-bold text-gray-900">{stats.assigned}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Cooking Now</div>
                <div className="text-4xl font-bold text-gray-900">{stats.preparing}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Ready to Serve</div>
                <div className="text-4xl font-bold text-gray-900">{stats.ready}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Live Orders Feed */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activity
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="p-4 bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No active orders</h3>
            <p className="text-gray-500 mt-2">The kitchen is currently quiet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden
                                        ${order.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-600' :
                            'bg-green-100 text-green-600'}
                                    `}>
                        {order.orderNumber?.toString().length > 4 ? `#${order.orderNumber.toString().slice(-4)}` : `#${order.orderNumber}`}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {order.items?.reduce((acc, item) => acc + item.quantity, 0)} Items
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                          <span>•</span>
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden md:block text-right mr-4">
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="font-semibold text-gray-900">${order.totalAmount?.toFixed(2)}</div>
                      </div>

                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, 'preparing')}
                          className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
                        >
                          Start Cooking
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, 'ready')}
                          className="bg-green-500 hover:bg-green-600 text-white min-w-[140px]"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Ready for Pickup
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick items preview */}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 border border-gray-200">
                        {item.quantity}x {item.menuItem?.name}
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-400 border border-gray-200">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;
