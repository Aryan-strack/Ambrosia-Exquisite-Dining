import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Privacy Policy</h1>
                    <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            We collect information you provide directly to us when you create an account, place an order,
                            or contact customer support. This includes:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'Name and contact information',
                                'Payment information (encrypted)',
                                'Order history and preferences',
                                'Feedback and communications'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">We use the information we collect to:</p>
                        <ul className="space-y-4">
                            {[
                                'Process and fulfill your orders',
                                'Send order confirmations and updates',
                                'Respond to customer service requests',
                                'Improve our services and user experience',
                                'Send marketing communications (with your consent)'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-700">
                                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            We implement appropriate security measures to protect your personal information. All payment
                            data is encrypted and processed through Stripe's secure payment gateway. We never store
                            complete credit card information on our servers.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">You have the right to:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'Access your personal data',
                                'Correct inaccurate data',
                                'Request deletion of your data',
                                'Opt-out of marketing communications',
                                'Export your data'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <span className="text-gray-800 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Have Questions?</h2>
                                <p className="text-gray-300">
                                    If you have any questions, please contact us.
                                </p>
                            </div>
                            <a href="mailto:privacy@restomanager.com"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-orange-600 bg-white hover:bg-gray-100 transition-colors shadow-lg">
                                Contact Support
                            </a>
                        </div>
                    </section>
                </div>

                <div className="text-sm text-gray-400 text-center pt-12 pb-4">
                    Last updated: December 27, 2025
                </div>
            </div>
        </div>
    );
};

export default Privacy;
