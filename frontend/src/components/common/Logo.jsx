import React from 'react';
import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', variant = 'dark' }) => {
    const textColor = variant === 'light' ? 'text-white' : 'text-brand-black';
    const iconColor = 'text-brand-gold';

    return (
        <Link to="/" className={`flex items-center gap-2 group ${className}`}>
            <motion.div
                whileHover={{ rotate: 20 }}
                className={`p-2 rounded-full border-2 border-brand-gold ${variant === 'light' ? 'bg-transparent' : 'bg-brand-black'}`}
            >
                <FaUtensils className={`${iconColor} text-lg`} />
            </motion.div>
            <div className="flex flex-col">
                <span className={`font-display font-bold text-2xl tracking-wide ${textColor}`}>
                    AMBROSIA
                </span>
                <span className={`text-[0.65rem] uppercase tracking-[0.2em] ${textColor} opacity-80`}>
                    Exquisite Dining
                </span>
            </div>
        </Link>
    );
};

export default Logo;
