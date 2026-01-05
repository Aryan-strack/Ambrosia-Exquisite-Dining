import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-brand-gold text-brand-black hover:bg-brand-gold-hover shadow-md cursor-pointer hover:shadow-lg',
        secondary: 'bg-brand-black text-white hover:bg-gray-800 shadow-md cursor-pointer',
        outline: 'border-2 border-brand-gold text-brand-black hover:bg-brand-gold hover:text-white cursor-pointer',
        ghost: 'text-gray-600 hover:bg-gray-100/50 hover:text-brand-gold cursor-pointer',
        danger: 'bg-brand-red text-white hover:bg-red-700 shadow-md cursor-pointer',
    };

    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-sm',
        large: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
