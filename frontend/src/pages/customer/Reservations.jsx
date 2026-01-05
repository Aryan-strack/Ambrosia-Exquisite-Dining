import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reservations');
        setReservations(res.data.data || []);
      } catch {
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    try {
      await api.delete(`/reservations/${id}`);
      setReservations(reservations.filter(r => r._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
        <Link to="/contact">
          <Button variant="primary">Book New Table</Button>
        </Link>
      </div>
      
      {loading && <div className="text-center py-12 text-gray-600">Loading reservations...</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
      
      {reservations.length === 0 && !loading && (
        <div className="bg-white p-12 rounded-lg shadow border text-center">
          <p className="text-gray-600 mb-4">You don't have any reservations yet.</p>
          <Link to="/contact">
            <Button variant="primary">Book a Table</Button>
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map(r => (
          <div key={r._id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Table {r.tableNumber}</h3>
                <p className="text-sm text-gray-500">Reservation #{r._id.slice(-6)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded font-medium capitalize ${getStatusColor(r.status)}`}>
                {r.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Date & Time:</span>
                <span>{new Date(r.reservationDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Party Size:</span>
                <span>{r.partySize} {r.partySize === 1 ? 'guest' : 'guests'}</span>
              </div>
              {r.contactPhone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{r.contactPhone}</span>
                </div>
              )}
              {r.specialRequests && (
                <div className="mt-2 pt-2 border-t">
                  <span className="font-medium">Special Requests:</span>
                  <p className="text-gray-700 mt-1">{r.specialRequests}</p>
                </div>
              )}
            </div>
            
            {r.status !== 'cancelled' && r.status !== 'completed' && (
              <Button 
                variant="outline" 
                size="small" 
                onClick={() => cancelReservation(r._id)}
                className="w-full"
              >
                Cancel Reservation
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
