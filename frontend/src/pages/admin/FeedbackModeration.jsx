import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const FeedbackModeration = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feedback/admin');
      setFeedback(res.data.data || []);
    } catch {
      setError('Failed to load feedback');
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

  const searchByOrder = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      const res = await api.get(`/feedback/order/${orderId}`);
      const list = res.data.data ? [res.data.data] : [];
      setFeedback(list);
    } catch {
      setMessage('No feedback found for order');
    }
  };

  const setApproval = async (id, isApproved) => {
    try {
      await api.put(`/feedback/${id}`, { isApproved });
      setMessage('Updated');
      load();
    } catch {
      setMessage('Failed to update');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      setMessage('Deleted');
      load();
    } catch {
      setMessage('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Moderation</h1>
        <p className="text-gray-500 mb-8">Review and approve customer reviews</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <form onSubmit={searchByOrder} className="flex w-full md:w-auto gap-2">
              <input
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-full md:w-64 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by Order ID..."
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
              />
              <Button variant="primary" className="bg-gray-900 text-white shadow-md">Search</Button>
              <Button variant="outline" onClick={() => { setOrderId(''); load(); }} type="button" className="bg-white">Clear</Button>
            </form>
          </div>

          {message && <div className="p-3 bg-green-50 text-green-700 text-sm border-b border-green-100 text-center">{message}</div>}
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm border-b border-red-100 text-center">{error}</div>}

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading feedback...</div>
            ) : feedback.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No feedback reviews found.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Review Details</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Rating</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-600">Status</th>
                    <th className="py-4 px-6 text-right font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feedback.map(f => (
                    <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">Order #{f.order?.orderNumber || f.order}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium text-gray-900">{f.customer?.name}</span> said:
                        </div>
                        <div className="text-gray-500 italic mt-1 line-clamp-2">"{f.comment || 'No comment provided'}"</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < f.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{f.rating}/5.0</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${f.isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {f.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => setApproval(f._id, !f.isApproved)}
                          className={f.isApproved ? "text-yellow-600 hover:bg-yellow-50 border-yellow-200" : "text-green-600 hover:bg-green-50 border-green-200"}
                        >
                          {f.isApproved ? 'Unapprove' : 'Approve'}
                        </Button>
                        <Button variant="danger" size="small" onClick={() => remove(f._id)} className="bg-white hover:bg-red-50 text-red-600 border-red-200">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModeration;
