import React from 'react';
import CustomSelect from './CustomSelect';

const TarifsImpression = ({ devis, handleInputChange, darkMode }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tarifs d'impression</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Tarif fonte</label>
          <input
            type="number"
            value={devis.tarifFonte}
            onChange={(e) => handleInputChange('tarifFonte', parseFloat(e.target.value))}
            className={inputClass}
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-2">Tarif impression cire</label>
          <input
            type="number"
            value={devis.tarifImpressionCire}
            onChange={(e) => handleInputChange('tarifImpressionCire', parseFloat(e.target.value))}
            className={inputClass}
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-2">Tarif impression résine</label>
          <input
            type="number"
            value={devis.tarifImpressionResine}
            onChange={(e) => handleInputChange('tarifImpressionResine', parseFloat(e.target.value))}
            className={inputClass}
            step="0.01"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2">Type de livraison</label>
        <CustomSelect
          options={[
            { value: 'standard', label: 'Standard' },
            { value: 'express', label: 'Express' },
            { value: 'retrait', label: 'Retrait en boutique' }
          ]}
          value={devis.typeLivraison}
          onChange={(value) => handleInputChange('typeLivraison', value)}
          className={inputClass}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default TarifsImpression;