
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-[#0F9D58] text-white hover:bg-[#0B8E4D] shadow-sm hover:shadow-md",
        secondary: "bg-[#E8F5E9] text-[#0F9D58] hover:bg-[#C8E6C9]",
        outline: "border border-[#E5E7EB] text-[#374151] hover:bg-gray-50",
        ghost: "text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
