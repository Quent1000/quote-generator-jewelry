import React from 'react';
import CustomSelect from './CustomSelect';

const TempsProduction = ({ devis, handleInputChange, darkMode }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const tempsOptions = {
    heures: Array.from({ length: 25 }, (_, i) => i), // 0h à 24h
    minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  };

  const renderTempsSelect = (type) => (
    <div key={type}>
      <label className="block mb-2">Temps {type}</label>
      <div className="flex space-x-2">
        <CustomSelect
          options={tempsOptions.heures.map(h => ({ value: h, label: `${h}h` }))}
          value={devis.tempsProduction[type]?.heures || 0}
          onChange={(value) => handleInputChange(`tempsProduction.${type}.heures`, parseInt(value))}
          className={inputClass}
          darkMode={darkMode}
        />
        <CustomSelect
          options={tempsOptions.minutes.map(m => ({ value: m, label: `${m}min` }))}
          value={devis.tempsProduction[type]?.minutes || 0}
          onChange={(value) => handleInputChange(`tempsProduction.${type}.minutes`, parseInt(value))}
          className={inputClass}
          darkMode={darkMode}
        />
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Temps de production</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {['administratif', 'CAO', 'repare', 'polissage', 'dessertissage', 'design'].map(renderTempsSelect)}
      </div>
    </div>
  );
};

export default TempsProduction;