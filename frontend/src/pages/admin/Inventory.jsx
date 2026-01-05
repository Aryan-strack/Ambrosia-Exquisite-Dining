import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'vegetables',
    currentStock: '',
    minStockLevel: '',
    costPerUnit: '',
    unit: 'kg'
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory');
      setItems(res.data.data || []);
    } catch {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const createItem = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name,
        category: form.category,
        currentStock: Number(form.currentStock),
        minStockLevel: Number(form.minStockLevel),
        costPerUnit: Number(form.costPerUnit),
        unit: form.unit
      };
      await api.post('/inventory', body);
      setMessage('Inventory item created');
      setForm({ name: '', category: 'vegetables', currentStock: '', minStockLevel: '', costPerUnit: '', unit: 'kg' });
      load();
    } catch {
      setMessage('Failed to create inventory item');
    }
  };

  const restock = async (id) => {
    const qty = prompt('Enter restock quantity:');
    if (!qty) return;
    try {
      await api.put(`/inventory/${id}/restock`, { quantity: Number(qty) });
      setMessage('Restocked');
      load();
    } catch {
      setMessage('Failed to restock');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      setMessage('Item deleted');
      load();
    } catch {
      setMessage('Failed to delete item');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-500 mb-8">Track stock levels and ingredients</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Item Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add Inventory Item</h2>
              {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg mb-4 border border-green-100">{message}</div>}
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4 border border-red-100">{error}</div>}

              <form onSubmit={createItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border p-3" placeholder="e.g. Tomatoes" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border p-3" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="vegetables">vegetables</option>
                    <option value="meat">meat</option>
                    <option value="dairy">dairy</option>
                    <option value="spices">spices</option>
                    <option value="beverages">beverages</option>
                    <option value="grains">grains</option>
                    <option value="others">others</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                    <input className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border p-3" type="number" value={form.currentStock} onChange={e => setForm({ ...form, currentStock: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border p-3" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} required>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="l">l</option>
                      <option value="ml">ml</option>
                      <option value="pieces">pieces</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                    <input className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border p-3" type="number" value={form.minStockLevel} onChange={e => setForm({ ...form, minStockLevel: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost/Unit ($)</label>
                    <input className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border p-3" type="number" step="0.01" value={form.costPerUnit} onChange={e => setForm({ ...form, costPerUnit: e.target.value })} required />
                  </div>
                </div>

                <Button variant="primary" type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-all font-medium">
                  Add Item
                </Button>
              </form>
            </div>
          </div>

          {/* Inventory List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading inventory...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Item</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Stock Level</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Cost</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Status</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map(i => (
                        <tr key={i._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-semibold text-gray-900">{i.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{i.category}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">{i.currentStock} {i.unit}</div>
                            <div className="text-xs text-gray-500">Min: {i.minStockLevel}</div>
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-700">${i.costPerUnit}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${i.isLowStock
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                              }`}>
                              {i.isLowStock ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <Button variant="outline" size="small" onClick={() => restock(i._id)} className="bg-white text-xs">
                              Restock
                            </Button>
                            <button
                              onClick={() => remove(i._id)}
                              className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && !loading && (
                        <tr>
                          <td className="py-12 px-6 text-center text-gray-500" colSpan={5}>No inventory items found. Add one on the left.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
