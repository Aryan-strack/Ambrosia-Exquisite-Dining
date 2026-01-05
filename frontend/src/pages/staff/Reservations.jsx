import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';

const StaffReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reservations');
      setReservations(res.data.data || []);
    } catch (error) {
      setError('Failed to load reservations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
    const interval = setInterval(loadReservations, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateReservationStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status });
      loadReservations();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update reservation');
    }
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-gray-50 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mt-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Reservations</h1>
            <p className="text-gray-500">Manage table bookings and guests</p>
          </div>
          <Button variant="outline" onClick={loadReservations} className="bg-white">
            Refresh
          </Button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 mb-8 flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 capitalize flex-1 sm:flex-none text-center ${filter === status
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {filteredReservations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-2 text-6xl">📅</div>
            <h3 className="text-xl font-medium text-gray-900">No reservations found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map(r => (
              <div key={r._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Table {r.tableNumber}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                      {new Date(r.reservationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                    }`}>
                    {r.status}
                  </span>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                      {r.customer?.name ? r.customer.name.charAt(0) : 'G'}
                    </div>
                    <div>
                      <div className="font-semibold">{r.customer?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{r.contactPhone || 'No phone'}</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 px-1">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(r.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {r.partySize} Guests
                    </span>
                  </div>

                  {r.specialRequests && (
                    <div className="text-xs bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-100">
                      <strong>Note:</strong> {r.specialRequests}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  {r.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => updateReservationStatus(r._id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-100"
                        size="small"
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateReservationStatus(r._id, 'cancelled')}
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {r.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      onClick={() => updateReservationStatus(r._id, 'completed')}
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      size="small"
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffReservations;
