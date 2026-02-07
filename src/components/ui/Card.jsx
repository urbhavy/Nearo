
import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', hover = false, ...props }) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-100 p-4 ${hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hover: PropTypes.bool,
};

export default Card;
