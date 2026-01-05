import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaCommentAlt, FaReceipt, FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaUtensils } from 'react-icons/fa';
import api from '../../services/api';
import Button from '../../components/common/Button';

const Feedback = () => {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      // Only show completed orders
      const completedOrders = (res.data.data || []).filter(
        o => o.status === 'completed'
      );
      setOrders(completedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onSubmit = async event => {
    event.preventDefault();
    if (!orderId) return;

    try {
      setMessage(null);
      setSubmitting(true);
      await api.post('/feedback', { order: orderId, rating, comment });

      setMessage({ type: 'success', text: 'Thank you! Your feedback helps us maintain culinary excellence.' });
      setOrderId('');
      setRating(5);
      setComment('');

      // Refresh list
      loadOrders();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Fine dining requires perfection. Please try again.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block"
          >
            <div className="w-16 h-1 bg-brand-gold mx-auto mb-4"></div>
            <h1 className="text-5xl font-display font-bold text-brand-black">Your <span className="text-brand-gold">Voice</span></h1>
          </motion.div>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            At <span className="text-brand-gold font-bold">Ambrosia</span>, every detail matters. Share your dining experience to help us reach new heights of perfection.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Feedback Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-8 lg:p-12">
              {loading ? (
                <div className="flex flex-col items-center py-20">
                  <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-400 italic">Finding your experiences...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto">
                    <FaReceipt size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-brand-black">No Completed Orders</h3>
                    <p className="text-gray-400 mt-2">Feedback is reserved for guests who have completed their dining journey.</p>
                  </div>
                  <Button variant="primary" onClick={() => window.location.href = '/menu'}>Explore Our Menu</Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-10">
                  {/* Order Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2">
                      <FaReceipt /> Select Your Order
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {orders.map(order => (
                        <button
                          key={order._id}
                          type="button"
                          onClick={() => setOrderId(order._id)}
                          className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${orderId === order._id
                            ? 'border-brand-gold bg-brand-gold/5 shadow-md ring-2 ring-brand-gold/20'
                            : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 opacity-60 hover:opacity-100'
                            }`}
                        >
                          <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest">Order #{order.orderNumber || order._id.slice(-6)}</span>
                          <span className="text-lg font-display font-bold text-brand-black">${order.totalAmount?.toFixed(2)}</span>
                          <span className="text-[0.65rem] text-brand-gold font-bold">Completed on {new Date(order.updatedAt).toLocaleDateString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Star Rating Section */}
                  <div className="space-y-4 pt-10 border-t border-gray-50 text-center">
                    <h3 className="text-sm font-bold text-brand-black uppercase tracking-[0.2em]">The Experience Scale</h3>
                    <div className="flex items-center justify-center gap-4">
                      {[1, 2, 3, 4, 5].map(n => (
                        <motion.button
                          key={n}
                          type="button"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(n)}
                          className={`text-4xl transition-colors duration-300 ${(hoverRating || rating) >= n
                            ? 'text-brand-gold drop-shadow-md'
                            : 'text-gray-200'
                            }`}
                        >
                          <FaStar />
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-2 h-4">
                      {rating === 5 ? 'Exquisite Experience' :
                        rating === 4 ? 'Great Service' :
                          rating === 3 ? 'Satisfactory' :
                            rating === 2 ? 'Needs Improvement' :
                              rating === 1 ? 'Poor Experience' : ''}
                    </p>
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-4 pt-10 border-t border-gray-50">
                    <h3 className="text-sm font-bold text-brand-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <FaCommentAlt className="text-brand-gold" /> Personalized Comments
                    </h3>
                    <textarea
                      className="w-full bg-gray-50 border-none rounded-[2rem] p-6 focus:ring-2 focus:ring-brand-gold transition-all h-40 text-gray-600 placeholder:italic"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Tell us about the flavors, the service, or any special moments..."
                      required
                    />
                  </div>

                  {/* Submission Area */}
                  <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <AnimatePresence>
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`flex items-center gap-2 font-bold text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
                        >
                          {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                          {message.text}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting || !orderId}
                      className="w-full md:w-auto px-12 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-3 transition-all transform active:scale-95"
                    >
                      {submitting ? 'Authenticating...' : <><FaPaperPlane /> Submit Feedback</>}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info Card */}
          <div className="bg-brand-black text-white p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FaUtensils size={100} />
            </div>
            <h4 className="text-brand-gold font-display font-bold text-2xl mb-4 italic">"True culinary art is a journey fueled by the feedback of our honored guests."</h4>
            <p className="text-gray-400 text-sm uppercase tracking-[0.3em]">Ambrosia Executive Chef</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
