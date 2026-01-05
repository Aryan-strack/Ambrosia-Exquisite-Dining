import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/CartContext';
import { FaBars, FaTimes, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import Button from '../common/Button';
import Logo from '../common/Logo';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getCartItemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Define navigation links based on roles
    const getLinks = () => {
        if (!user) {
            return [
                { name: 'Home', path: '/' },
                { name: 'Menu', path: '/menu' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
            ];
        }

        switch (user.role) {
            case 'customer':
                return [
                    { name: 'Home', path: '/' },
                    { name: 'Menu', path: '/menu' },
                    { name: 'Orders', path: '/my-orders' },
                    { name: 'Reservations', path: '/my-reservations' },
                    { name: 'Feedback', path: '/feedback' },
                ];
            case 'staff':
                return [
                    { name: 'Dashboard', path: '/staff/dashboard' },
                    { name: 'Orders', path: '/staff/orders' },
                    { name: 'Reservations', path: '/staff/reservations' },
                ];
            case 'chef':
                return [
                    { name: 'Dashboard', path: '/chef/dashboard' },
                    { name: 'Kitchen Orders', path: '/chef/orders' },
                ];
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/admin/dashboard' },
                    { name: 'Users', path: '/admin/users' },
                    { name: 'Menu', path: '/admin/menu' },
                    { name: 'Inventory', path: '/admin/inventory' },
                    { name: 'Orders', path: '/admin/orders' },
                    { name: 'Payments', path: '/admin/payments' },
                    { name: 'Reports', path: '/admin/reports' },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const navbarValidator = scrolled || location.pathname !== '/'
        ? 'bg-white/90 backdrop-blur-md shadow-lg py-2'
        : 'bg-white/50 py-4';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarValidator}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Logo variant={scrolled || location.pathname !== '/' ? 'dark' : 'dark'} />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors hover:text-brand-gold ${isActive ? 'text-brand-gold font-bold' : 'text-gray-800'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        {user?.role === 'customer' && (
                            <Link to="/cart" className="relative p-2 text-gray-800 hover:text-brand-gold transition-colors">
                                <FaShoppingCart className="h-5 w-5" />
                                <AnimatePresence>
                                    {getCartItemCount() > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-brand-red rounded-full"
                                        >
                                            {getCartItemCount()}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        )}

                        {!user ? (
                            <div className="flex items-center space-x-3 ml-4">
                                <Link to="/login">
                                    <Button variant="ghost" size="small">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="small">Register</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                                <Link to="/profile" className="flex items-center text-gray-800 hover:text-brand-gold transition-colors">
                                    <FaUserCircle className="h-6 w-6 mr-2" />
                                    <span className="text-sm font-medium hidden lg:block">{user.name || 'Profile'}</span>
                                </Link>
                                <Button variant="outline" size="small" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-gold focus:outline-none"
                        >
                            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {links.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-3 py-3 rounded-md text-base font-medium ${isActive ? 'text-brand-gold bg-brand-gold/10' : 'text-gray-700 hover:text-brand-gold hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            {user?.role === 'customer' && (
                                <Link to="/cart" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-gold hover:bg-gray-50">
                                    Cart ({getCartItemCount()})
                                </Link>
                            )}

                            {!user ? (
                                <div className="mt-4 flex flex-col space-y-2 px-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full">
                                        <Button variant="ghost" className="w-full justify-start">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full">
                                        <Button variant="primary" className="w-full justify-start">Register</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-gray-100 px-3 space-y-3">
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2 text-gray-700 hover:text-brand-gold">
                                        <FaUserCircle className="h-5 w-5 mr-3" />
                                        Profile ({user.name})
                                    </Link>
                                    <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
