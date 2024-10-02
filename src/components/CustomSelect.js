import React from 'react';

const CustomSelect = ({ options, value, onChange, className, darkMode }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className} ${
        darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;