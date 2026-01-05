import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaCalendarAlt, FaHistory, FaWallet, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Orders', value: '0', icon: <FaBoxOpen />, color: 'text-brand-gold' },
    { label: 'Reservations', value: '0', icon: <FaCalendarAlt />, color: 'text-blue-500' },
    { label: 'Order History', value: '0', icon: <FaHistory />, color: 'text-brand-gold' },
    { label: 'Total Spending', value: '$0', icon: <FaWallet />, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-black text-white p-8 lg:p-12 rounded-[2rem] border border-brand-gold/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center text-brand-black text-4xl">
              <FaUserCircle />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold">Welcome, {user?.name || 'Valued Guest'}</h1>
              <p className="text-gray-400 mt-2">Personalize your dining experience at <span className="text-brand-gold font-bold">Ambrosia</span>.</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group"
            >
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-brand-black">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaHistory className="text-brand-gold" /> Recent Activity
            </h3>
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
              <p>No recent activity found.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
            <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaCalendarAlt className="text-brand-gold" /> Upcoming Reservations
            </h3>
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
              <p>No upcoming reservations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
