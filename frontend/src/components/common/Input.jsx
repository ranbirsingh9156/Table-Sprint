import React from 'react';
import PropTypes from 'prop-types';


const Input = ({ type, placeholder, value, onChange, className, ...rest }) => {
  return (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
    />
  );
};


Input.propTypes = {
  type: PropTypes.string.isRequired,  // Type is required
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired, // Value is required
  onChange: PropTypes.func.isRequired, // onChange is required
    className: PropTypes.string,

};


Input.defaultProps = {  //default values
    type: 'text',
};



export default Input;