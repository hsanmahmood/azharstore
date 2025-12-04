import React from 'react';

const NumberInput = ({ value, onChange, ...props }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    // Allow empty string to clear the input, otherwise convert to number
    onChange(value === '' ? '' : Number(value));
  };

  return (
    <input
      type="number"
      value={value === 0 ? '' : value}
      onChange={handleChange}
      {...props}
    />
  );
};

export default NumberInput;
