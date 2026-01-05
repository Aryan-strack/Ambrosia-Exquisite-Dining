import React from 'react';

const Refund = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Refund Policy</h1>
                    <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                    {/* Order Cancellation */}
                    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Cancellation</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            You may cancel your order and receive a full refund under the following conditions:
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-green-50 p-6 rounded-xl border border-green-100 transition-transform hover:-translate-y-1">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                                <div>
                                    <strong className="block text-gray-900 text-lg mb-1">Within 5 minutes of placement</strong>
                                    <span className="text-gray-600">Full refund automatically processed to your original payment method within 5-7 business days.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-green-50 p-6 rounded-xl border border-green-100 transition-transform hover:-translate-y-1">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</span>
                                <div>
                                    <strong className="block text-gray-900 text-lg mb-1">Before preparation begins</strong>
                                    <span className="text-gray-600">Contact us immediately. If preparation hasn't started, we can issue a full refund.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-red-50 p-6 rounded-xl border border-red-100 transition-transform hover:-translate-y-1">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">✕</span>
                                <div>
                                    <strong className="block text-gray-900 text-lg mb-1">After preparation starts</strong>
                                    <span className="text-gray-600">Cancellations may not be possible. Contact customer service for assistance.</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Quality Issues */}
                        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Quality Issues</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { title: 'Wrong order', desc: 'Full refund or replacement.' },
                                    { title: 'Missing items', desc: 'Refund for missing items.' },
                                    { title: 'Food quality', desc: 'Contact within 30 mins.' }
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <div>
                                            <span className="font-bold text-gray-900">{item.title}:</span>
                                            <span className="text-gray-600 ml-2">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Delivery Issues */}
                        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Delivery Issues</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { title: 'Significant delay', desc: '>30 mins late eligible for partial refund.' },
                                    { title: 'Not delivered', desc: 'Full refund if verified.' }
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <div>
                                            <span className="font-bold text-gray-900">{item.title}:</span>
                                            <span className="text-gray-600 ml-2">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Processing Time */}
                    <section className="bg-gray-900 p-8 rounded-2xl shadow-xl text-white">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Refund Processing Time
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { method: 'Credit/Debit Card', time: '5-7 business days' },
                                { method: 'Online Payment', time: '3-5 business days' },
                                { method: 'Store Credit', time: 'Immediate' }
                            ].map((item, index) => (
                                <div key={index} className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="text-gray-400 text-sm mb-1">{item.method}</div>
                                    <div className="text-xl font-bold text-orange-400">{item.time}</div>
                                </div>
                            ))}
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

export default Refund;
