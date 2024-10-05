import React from 'react';

const CustomSelect = ({ options, value, onChange, className, darkMode, isScrollable, maxHeight }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      style={isScrollable ? { maxHeight, overflowY: 'auto' } : {}}
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