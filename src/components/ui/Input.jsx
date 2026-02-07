
import React from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Input = ({ icon: Icon, className = '', onClear, actionButton, ...props }) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            {Icon && (
                <div className="absolute left-3 text-gray-400 pointer-events-none">
                    <Icon size={18} />
                </div>
            )}
            <input
                className={`w-full py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all ${Icon ? 'pl-10' : 'pl-3'} ${onClear ? 'pr-20' : props.value ? 'pr-10' : 'pr-3'}`}
                {...props}
            />
            <div className="absolute right-2 flex items-center gap-1">
                {props.value && onClear && (
                    <button
                        onClick={onClear}
                        className="p-1 px-2 text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                        aria-label="Clear input"
                    >
                        <X size={16} />
                    </button>
                )}
                {actionButton}
            </div>
        </div>
    );
};

Input.propTypes = {
    icon: PropTypes.elementType,
    className: PropTypes.string,
};

export default Input;
