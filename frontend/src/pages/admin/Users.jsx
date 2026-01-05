import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/users', { params: { page, limit: 10 } });
      setUsers(res.data.data || []);
    } catch {
      setError('Failed to load users');
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
  }, [page]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/auth/users/${id}/status`, { isActive: !isActive });
      setMessage('Status updated');
      load();
    } catch {
      setMessage('Failed to update status');
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/auth/users/${id}/role`, { role });
      setMessage('Role updated');
      load();
    } catch {
      setMessage('Failed to update role');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-500 mb-8">Manage system access and user roles</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {message && <div className="p-4 bg-green-50 text-green-700 border-b border-green-100 text-sm font-medium">{message}</div>}
          {error && <div className="p-4 bg-red-50 text-red-700 border-b border-red-100 text-sm font-medium">{error}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold text-gray-600">User Details</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-600">Role</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-600">Status</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="4" className="py-12 text-center text-gray-500">Loading users...</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={e => changeRole(u._id, e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="chef">Chef</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.isActive ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant={u.isActive ? "danger" : "primary"}
                        size="small"
                        onClick={() => toggleActive(u._id, u.isActive)}
                        className={`text-xs px-4 py-2 ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-100'}`}
                      >
                        {u.isActive ? 'Deactivate Account' : 'Activate Account'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td className="py-12 px-6 text-center text-gray-500" colSpan={4}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-500">Page {page}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-white">Previous</Button>
              <Button variant="outline" size="small" onClick={() => setPage(p => p + 1)} className="bg-white">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
