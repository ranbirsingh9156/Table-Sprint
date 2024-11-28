import React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes for prop validation

const Button = ({ children, onClick, className, ...rest }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`} //base styles with ability to add custom styles
            {...rest} //spread rest of the props if any
        >
            {children}
        </button>
    );
};


Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
};



export default Button;