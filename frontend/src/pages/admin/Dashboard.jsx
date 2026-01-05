import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    dailySales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockCount: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch Orders
      const ordersRes = await api.get('/orders', { params: { limit: 100 } });
      const allOrders = ordersRes.data.data || [];

      // Calculate statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      const dailySales = todayOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const totalRevenue = allOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const pendingOrders = allOrders.filter(o =>
        ['pending', 'confirmed', 'preparing'].includes(o.status)
      ).length;

      const completedOrders = allOrders.filter(o =>
        o.status === 'completed'
      ).length;

      // Get recent orders (last 5)
      const recent = allOrders.slice(0, 5);
      setRecentOrders(recent);

      // Fetch Inventory for low stock alerts
      try {
        const inventoryRes = await api.get('/inventory');
        const inventory = inventoryRes.data.data || [];
        const lowStock = inventory.filter(item =>
          item.currentStock <= item.minimumStock
        );
        setLowStockItems(lowStock);

        setStats(prev => ({
          ...prev,
          lowStockCount: lowStock.length
        }));
      } catch (err) {
        console.log('Inventory fetch failed:', err);
      }

      // Fetch Users count
      try {
        const usersRes = await api.get('/auth/users');
        const users = usersRes.data.data || [];
        setStats(prev => ({
          ...prev,
          totalUsers: users.length
        }));
      } catch (err) {
        console.log('Users fetch failed:', err);
      }

      // Update stats
      setStats(prev => ({
        ...prev,
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length,
        dailySales,
        totalRevenue,
        pendingOrders,
        completedOrders
      }));

    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of restaurant performance</p>
          </div>
          <Button
            variant="outline"
            onClick={loadDashboardData}
            className="bg-white hover:bg-gray-50 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh Data
            </div>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.69 1.64 1.83 1.64 1.22 0 1.6-.51 1.6-1.11 0-.62-.57-1.07-2.13-1.55C9.05 13.13 7.7 12 7.7 10.13c0-2 .97-3.4 2.89-3.83V5h2.67v1.82c1.46.34 2.76 1.34 3.01 3h-2.02c-.1-1-.54-1.39-1.48-1.39-1.03 0-1.45.6-1.45 1.15 0 .61.59 1 2.22 1.54 1.51.49 2.45 1.38 2.45 2.89 0 2.22-1.43 3.51-2.98 3.89z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wider">Today's Sales</div>
              <div className="text-3xl font-bold tracking-tight">${stats.dailySales.toFixed(2)}</div>
              <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                <span>{stats.todayOrders} orders today</span>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wider">Total Orders</div>
              <div className="text-3xl font-bold tracking-tight">{stats.totalOrders}</div>
              <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span>{stats.pendingOrders} pending</span>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wider">Total Revenue</div>
              <div className="text-3xl font-bold tracking-tight">${stats.totalRevenue.toFixed(2)}</div>
              <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span>{stats.completedOrders} completed</span>
              </div>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className={`p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group transition-colors duration-300 ${stats.lowStockCount > 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
            }`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 17h16v2H4zm13-6.17L15.38 12 12 7.4 8.62 12 7 10.83 12 4zM7 14h10v2H7z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wider">Low Stock Alerts</div>
              <div className="text-3xl font-bold tracking-tight">{stats.lowStockCount}</div>
              <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                {stats.lowStockCount > 0 ? (
                  <>
                    <svg className="w-4 h-4 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Needs attention</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span>All items stocked</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-auto flex-1 p-2">
              {loading ? (
                <div className="flex justify-center p-8 text-gray-400">Loading...</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center p-12 text-gray-500">No orders yet.</div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map(order => (
                    <div key={order._id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm shrink-0 overflow-hidden">
                            {order.orderNumber?.toString().length > 4 ? `#${order.orderNumber.toString().slice(-4)}` : `#${order.orderNumber}`}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {order.customer?.name || 'Guest'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <div className="font-bold text-gray-900 mt-1">${order.totalAmount?.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
              <Link to="/admin/inventory" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Manage Inventory
              </Link>
            </div>
            <div className="overflow-auto flex-1 p-2">
              {loading ? (
                <div className="flex justify-center p-8 text-gray-400">Loading...</div>
              ) : lowStockItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Inventory Healthy</h3>
                  <p className="max-w-xs mx-auto mt-2">All items are stocked above their minimum levels.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockItems.slice(0, 5).map(item => (
                    <div key={item._id} className="p-4 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{item.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 font-bold text-lg">
                            {item.currentStock} <span className="text-xs font-normal text-red-500">{item.unit}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Min Req: {item.minimumStock}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-red-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-red-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min((item.currentStock / item.minimumStock) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Management</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/admin/menu', icon: '📋', label: 'Manage Menu', desc: 'Update items & prices', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
            { to: '/admin/orders', icon: '📦', label: 'View Orders', desc: 'Track all orders', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
            { to: '/admin/inventory', icon: '📊', label: 'Check Inventory', desc: 'Stock levels', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
            { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'Staff & customers', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
            { to: '/admin/payments', icon: '💰', label: 'Payments', desc: 'Transaction history', color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
            { to: '/admin/reports', icon: '📈', label: 'Reports', desc: 'Sales analytics', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
            { to: '/admin/feedback', icon: '⭐', label: 'Feedback', desc: 'Customer reviews', color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
          ].map((action, i) => (
            <Link key={i} to={action.to} className={`p-6 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-md flex flex-col items-center text-center group ${action.color}`}>
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
              <div className="font-bold text-gray-900">{action.label}</div>
              <div className="text-xs opacity-70 mt-1">{action.desc}</div>
            </Link>
          ))}
          <button onClick={loadDashboardData} className="p-6 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-md flex flex-col items-center text-center cursor-pointer group">
            <div className="text-4xl mb-3 transform group-hover:rotate-180 transition-transform duration-500">🔄</div>
            <div className="font-bold text-gray-900">Refresh Data</div>
            <div className="text-xs opacity-70 mt-1">Update dashboard</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
