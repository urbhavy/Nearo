
import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ icon: Icon, className = '', ...props }) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            {Icon && (
                <div className="absolute left-3 text-gray-400">
                    <Icon size={18} />
                </div>
            )}
            <input
                className={`w-full py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all ${Icon ? 'pl-10' : 'pl-3'}`}
                {...props}
            />
        </div>
    );
};

Input.propTypes = {
    icon: PropTypes.elementType,
    className: PropTypes.string,
};

export default Input;
