import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaCamera, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Update form data if user context changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      });
    }
  }, [user]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setNotification(null);
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data.success) {
        setNotification({ type: 'success', message: 'Profile updated successfully!' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: error.response?.data?.message || 'Update failed. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-block mb-6"
          >
            <div className="w-32 h-32 rounded-full bg-brand-black flex items-center justify-center text-brand-gold text-5xl border-4 border-white shadow-xl">
              <FaUser />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-black border-4 border-white shadow-lg hover:scale-110 transition-transform">
              <FaCamera size={14} />
            </button>
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-brand-black">Your <span className="text-brand-gold">Profile</span></h1>
          <p className="text-gray-500 mt-2">Manage your personal information and preferences.</p>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={onSubmit} className="p-8 lg:p-12 space-y-10">
            {/* Basic Information */}
            <section>
              <h3 className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <FaUser /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="name"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-brand-gold transition-all"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-gray-300">Email Address (Read-only)</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      className="w-full bg-gray-100 border-none rounded-2xl p-4 pl-12 text-gray-400 cursor-not-allowed"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      name="phone"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-brand-gold transition-all"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Address Information */}
            <section>
              <h3 className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <FaMapMarkerAlt /> Delivery Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                  <input
                    name="street"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    placeholder="123 Gourmet Ave"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input
                    name="city"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                      <input
                        name="state"
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        placeholder="NY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">ZIP Code</label>
                      <input
                        name="zipCode"
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                        value={formData.address.zipCode}
                        onChange={handleAddressChange}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
              <AnimatePresence>
                {notification && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center gap-2 font-bold text-sm ${notification.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {notification.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-3"
              >
                {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
