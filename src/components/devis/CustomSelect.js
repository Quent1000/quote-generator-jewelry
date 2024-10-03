import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ options, value, onChange, className, darkMode, isScrollable, maxHeight = 300 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectStyles = isScrollable ? { maxHeight: `${maxHeight}px`, overflowY: 'auto' } : {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={selectRef}>
      <div
        className={`${className} cursor-pointer flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find(opt => opt.value === value)?.label || "Sélectionnez une option"}</span>
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div 
          className={`absolute z-50 w-full mt-1 border rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          }`}
          style={{
            ...selectStyles,
            position: 'fixed',
            left: selectRef.current.getBoundingClientRect().left,
            top: selectRef.current.getBoundingClientRect().bottom,
            width: selectRef.current.offsetWidth,
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;