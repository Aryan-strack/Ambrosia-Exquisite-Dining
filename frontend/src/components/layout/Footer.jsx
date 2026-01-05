import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Logo from '../common/Logo';

const Footer = () => {
    return (
        <footer className="bg-brand-black text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div>
                        <div className="mb-6">
                            <Logo variant="light" />
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Ambrosia brings you the finest culinary experience. We believe in quality, hygiene, and the art of cooking.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-brand-black transition-all duration-300">
                                <FaFacebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-brand-black transition-all duration-300">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-brand-black transition-all duration-300">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-brand-black transition-all duration-300">
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-display font-bold mb-6 text-brand-gold">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">Home</Link></li>
                            <li><Link to="/menu" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">Our Menu</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-lg font-display font-bold mb-6 text-brand-gold">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">Terms & Conditions</Link></li>
                            <li><Link to="/refund" className="text-gray-400 hover:text-brand-gold transition-colors block transform hover:translate-x-1 duration-300">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-display font-bold mb-6 text-brand-gold">Contact Us</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <span className="mr-3 text-brand-gold">📍</span>
                                123 Gourmet Avenue, <br /> Culinary District, NY 10012
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-brand-gold">📞</span>
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 text-brand-gold">✉️</span>
                                reservations@ambrosia.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Ambrosia. All rights reserved. Designed with <span className="text-brand-red">♥</span> for food lovers.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
