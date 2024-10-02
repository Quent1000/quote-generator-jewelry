import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ options, value, onChange, className, darkMode, scrollable, width, fixedWidth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const optionsContainerClass = `fixed z-50 mt-1 border rounded-md shadow-lg ${
    scrollable ? 'max-h-60 overflow-y-auto' : ''
  } ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`;

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const containerStyle = {
    width: fixedWidth || width || '100%'
  };

  return (
    <div className="relative" ref={selectRef} style={containerStyle}>
      <div
        className={`${className} cursor-pointer flex justify-between items-center ${
          darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={handleToggle}
      >
        <span className="truncate">{value || "Sélectionnez une option"}</span>
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div 
          className={optionsContainerClass}
          style={{
            top: selectRef.current ? `${selectRef.current.getBoundingClientRect().bottom + window.scrollY}px` : '0px',
            left: selectRef.current ? `${selectRef.current.getBoundingClientRect().left + window.scrollX}px` : '0px',
            width: selectRef.current ? `${selectRef.current.offsetWidth}px` : 'auto'
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer truncate ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;