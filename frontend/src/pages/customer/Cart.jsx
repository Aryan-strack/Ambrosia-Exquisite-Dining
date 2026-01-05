import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import { getImageUrl } from '../../utils/imageUrl';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-40 px-4 bg-brand-gray flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-12 rounded-[3rem] shadow-xl max-w-lg w-full border border-gray-100"
        >
          <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold mx-auto mb-8 text-4xl">
            <FaShoppingBag />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-black mb-4">Your Basket is Empty</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            It looks like you haven't added any of our culinary specialties to your basket yet.
          </p>
          <Link to="/menu">
            <Button variant="primary" size="large" className="px-10 rounded-full">Explore Menu</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-brand-black">Your <span className="text-brand-gold">Basket</span></h1>
            <p className="text-gray-500 mt-2">You have {cartItems.length} items in your selection.</p>
          </div>
          <Link to="/menu" className="flex items-center text-brand-gold font-bold hover:underline gap-2">
            <FaArrowLeft /> Keep Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 group hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-display font-bold text-brand-black">{item.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-brand-gold transition-all"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="w-10 text-center font-bold text-brand-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white hover:text-brand-gold transition-all"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total Price</p>
                          <p className="text-xl font-display font-bold text-brand-gold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-6">
              <Button variant="ghost" onClick={clearCart} className="text-gray-400 hover:text-red-500 flex items-center gap-2">
                <FaTrash /> Clear Whole Basket
              </Button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-brand-black text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-28 border border-white/5">
              <h2 className="text-2xl font-display font-bold mb-8 text-brand-gold">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (10%)</span>
                  <span className="text-white font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery fee</span>
                  <span className="text-brand-gold font-bold">FREE</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-10 flex justify-between items-end">
                <span className="text-lg font-display">Grand Total</span>
                <span className="text-4xl font-display font-bold text-brand-gold">${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button variant="primary" size="large" className="w-full py-5 rounded-2xl text-lg font-bold shadow-xl shadow-brand-gold/10">
                  Proceed to Checkout &rarr;
                </Button>
              </Link>

              <div className="mt-8 flex items-center justify-center gap-4 text-[0.65rem] text-gray-500 uppercase tracking-widest text-center">
                <span className="flex items-center gap-1">🔒 SECURE CHECKOUT</span>
                <span className="flex items-center gap-1">✨ PREMIUM SERVICE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
