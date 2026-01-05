import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Terms & Conditions</h1>
                    <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            By accessing and using RestoManager's services, you agree to be bound by these Terms and Conditions.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            When creating an account, you agree to:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'Provide accurate and complete information',
                                'Maintain the security of your account credentials',
                                'Accept responsibility for all activities',
                                'Notify us immediately of any unauthorized access'
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Orders and Payments</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            All orders are subject to availability and confirmation. We reserve the right to:
                        </p>
                        <ul className="space-y-4 mb-6">
                            {[
                                'Refuse or cancel any order at our discretion',
                                'Modify menu items and prices without prior notice',
                                'Limit order quantities'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-700">
                                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                            <p className="text-orange-900 font-medium">
                                Payment must be made at the time of order. All prices are in USD and include applicable taxes.
                            </p>
                        </div>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Delivery & Pickup</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Delivery times are estimates and may vary. We are not liable for delays caused by circumstances
                                beyond our control. For pickup orders, please arrive within the specified time window.
                            </p>
                        </section>

                        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Cancellation</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Orders can be cancelled within 5 minutes of placement for a full refund. After preparation begins,
                                cancellations may not be possible. Please refer to our Refund Policy for detailed information.
                            </p>
                        </section>
                    </div>

                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">You may not use our services to:</p>
                        <div className="space-y-3">
                            {[
                                'Violate any applicable laws or regulations',
                                'Infringe on intellectual property rights',
                                'Transmit harmful or malicious code',
                                'Engage in fraudulent activities',
                                'Harass or harm other users or staff'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">✕</span>
                                    <span className="text-gray-800 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl shadow-xl text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Legal Inquiries</h2>
                                <p className="text-gray-300">
                                    For questions about these Terms, contact our legal team.
                                </p>
                            </div>
                            <a href="mailto:legal@restomanager.com"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-orange-600 bg-white hover:bg-gray-100 transition-colors shadow-lg">
                                Contact Legal
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

export default Terms;
