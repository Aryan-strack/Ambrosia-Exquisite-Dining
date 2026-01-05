import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newOrders: 0,
    reservations: 0,
    completedOrders: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersRes, reservationsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/reservations')
        ]);

        const allOrders = ordersRes.data.data || [];
        const allReservations = reservationsRes.data.data || [];

        setOrders(allOrders);
        setReservations(allReservations);

        setStats({
          newOrders: allOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
          reservations: allReservations.filter(r => r.status === 'pending' || r.status === 'confirmed').length,
          completedOrders: allOrders.filter(o => o.status === 'completed').length
        });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">Staff Portal</h1>
            <p className="text-gray-500 mt-1">Overview of today's floor activity</p>
          </div>
          <div className="flex gap-3">
            <Link to="/staff/orders">
              <Button variant="primary" className="shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700 border-none">
                Manage Orders
              </Button>
            </Link>
            <Link to="/staff/reservations">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                View Reservations
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Orders</div>
                <div className="text-3xl font-bold text-gray-900">{stats.newOrders}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Avg Reservations</div>
                <div className="text-3xl font-bold text-gray-900">{stats.reservations}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</div>
                <div className="text-3xl font-bold text-gray-900">{stats.completedOrders}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/staff/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
            </div>
            <div className="overflow-auto flex-1 p-2">
              {loading ? (
                <div className="flex justify-center p-8">Loading...</div>
              ) : orders.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No recent activity.</div>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 10).map(order => (
                    <div key={order._id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm shrink-0 overflow-hidden">
                            {order.orderNumber?.toString().length > 4 ? `#${order.orderNumber.toString().slice(-4)}` : `#${order.orderNumber}`}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType}
                            </div>
                            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'ready' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            {order.status}
                          </span>
                          <div className="text-sm font-bold text-gray-900 mt-1">${order.totalAmount?.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Reservations List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Reservations</h2>
              <Link to="/staff/reservations" className="text-purple-600 hover:text-purple-700 text-sm font-medium">View All</Link>
            </div>
            <div className="overflow-auto flex-1 p-2">
              {loading ? (
                <div className="flex justify-center p-8">Loading...</div>
              ) : reservations.length === 0 ? (
                <div className="text-center p-8 text-gray-500">No upcoming reservations.</div>
              ) : (
                <div className="space-y-2">
                  {reservations.slice(0, 10).map(res => (
                    <div key={res._id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-900">{res.customer?.name || 'Guest'}</div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {res.partySize} People • {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">Table {res.tableNumber}</div>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize mt-1 ${res.status === 'confirmed' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                            }`}>{res.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
