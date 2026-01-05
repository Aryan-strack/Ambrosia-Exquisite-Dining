import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const Reports = () => {
  const [sales, setSales] = useState(null);
  const [popular, setPopular] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [ordersAnalytics, setOrdersAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const results = await Promise.allSettled([
        api.get('/reports/sales'),
        api.get('/reports/popular-items'),
        api.get('/reports/revenue'),
        api.get('/reports/customer-stats'),
        api.get('/reports/inventory'),
        api.get('/reports/order-analytics'),
      ]);

      // Handle each result
      if (results[0].status === 'fulfilled') setSales(results[0].value.data.data || results[0].value.data);
      if (results[1].status === 'fulfilled') setPopular(results[1].value.data.data || []);
      if (results[2].status === 'fulfilled') setRevenue(results[2].value.data.data || []);
      if (results[3].status === 'fulfilled') setCustomers(results[3].value.data.data || results[3].value.data);
      if (results[4].status === 'fulfilled') setInventory(results[4].value.data.data || results[4].value.data);
      if (results[5].status === 'fulfilled') setOrdersAnalytics(results[5].value.data.data || results[5].value.data);

      const errors = results.filter(r => r.status === 'rejected');
      if (errors.length > 0) {
        if (errors.length === results.length) setError('Failed to load reports. Please try again.');
      }
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Reports</h1>
            <p className="text-gray-500 mt-1">Deep dive into your business metrics</p>
          </div>
          <Button variant="outline" onClick={load} className="bg-white hover:bg-gray-50">Refresh Analytics</Button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">{error}</div>}

        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900">
                ${sales?.totalStats?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">Total Orders</div>
              <div className="text-3xl font-bold text-blue-600">
                {sales?.totalStats?.totalOrders || 0}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">Avg Order Value</div>
              <div className="text-3xl font-bold text-purple-600">
                ${sales?.totalStats?.avgOrderValue?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">Unique Customers</div>
              <div className="text-3xl font-bold text-orange-600">
                {customers?.overallStats?.totalUniqueCustomers || 0}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Items */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🔥</span> Top Performing Items
              </h2>
              {popular.length === 0 ? (
                <p className="text-gray-500 italic">No data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Item</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-600">Sold</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-600">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {popular.slice(0, 8).map((item, index) => (
                        <tr key={item._id || index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.name || 'Unknown'}</td>
                          <td className="py-3 px-4 text-right text-gray-600 font-medium">{item.totalQuantity || 0}</td>
                          <td className="py-3 px-4 text-right text-green-600 font-bold">${(item.totalRevenue || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Inventory Snapshot */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>📦</span> Inventory Health
              </h2>
              {inventory && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 uppercase">Total Items</div>
                      <div className="text-xl font-bold text-gray-900">{inventory.summary?.totalItems || 0}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 uppercase">Value</div>
                      <div className="text-xl font-bold text-gray-900">${(inventory.summary?.totalValue || 0).toFixed(0)}</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl text-center">
                      <div className="text-xs text-red-500 uppercase">Low Stock</div>
                      <div className="text-xl font-bold text-red-600">{inventory.summary?.lowStockItems || 0}</div>
                    </div>
                  </div>

                  {inventory.lowStockItems?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 mb-3">⚠️ Critically Low Items</h4>
                      <div className="space-y-2">
                        {inventory.lowStockItems.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm p-3 bg-red-50/50 rounded-lg border border-red-100">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="font-bold text-red-600">{item.currentStock} left</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Revenue Table */}
          {revenue.length > 0 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-600">Period</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-600">Total Revenue</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-600">Orders</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-600">Dining</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-600">Delivery</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-600">Takeaway</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {revenue.slice(0, 10).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {item._id?.year && item._id?.month
                            ? `${item._id.month}/${item._id.year}`
                            : item._id?.day
                              ? `${item._id.day}/${item._id.month}/${item._id.year}`
                              : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-green-600">
                          ${(item.revenue || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-gray-700">{item.orders || 0}</td>
                        <td className="py-4 px-6 text-right bg-blue-50/30 text-blue-700 font-medium">${(item.dineInRevenue || 0).toFixed(2)}</td>
                        <td className="py-4 px-6 text-right bg-orange-50/30 text-orange-700 font-medium">${(item.deliveryRevenue || 0).toFixed(2)}</td>
                        <td className="py-4 px-6 text-right bg-gray-50/30 text-gray-700 font-medium">${(item.takeawayRevenue || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
