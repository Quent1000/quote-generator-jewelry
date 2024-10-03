import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ options, value, onChange, className, darkMode, isScrollable, maxHeight = 300, withSearch = false, placeholder = "Sélectionnez une option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
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

  useEffect(() => {
    if (withSearch) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, withSearch]);

  const handleInputChange = (e) => {
    if (withSearch) {
      setSearchTerm(e.target.value);
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : '';
  };

  return (
    <div className="relative w-full" ref={selectRef}>
      <div 
        className={`${className} flex items-center cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {withSearch ? (
          <input
            type="text"
            value={isOpen ? searchTerm : getDisplayValue()}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
            className={`w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
          />
        ) : (
          <div className={`w-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {getDisplayValue() || placeholder}
          </div>
        )}
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div 
          className={`fixed z-50 mt-1 border rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          }`}
          style={{
            ...selectStyles,
            position: 'fixed',
            left: selectRef.current.getBoundingClientRect().left,
            top: selectRef.current.getBoundingClientRect().bottom,
            width: selectRef.current.offsetWidth,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer ${
                option.isSpecial
                  ? darkMode
                    ? 'bg-teal-700 text-white hover:bg-teal-600'
                    : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                  : darkMode 
                    ? 'hover:bg-gray-700 text-white' 
                    : 'hover:bg-gray-100 text-gray-800'
              } ${option.disabled ? 'cursor-default text-gray-500' : ''}`}
              onClick={() => {
                if (!option.disabled) {
                  handleOptionClick(option);
                }
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