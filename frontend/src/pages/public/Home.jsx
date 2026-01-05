import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { FaUtensils, FaWineGlassAlt, FaConciergeBell, FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const Home = () => {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch featured menu items
                const menuRes = await api.get('/menu', { params: { available: 'true', limit: 6 } });
                setFeaturedItems(menuRes.data.data || []);

                // Fetch approved feedback (testimonials)
                const feedRes = await api.get('/feedback', { params: { limit: 3 } });
                setTestimonials(feedRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch home data", err);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="flex flex-col min-h-screen bg-brand-gray overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-brand-black/60 z-10" />
                    <img
                        src="/bg.jpg"
                        alt="Restaurant Ambience"
                        className="w-full h-full object-cover animate-pan-slow"
                    />
                </div>

                <div className="relative z-20 container mx-auto px-4 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-brand-gold font-display text-xl md:text-2xl uppercase tracking-[0.3em] mb-4"
                        >
                            Welcome to
                        </motion.h2>
                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-8xl font-display font-bold text-white mb-8 leading-tight"
                        >
                            AMBROSIA
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 font-light"
                        >
                            Where culinary artistry meets exceptional hospitality. Experience a symphony of flavors.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Link to="/menu">
                                <Button variant="primary" size="large" className="w-full sm:w-auto text-lg px-8 py-4 rounded-full border-2 border-brand-gold">
                                    View Full Menu
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="large" className="w-full sm:w-auto text-lg px-8 py-4 rounded-full text-white border-white hover:bg-white hover:text-yellow-500">
                                    Book a Table
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                    </div>
                </motion.div>
            </section>

            {/* Features / Philosophy */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                                <FaUtensils className="text-2xl text-brand-gold group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-4">Master Chefs</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our culinary team brings decades of experience from the world's finest kitchens.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                                <FaWineGlassAlt className="text-2xl text-brand-gold group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-4">Curated Wines</h3>
                            <p className="text-gray-600 leading-relaxed">
                                An extensive collection of vintage wines selected to perfectly pair with your meal.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-brand-gold/10 rounded-full flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                                <FaConciergeBell className="text-2xl text-brand-gold group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-4">Premium Service</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Impeccable attention to detail ensuring your dining experience is nothing short of perfect.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Split Section: Image + Text */}
            <section className="py-24 bg-brand-black text-white overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 border-2 border-brand-gold/30 rounded-lg transform translate-x-4 translate-y-4"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Chef Plating"
                                    className="relative rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <h3 className="text-brand-gold uppercase tracking-widest font-semibold mb-2">Our Workflow</h3>
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Precision in Every Plate</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                At Ambrosia, cooking is not just a process; it is an art form. We source the finest organic ingredients from local farmers and combine them with international techniques to create dishes that tell a story.
                            </p>
                            <Link to="/about">
                                <Button variant="outline" className="text-brand-gold border-brand-gold hover:bg-brand-gold hover:text-brand-black px-8">
                                    Read Our Story
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Dishes (Placeholder Data) */}
            <section className="py-24 bg-brand-gray">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-brand-black mb-4">Signature Dishes</h2>
                        <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="relative h-72 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-brand-gold font-bold shadow-sm">
                                        ${item.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-display font-bold group-hover:text-brand-gold transition-colors">{item.name}</h3>
                                        <div className="flex text-brand-gold text-xs">
                                            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-6 line-clamp-2">{item.description}</p>
                                    <Link to="/menu">
                                        <Button variant="ghost" className="text-brand-gold hover:bg-brand-gold/10 p-0 hover:px-4 transition-all uppercase tracking-widest text-xs font-bold">
                                            Discovery Taste &rarr;
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                        {featuredItems.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-400 font-display italic">
                                Savoring the moment... our signature collection is arriving soon.
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/menu">
                            <Button variant="primary" size="large">View Complete Menu</Button>
                        </Link>
                    </div>
                </div>
            </section>
            {/* Testimonials Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h3 className="text-brand-gold uppercase tracking-widest font-semibold mb-2">Guest Book</h3>
                        <h2 className="text-4xl font-display font-bold text-brand-black mb-4">Words from our Patrons</h2>
                        <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-50 p-8 rounded-2xl relative group hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <FaQuoteLeft className="text-4xl text-brand-gold/20 mb-6 group-hover:text-brand-gold/40 transition-colors" />

                                <div className="flex text-brand-gold mb-4 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? "text-brand-gold" : "text-gray-300"} />
                                    ))}
                                </div>

                                <p className="text-gray-600 mb-6 italic leading-relaxed min-h-[80px]">
                                    "{review.comment}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-black text-brand-gold rounded-full flex items-center justify-center font-bold font-display text-xl">
                                        {review.customer?.name?.charAt(0) || 'G'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-black">{review.customer?.name || 'Guest'}</h4>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest">Verified Diner</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {testimonials.length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
