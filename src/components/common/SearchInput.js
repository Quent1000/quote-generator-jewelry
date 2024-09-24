import React from 'react';

const SearchInput = ({ value, onChange, darkMode }) => {
  const inputClass = `w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring focus:ring-teal-200`;

  return (
    <input
      type="text"
      placeholder="Rechercher un client..."
      className={`${inputClass} mb-4`}
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;