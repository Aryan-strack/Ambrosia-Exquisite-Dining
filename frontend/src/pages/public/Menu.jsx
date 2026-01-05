import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUrl';
import { FaSearch, FaFilter, FaShoppingBasket, FaStar, FaUtensils } from 'react-icons/fa';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes] = await Promise.all([
          api.get('/menu', {
            params: {
              category: category || undefined,
              available: includeOutOfStock ? undefined : 'true'
            }
          }),
          api.get('/menu/categories')
        ]);
        setItems(menuRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (error) {
        console.error(error);
        setError('Failed to load menu. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category, includeOutOfStock]);

  const filteredItems = useMemo(() => {
    return items
      .filter(i => i.price >= priceRange[0] && i.price <= priceRange[1])
      .filter(i => (i.name || '').toLowerCase().includes(search.toLowerCase()));
  }, [items, search, priceRange]);

  const handleAddToCart = (item) => {
    if (item.isAvailable) {
      addToCart(item, 1);
      setToast(`${item.name} added to your basket!`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray pb-20">
      {/* Page Header */}
      <div className="bg-brand-black pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Menu Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold text-white mb-4"
          >
            Our Culinary <span className="text-brand-gold">Menu</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-brand-gold mx-auto"
          ></motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* Search & Filter Trigger */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl glass-panel focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            className="flex items-center gap-2 py-4"
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category Feed</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCategory('')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === '' ? 'bg-brand-gold text-brand-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      All Dishes
                    </button>
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-brand-gold text-brand-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price Spectrum</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-gray-400 uppercase tracking-tighter">Min</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-400 uppercase tracking-tighter">Max</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full bg-gray-50 border-none rounded-lg p-2 focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeOutOfStock}
                      onChange={e => setIncludeOutOfStock(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Include Out of Stock</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Curating flavors...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-brand-red font-semibold">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Try Again</Button>
          </div>
        )}

        {/* Items Grid */}
        {!loading && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredItems.map(item => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <FaUtensils size={40} />
                    </div>
                  )}

                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-brand-black text-[0.7rem] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    {!item.isAvailable && (
                      <span className="bg-brand-red text-white text-[0.7rem] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                    <Link to={`/menu/${item._id}`}>
                      <button className="bg-white text-brand-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors shadow-lg">
                        <FaSearch size={14} />
                      </button>
                    </Link>
                    {item.isAvailable && (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-brand-gold text-brand-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <FaShoppingBasket size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-bold text-gray-900 group-hover:text-brand-gold transition-colors">{item.name}</h3>
                    <div className="flex items-center text-brand-gold text-sm font-bold">
                      <FaStar className="mr-1" /> 4.9
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-2xl font-display font-bold text-brand-black">${item.price}</span>
                    <Button
                      variant={item.isAvailable ? "primary" : "outline"}
                      size="small"
                      disabled={!item.isAvailable}
                      onClick={() => handleAddToCart(item)}
                      className="rounded-full px-5"
                    >
                      {item.isAvailable ? 'Order Now' : 'Unavailable'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <FaUtensils className="text-4xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-400">No dishes match your criteria</h3>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
            <Button onClick={() => { setCategory(''); setSearch(''); setPriceRange([0, 1000]); setAvailableOnly(false); }} variant="ghost" className="mt-4">Reset All Filters</Button>
          </div>
        )}
      </div>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-10 right-10 z-[100] bg-brand-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-brand-gold/30"
          >
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-black">
              <FaShoppingBasket />
            </div>
            <div>
              <p className="font-bold text-sm">Success!</p>
              <p className="text-xs text-brand-gold">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
