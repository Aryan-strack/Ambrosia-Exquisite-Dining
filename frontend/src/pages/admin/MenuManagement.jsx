import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { getImageUrl } from '../../utils/imageUrl';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'main-course',
    description: '',
    price: '',
    preparationTime: '',
    image: null
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu', { params: { limit: 100 } });
      setItems(res.data.data || []);
    } catch {
      setError('Failed to load menu items');
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
      // Validate form before submission
      if (!form.name || !form.description || !form.price || !form.preparationTime) {
        setError('Please fill all required fields');
        setMessage('');
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('category', form.category);
      formData.append('description', form.description.trim());
      formData.append('price', form.price);
      formData.append('preparationTime', form.preparationTime);

      if (form.image) {
        formData.append('image', form.image);
      }

      console.log('Submitting:', {
        name: form.name,
        category: form.category,
        description: form.description,
        price: form.price,
        preparationTime: form.preparationTime,
        hasImage: !!form.image
      });

      await api.post('/menu', formData);
      setMessage('Item created successfully');
      setError('');
      setForm({ name: '', category: 'main-course', description: '', price: '', preparationTime: '', image: null });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      load();
    } catch (err) {
      const errorMsg = err.response?.data?.errors
        ? err.response.data.errors.map(e => e.msg || e.message).join(', ')
        : err.response?.data?.message || err.message || 'Failed to create item';
      setError(errorMsg);
      setMessage('');
      console.error('Create error:', err.response?.data || err);
    }
  };

  const updateItem = async (id, patch) => {
    try {
      await api.put(`/menu/${id}`, patch);
      setMessage('Item updated');
      load();
    } catch {
      setMessage('Failed to update item');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/menu/${id}`);
      setMessage('Item deleted');
      load();
    } catch {
      setMessage('Failed to delete item');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-500 mt-1">Create and manage your restaurant's offerings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Item Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Item</h2>
              {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg mb-4 border border-green-100">{message}</div>}
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4 border border-red-100">{error}</div>}

              <form onSubmit={createItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 border p-3"
                    placeholder="e.g. Truffle Pasta"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 border p-3"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="starters">Starters</option>
                    <option value="main-course">Main Course</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Drinks</option>
                    <option value="sides">Sides</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 border p-3"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time (mins)</label>
                    <input
                      className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 border p-3"
                      placeholder="e.g. 20"
                      type="number"
                      value={form.preparationTime}
                      onChange={e => setForm({ ...form, preparationTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 border p-3 min-h-[100px]"
                    placeholder="Describe the dish ingredients and taste..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    type="file"
                    accept="image/*"
                    onChange={e => setForm({ ...form, image: e.target.files[0] })}
                  />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full py-3 rounded-xl shadow-lg transition-all font-medium"
                >
                  Create Item
                </Button>
              </form>
            </div>
          </div>

          {/* Menu List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading menu items...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600 first:rounded-tl-2xl">Item</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Category</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Price</th>
                        <th className="py-4 px-6 text-left font-semibold text-gray-600">Status</th>
                        <th className="py-4 px-6 text-right font-semibold text-gray-600 last:rounded-tr-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map(i => (
                        <tr key={i._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                {i.image ? (
                                  <img
                                    src={getImageUrl(i.image)}
                                    alt={i.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64?text=No+Img'; }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{i.name}</div>
                                <div className="text-xs text-gray-500 line-clamp-1 max-w-[150px]">{i.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                              {i.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-900">${i.price.toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => updateItem(i._id, { isAvailable: !i.isAvailable })}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${i.isAvailable
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                }`}
                            >
                              {i.isAvailable ? 'Available' : 'Unavailable'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => deleteItem(i._id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete Item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && !loading && (
                        <tr>
                          <td className="py-12 text-center text-gray-500" colSpan={5}>
                            No menu items found. Add one on the left.
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
      </div>
    </div>
  );
};

export default MenuManagement;
