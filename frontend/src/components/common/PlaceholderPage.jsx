import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <p className="text-gray-600">This page is currently under construction. Please check back later.</p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
