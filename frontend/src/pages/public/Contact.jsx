import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCalendarCheck, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Reservation form state
  const [activeTab, setActiveTab] = useState('message'); // 'message' or 'reservation'
  const [reservationForm, setReservationForm] = useState({
    reservationDate: '',
    partySize: 1,
    tableNumber: '',
    contactPhone: '',
    specialRequests: ''
  });
  const [reservationMessage, setReservationMessage] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleReservationChange = (e) => {
    setReservationForm({ ...reservationForm, [e.target.name]: e.target.value });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        setReservationMessage('Please login to make a reservation');
        return;
      }
      await api.post('/reservations', {
        ...reservationForm,
        tableNumber: parseInt(reservationForm.tableNumber),
        partySize: parseInt(reservationForm.partySize)
      });
      setReservationMessage('Reservation submitted successfully!');
      setReservationForm({
        reservationDate: '',
        partySize: 1,
        tableNumber: '',
        contactPhone: '',
        specialRequests: ''
      });
      setTimeout(() => setReservationMessage(''), 5000);
    } catch (error) {
      setReservationMessage(error.response?.data?.message || 'Failed to submit reservation');
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray pb-20">
      {/* Header Section */}
      <div className="bg-brand-black pt-32 pb-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Contact Bg" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold text-white mb-4"
          >
            Contact <span className="text-brand-gold">&</span> Reservations
          </motion.h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Whether you're looking for a table for two or planning a grand celebration, we're here to make it special.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Forms */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Tab Switcher */}
              <div className="flex bg-gray-50 border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('message')}
                  className={`flex-1 py-6 flex items-center justify-center gap-2 font-display font-bold transition-all ${activeTab === 'message'
                    ? 'bg-white text-brand-gold border-t-4 border-brand-gold'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <FaPaperPlane /> Send a Message
                </button>
                <button
                  onClick={() => setActiveTab('reservation')}
                  className={`flex-1 py-6 flex items-center justify-center gap-2 font-display font-bold transition-all ${activeTab === 'reservation'
                    ? 'bg-white text-brand-gold border-t-4 border-brand-gold'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <FaCalendarCheck /> Book a Table
                </button>
              </div>

              <div className="p-8 lg:p-12">
                <AnimatePresence mode="wait">
                  {activeTab === 'message' ? (
                    <motion.div
                      key="message-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Full Name</label>
                            <input name="name" value={form.name} onChange={onChange} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all" placeholder="Enter your name" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Email Address</label>
                            <input type="email" name="email" value={form.email} onChange={onChange} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all" placeholder="Enter your email" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Your Message</label>
                          <textarea name="message" value={form.message} onChange={onChange} className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all h-40" placeholder="How can we help you?" required />
                        </div>
                        <Button variant="primary" type="submit" className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-brand-gold/20">
                          Send Message
                        </Button>
                        {submitted && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 font-bold text-center flex items-center justify-center gap-2">
                            <FaPaperPlane /> Message Sent Successfully!
                          </motion.p>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="reservation-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {!user && (
                        <div className="mb-8 p-4 bg-brand-gold/10 rounded-2xl border border-brand-gold/20 text-brand-black flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-gold flex-shrink-0 shadow-sm">
                            <FaCalendarCheck />
                          </div>
                          <p className="text-sm font-medium">
                            Exclusive table booking is available for registered guests.
                            <a href="/login" className="text-brand-gold font-bold ml-1 hover:underline">Log in here</a>
                          </p>
                        </div>
                      )}
                      <form onSubmit={handleReservationSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Date & Time</label>
                            <input
                              type="datetime-local"
                              name="reservationDate"
                              value={reservationForm.reservationDate}
                              onChange={handleReservationChange}
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Guests</label>
                            <input
                              type="number"
                              name="partySize"
                              min="1"
                              max="20"
                              value={reservationForm.partySize}
                              onChange={handleReservationChange}
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Contact Phone</label>
                            <input
                              type="tel"
                              name="contactPhone"
                              value={reservationForm.contactPhone}
                              onChange={handleReservationChange}
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                              placeholder="+1 (555) 000-0000"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Preffered Table</label>
                            <select
                              name="tableNumber"
                              value={reservationForm.tableNumber}
                              onChange={handleReservationChange}
                              className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                              required
                            >
                              <option value="">Select Table</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Table {n} (Capacity: 4)</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-brand-black uppercase tracking-wider">Special Requests</label>
                          <textarea
                            name="specialRequests"
                            value={reservationForm.specialRequests}
                            onChange={handleReservationChange}
                            className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all h-32"
                            placeholder="Any allergies, window seat preference, or special occasions?"
                          />
                        </div>
                        <Button variant="primary" type="submit" disabled={!user} className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-brand-gold/20">
                          Confirm Reservation
                        </Button>
                        {reservationMessage && (
                          <p className={`mt-2 font-bold text-center ${reservationMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                            {reservationMessage}
                          </p>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side - Info */}
          <div className="lg:w-1/3 space-y-8">
            {/* Info Card */}
            <div className="bg-brand-black text-white rounded-3xl p-10 shadow-xl relative overflow-hidden">
              <h3 className="text-2xl font-display font-bold text-brand-gold mb-8">Informations</h3>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-gold flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm leading-relaxed">123 Gourmet St, Culinary City, <br />NY 10012, USA</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-gold flex-shrink-0">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-gold flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm">hello@ambrosia.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-gold flex-shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Open Hours</p>
                    <p className="text-sm">Monday - Thursday: 11:00 AM - 11:00 PM & Saturday - Sunday: 11:00 AM - 11:00 PM</p>
                    <p className="text-xs text-brand-red font-bold mt-1">Friday Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg h-64 border border-gray-100 relative group">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Map" className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" />
              <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FaMapMarkerAlt className="text-brand-red text-4xl animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
