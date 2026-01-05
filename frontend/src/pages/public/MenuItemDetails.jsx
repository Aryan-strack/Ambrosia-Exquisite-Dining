import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMinus, FaPlus, FaChevronLeft, FaClock, FaFireAlt, FaSeedling, FaUtensils, FaDna, FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUrl';

const MenuItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/menu/${id}`);
        setItem(res.data.data);
      } catch (error) {
        console.error(error);
        setError('Exquisite flavors take time to find. We couldn\'t find this dish.');
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleAddToCart = () => {
    if (item && item.isAvailable) {
      addToCart(item, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 font-display italic">Preparing the details...</p>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-display font-bold text-brand-black mb-4">{error || "Dish not found"}</h2>
      <Link to="/menu">
        <Button variant="primary">Return to Menu</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
        >
          <FaChevronLeft size={10} /> Back to Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group lg:sticky lg:top-32"
          >
            <div className="absolute -inset-4 bg-brand-gold/10 rounded-[3rem] transform rotate-2"></div>
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-gray-100">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-[2px] flex items-center justify-center p-8">
                  <span className="bg-brand-red text-white font-display font-bold px-8 py-3 rounded-full text-xl shadow-2xl">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="text-brand-gold font-bold uppercase tracking-[0.3em] text-xs mb-2 block">{item.category}</span>
              <h1 className="text-5xl font-display font-bold text-brand-black mb-4 leading-tight">{item.name}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-2"><FaClock className="text-brand-gold" /> {item.preparationTime} mins</span>
                <span className="flex items-center gap-2"><FaFireAlt className="text-brand-gold" /> {item.nutritionalInfo?.calories || '—'} Cal</span>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">
              "{item.description}"
            </p>

            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Price</span>
                <span className="text-4xl font-display font-bold text-brand-gold">${item.price.toFixed(2)}</span>
              </div>

              {item.isAvailable && (
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Serving Size</span>
                  <div className="flex items-center bg-white rounded-2xl p-2 border border-gray-100 shadow-sm w-36">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-brand-gold transition-all"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="flex-1 text-center font-bold text-brand-black">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-brand-gold transition-all"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
                <h3 className="text-sm font-bold text-brand-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FaSeedling className="text-brand-gold" /> Key Ingredients
                </h3>
                <ul className="space-y-3">
                  {(item.ingredients && item.ingredients.length > 0) ? item.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center justify-between">
                      <span className="capitalize">{ing.name}</span>
                      {ing.quantity && <span className="text-xs font-bold text-brand-gold">{ing.quantity}</span>}
                    </li>
                  )) : (
                    <li className="text-sm text-gray-300 italic">Chef's secret selection</li>
                  )}
                </ul>
              </div>

              <div className="bg-brand-black p-8 rounded-[2rem] text-white shadow-xl">
                <h3 className="text-sm font-bold text-brand-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FaDna /> Nutrition
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-tighter">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Protein</span>
                    <span className="text-lg text-white">{item.nutritionalInfo?.protein ?? '—'}g</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Carbs</span>
                    <span className="text-lg text-white">{item.nutritionalInfo?.carbs ?? '—'}g</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Fat</span>
                    <span className="text-lg text-white">{item.nutritionalInfo?.fat ?? '—'}g</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Fiber</span>
                    <span className="text-lg text-white">{item.nutritionalInfo?.fiber ?? '—'}g</span>
                  </div>
                </div>
              </div>
            </div>

            {item.isAvailable && (
              <div className="relative">
                <Button
                  variant="primary"
                  size="large"
                  className="w-full py-6 rounded-2xl text-xl font-bold shadow-2xl shadow-brand-gold/20 flex items-center justify-center gap-4"
                  onClick={handleAddToCart}
                >
                  <FaUtensils /> Experience This Dish
                </Button>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
                    >
                      <FaCheckCircle /> Successfully Added to Selection
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;
