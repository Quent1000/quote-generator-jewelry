import React, { useState, useEffect } from 'react';

const PriceInput = ({ value, onChange, name, darkMode }) => {
  const [customPrice, setCustomPrice] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  useEffect(() => {
    if (value) {
      const numValue = parseFloat(value);
      if ([10, 20, 30].includes(numValue)) {
        setSelectedPrice(value.toString());
        setCustomPrice('');
      } else {
        setSelectedPrice('custom');
        setCustomPrice(value);
      }
    }
  }, [value]);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setSelectedPrice(newValue);
    if (newValue !== 'custom') {
      onChange({ target: { name, value: newValue } });
      setCustomPrice('');
    }
  };

  const handleCustomPriceChange = (e) => {
    const newValue = e.target.value;
    setCustomPrice(newValue);
    if (newValue) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const inputClass = `w-full p-1 text-xs border rounded ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring focus:ring-teal-200`;

  return (
    <div className="flex space-x-2">
      <select
        value={selectedPrice}
        onChange={handleSelectChange}
        className={inputClass}
      >
        <option value="">Sélectionner</option>
        <option value="10">10€</option>
        <option value="20">20€</option>
        <option value="30">30€</option>
        <option value="custom">Personnalisé</option>
        </select>
      {selectedPrice === 'custom' && (
        <input
          type="number"
          value={customPrice}
          onChange={handleCustomPriceChange}
          placeholder="Prix personnalisé"
          className={inputClass}
        />
      )}
    </div>
  );
};

export default PriceInput;