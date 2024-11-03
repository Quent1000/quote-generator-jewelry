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

  const renderTarifSelect = (field, options) => {
    const tarifOptions = options || {};
    
    return (
      <div className="flex space-x-2">
        <CustomSelect
          options={[
            { value: '', label: 'Sélectionnez un tarif' },
            ...Object.entries(tarifOptions).map(([key, value]) => ({ 
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
          className={`${inputClass} flex-grow`}
          darkMode={darkMode}
        />
        <input
          type="number"
          value={devis[`${field}Quantite`] || 1}
          onChange={(e) => handleInputChange(`${field}Quantite`, parseInt(e.target.value) || 1)}
          className={`${inputClass} w-20`}
          min="1"
          placeholder="Qté"
        />
      </div>
    );
  };

  const calculerTotal = () => {
    let total = 0;
    
    // Tarif fonte
    const tarifFonte = devis.tarifFonte === 'custom' ? parseFloat(devis.tarifFonteCustom || 0) : parseFloat(devis.tarifFonte || 0);
    total += tarifFonte * (devis.tarifFonteQuantite || 1);
    
    // Tarif impression cire
    const tarifImpressionCire = devis.tarifImpressionCire === 'custom' ? parseFloat(devis.tarifImpressionCireCustom || 0) : parseFloat(devis.tarifImpressionCire || 0);
    total += tarifImpressionCire * (devis.tarifImpressionCireQuantite || 1);
    
    // Tarif impression résine
    const tarifImpressionResine = devis.tarifImpressionResine === 'custom' ? parseFloat(devis.tarifImpressionResineCustom || 0) : parseFloat(devis.tarifImpressionResine || 0);
    total += tarifImpressionResine * (devis.tarifImpressionResineQuantite || 1);
    
    // Proto Laiton
    const tarifProtoLaiton = parseFloat(devis.tarifProtoLaiton || 0);
    total += tarifProtoLaiton * (devis.tarifProtoLaitonQuantite || 1);
    
    // Proto Argent
    const tarifProtoArgent = parseFloat(devis.tarifProtoArgent || 0);
    total += tarifProtoArgent * (devis.tarifProtoArgentQuantite || 1);
    
    return total;
  };

  // Ajout des valeurs par défaut si elles n'existent pas dans parametres
  const parametresComplets = {
    ...parametres,
    prixProtoLaiton: {
      "Moins de 6g": 50,
      "Moins de 12g": 75,
      "Plus de 12g": 100
    },
    prixProtoArgent: {
      "Moins de 6g": 60,
      "Moins de 12g": 85,
      "Plus de 12g": 110
    }
  };

  return (
    <div className="space-y-6">
      {/* Première section : Impression 3D et Fonte */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Impression 3D et Fonte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {renderOption("Tarif fonte", (
            <>
              {renderTarifSelect('tarifFonte', parametresComplets.prixFonte)}
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
              {renderTarifSelect('tarifImpressionCire', parametresComplets.prixImpressionCire)}
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
        </div>
      </div>

      {/* Nouvelle section : Prototypage */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Prototypage</h2>
        <div className="space-y-6">
          {renderOption("Tarif impression résine", (
            <>
              {renderTarifSelect('tarifImpressionResine', parametresComplets.prixImpressionResine)}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderOption("Proto Laiton", (
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={devis.tarifProtoLaiton || ''}
                  onChange={(e) => handleInputChange('tarifProtoLaiton', e.target.value)}
                  placeholder="Prix"
                  className={`${inputClass} flex-grow`}
                  step="0.01"
                />
                <input
                  type="number"
                  value={devis.tarifProtoLaitonQuantite || 1}
                  onChange={(e) => handleInputChange('tarifProtoLaitonQuantite', parseInt(e.target.value) || 1)}
                  className={`${inputClass} w-20`}
                  min="1"
                  placeholder="Qté"
                />
              </div>
            ))}
            
            {renderOption("Proto Argent", (
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={devis.tarifProtoArgent || ''}
                  onChange={(e) => handleInputChange('tarifProtoArgent', e.target.value)}
                  placeholder="Prix"
                  className={`${inputClass} flex-grow`}
                  step="0.01"
                />
                <input
                  type="number"
                  value={devis.tarifProtoArgentQuantite || 1}
                  onChange={(e) => handleInputChange('tarifProtoArgentQuantite', parseInt(e.target.value) || 1)}
                  className={`${inputClass} w-20`}
                  min="1"
                  placeholder="Qté"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total général */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-2">Total Impression 3D, Fonte et Prototypage</h3>
          <p className="text-3xl text-center font-bold text-teal-600 dark:text-teal-300">
            {calculerTotal().toFixed(2)} €
          </p>
        </div>
      </div>
    </div>
  );
};

export default TarifsImpression;
