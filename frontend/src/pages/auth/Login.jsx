import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            if (res && res.error) {
                setError(res.error);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-gray">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-brand-black">
                <div className="absolute inset-0 bg-brand-black/40 z-10" />
                <img
                    src="https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=1920"
                    alt="Fine Dining"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 flex flex-col justify-center items-center h-full text-white px-12 text-center">
                    <h2 className="text-4xl font-display font-bold mb-6">Welcome Back</h2>
                    <p className="text-lg text-gray-200">
                        Sign in to access your reservations, orders, and exclusive offers.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8"
                >
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Logo />
                        </div>
                        <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/register" className="font-medium text-brand-gold hover:text-brand-gold-hover transition-colors">
                                create a new account
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-brand-red p-4">
                                <p className="text-brand-red text-sm">{error}</p>
                            </div>
                        )}
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm transition-all"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-brand-gold hover:text-brand-gold-hover">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button variant="primary" className="w-full py-3 text-lg">Sign in</Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
