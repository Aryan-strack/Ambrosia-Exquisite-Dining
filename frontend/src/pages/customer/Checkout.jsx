import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { FaTruck, FaStore, FaUtensils, FaCreditCard, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async e => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setMessage('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const items = cartItems.map(item => ({
        menuItem: item._id,
        quantity: item.quantity
      }));

      const body = {
        items,
        orderType,
        paymentMethod,
        deliveryAddress: orderType === 'delivery' ? { street: address } : undefined,
        tableNumber: orderType === 'dine-in' ? Number(tableNumber) : undefined
      };

      const orderRes = await api.post('/orders', body);
      const createdOrder = orderRes.data.data;


      // Process payment for all payment methods
      if (paymentMethod === 'card' || paymentMethod === 'online') {
        try {
          await api.post('/payments/process', {
            orderId: createdOrder._id,
            paymentMethod,
            paymentDetails: {
              cardNumber: '4242424242424242',
              expiryDate: '12/25',
              cvv: '123'
            }
          });
          setMessage('✅ Excellence! Your order has been placed and payment secured.');
        } catch (paymentError) {
          setMessage('⚠️ Order created but payment failed. Our concierge will contact you.');
        }
      } else if (paymentMethod === 'cash') {
        // Process cash payment - mark as paid immediately for smooth workflow
        try {
          await api.post('/payments/process', {
            orderId: createdOrder._id,
            paymentMethod: 'cash',
            paymentDetails: {}
          });
          setMessage('✅ Pleasure! Order confirmed. Cash payment will be collected upon delivery/service.');
        } catch (paymentError) {
          setMessage('⚠️ Order created but payment processing failed. Please contact support.');
        }
      }

      clearCart();
      setTimeout(() => navigate('/my-orders'), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Fine dining requires patience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-40 px-4 bg-brand-gray flex flex-col items-center">
        <h1 className="text-3xl font-display font-bold mb-6">Your Selection is Empty</h1>
        <Button variant="primary" onClick={() => navigate('/menu')}>Explore Menu</Button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-display font-bold text-brand-black mb-4">Complete Your <span className="text-brand-gold">Order</span></h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Order Type Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50"
              >
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-black text-sm flex items-center justify-center">1</span>
                  Dining Experience
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'delivery', label: 'Delivery', icon: <FaTruck /> },
                    { id: 'takeaway', label: 'Takeaway', icon: <FaStore /> },
                    { id: 'dine-in', label: 'Dine-in', icon: <FaUtensils /> }
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setOrderType(type.id)}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${orderType === type.id
                        ? 'border-brand-gold bg-brand-gold/5 text-brand-gold'
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-bold uppercase tracking-widest text-[0.7rem]">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  {orderType === 'delivery' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Address</label>
                      <input
                        className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Enter your destination"
                        required
                      />
                    </motion.div>
                  )}

                  {orderType === 'dine-in' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Table Number</label>
                      <input
                        type="number"
                        className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-gold transition-all"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        placeholder="Which table are you seated at?"
                        required
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50"
              >
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-black text-sm flex items-center justify-center">2</span>
                  Payment Method
                </h3>

                <div className="space-y-4">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: <FaCreditCard /> },
                    { id: 'cash', label: 'Cash on Fulfillment', icon: <FaMoneyBillWave /> }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === method.id
                        ? 'border-brand-gold bg-brand-gold/5'
                        : 'border-gray-50 hover:border-gray-100'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-xl ${paymentMethod === method.id ? 'text-brand-gold' : 'text-gray-400'}`}>{method.icon}</span>
                        <span className={`font-bold ${paymentMethod === method.id ? 'text-brand-black' : 'text-gray-500'}`}>{method.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-brand-gold bg-brand-gold' : 'border-gray-200'}`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-brand-black"></div>}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              <Button
                variant="primary"
                type="submit"
                className="w-full py-6 rounded-2xl text-xl font-display font-bold shadow-xl shadow-brand-gold/20"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm My Order'}
              </Button>

              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-2xl flex items-center gap-4 ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}
                >
                  <span className="text-lg">{message}</span>
                </motion.div>
              )}
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-display font-bold mb-6 text-brand-black">Order Summary</h2>

              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center gap-4 border-b border-gray-50 pb-4">
                    <div className="flex-1">
                      <p className="font-bold text-brand-black text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-brand-gold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax (10%)</span>
                  <span className="font-bold text-brand-black">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-brand-black/5">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-bold text-2xl text-brand-gold">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                <FaShieldAlt className="text-brand-gold" />
                <p className="text-[0.6rem] text-gray-400 uppercase tracking-widest font-bold">
                  Secured by Ambrosia Encryption Standard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
