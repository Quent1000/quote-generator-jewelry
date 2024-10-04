import React from 'react';
import CustomSelect from './CustomSelect';

const TarifsImpression = ({ devis, handleInputChange, darkMode, parametres }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const renderOption = (label, content) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      {content}
    </div>
  );

  const renderTarifSelect = (field, options) => (
    <CustomSelect
      options={[
        { value: '', label: 'Sélectionnez un tarif' },
        ...Object.entries(options).map(([key, value]) => ({ 
          value: value.toString(), 
          label: `${key} - ${value}€` 
        })),
        { value: 'custom', label: 'Tarif personnalisé' }
      ]}
      value={devis[field] || ''}
      onChange={(value) => {
        if (value === 'custom') {
          handleInputChange(field, 'custom');
        } else {
          handleInputChange(field, value);
        }
      }}
      className={inputClass}
      darkMode={darkMode}
    />
  );

  const calculerTotal = () => {
    let total = 0;
    
    // Tarif fonte
    total += devis.tarifFonte === 'custom' ? parseFloat(devis.tarifFonteCustom || 0) : parseFloat(devis.tarifFonte || 0);
    
    // Tarif impression cire
    total += devis.tarifImpressionCire === 'custom' ? parseFloat(devis.tarifImpressionCireCustom || 0) : parseFloat(devis.tarifImpressionCire || 0);
    
    // Tarif impression résine
    total += devis.tarifImpressionResine === 'custom' ? parseFloat(devis.tarifImpressionResineCustom || 0) : parseFloat(devis.tarifImpressionResine || 0);
    
    return total;
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Impression 3D et Fonte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {renderOption("Tarif fonte", (
          <>
            {renderTarifSelect('tarifFonte', parametres.prixFonte)}
            {devis.tarifFonte === 'custom' && (
              <input
                type="number"
                value={devis.tarifFonteCustom || ''}
                onChange={(e) => handleInputChange('tarifFonteCustom', e.target.value)}
                placeholder="Tarif personnalisé"
                className={`${inputClass} mt-2`}
                step="0.01"
              />
            )}
          </>
        ))}
        {renderOption("Tarif impression cire", (
          <>
            {renderTarifSelect('tarifImpressionCire', parametres.prixImpressionCire)}
            {devis.tarifImpressionCire === 'custom' && (
              <input
                type="number"
                value={devis.tarifImpressionCireCustom || ''}
                onChange={(e) => handleInputChange('tarifImpressionCireCustom', e.target.value)}
                placeholder="Tarif personnalisé"
                className={`${inputClass} mt-2`}
                step="0.01"
              />
            )}
          </>
        ))}
        {renderOption("Tarif impression résine / Prototypage", (
          <>
            {renderTarifSelect('tarifImpressionResine', parametres.prixImpressionResine)}
            {devis.tarifImpressionResine === 'custom' && (
              <input
                type="number"
                value={devis.tarifImpressionResineCustom || ''}
                onChange={(e) => handleInputChange('tarifImpressionResineCustom', e.target.value)}
                placeholder="Tarif personnalisé"
                className={`${inputClass} mt-2`}
                step="0.01"
              />
            )}
          </>
        ))}
      </div>
      <div className="mt-8 bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-2">Total Impression 3D et Fonte</h3>
        <p className="text-3xl text-center font-bold text-teal-600 dark:text-teal-300">
          {calculerTotal().toFixed(2)} €
        </p>
      </div>
    </div>
  );
};

export default TarifsImpression;