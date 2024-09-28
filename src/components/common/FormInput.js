import React from 'react';

const FormInput = ({ label, name, value, onChange, error, darkMode, ...props }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring focus:ring-teal-200 ${error ? 'border-red-500' : ''}`;

  return (
    <div className="mb-4">
      <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
        {...props}
      />
      {error && <p className="mt-1 text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default FormInput;