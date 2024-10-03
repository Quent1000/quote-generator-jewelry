import React, { useEffect } from 'react';
import CustomSelect from './CustomSelect';

const OptionsProduit = ({ devis, handleInputChange, handleOptionsChange, darkMode, parametres, defaultRhodiage }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const checkboxClass = `form-checkbox h-5 w-5 text-teal-600 transition duration-150 ease-in-out ${
    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
  }`;

  const prixPoincons = parametres?.prixPoincons || { poinconMaitre: {}, poinconTitre: {} };
  const prixMarque = parametres?.prixPoincons?.marque || {};
  const stylesGravure = parametres?.prixGravure || {};

  const renderOption = (label, content) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      {content}
    </div>
  );

  const calculerTotal = () => {
    let total = 0;
    
    // Poinçon de maître
    total += prixPoincons.poinconMaitre[devis.options.poinconMaitre] || 0;
    
    // Poinçon de titre
    total += prixPoincons.poinconTitre[devis.options.poinconTitre] || 0;
    
    // Gravure
    if (devis.gravure && devis.styleGravure) {
      total += stylesGravure[devis.styleGravure] || 0;
    }
    
    // Options supplémentaires
    if (devis.options.gravureLogoMarque) {
      total += prixMarque.gravureLogoMarque || 0;
    }
    if (devis.options.gravureNumeroSerie) {
      total += prixMarque.gravureNumeroSerie || 0;
    }
    if (devis.options.rhodiage) {
      total += parametres.prixRhodiage || 0;
    }
    
    return total;
  };

  useEffect(() => {
    if (defaultRhodiage && !devis.options.rhodiage) {
      handleOptionsChange('rhodiage', true);
    }
  }, [defaultRhodiage, devis.options.rhodiage, handleOptionsChange]);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Gravure et Finition</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          {renderOption("Poinçon de maître", (
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionnez une option' },
                ...Object.entries(prixPoincons.poinconMaitre).map(([type, prix]) => ({
                  value: type,
                  label: `${type === 'gravureLaser' ? 'Gravure laser' : type === 'frappe' ? 'Frappé' : type} - ${prix}€`
                }))
              ]}
              value={devis.options.poinconMaitre}
              onChange={(value) => handleOptionsChange('poinconMaitre', value)}
              className={inputClass}
              darkMode={darkMode}
            />
          ))}

          {renderOption("Poinçon de titre", (
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionnez une option' },
                ...Object.entries(prixPoincons.poinconTitre).map(([type, prix]) => ({
                  value: type,
                  label: `${type === 'gravureLaser' ? 'Gravure laser' : type === 'frappe' ? 'Frappé' : type} - ${prix}€`
                }))
              ]}
              value={devis.options.poinconTitre}
              onChange={(value) => handleOptionsChange('poinconTitre', value)}
              className={inputClass}
              darkMode={darkMode}
            />
          ))}
        </div>

        <div className="space-y-6">
          {renderOption("Gravure", (
            <div className="space-y-2">
              <input
                type="text"
                value={devis.gravure}
                onChange={(e) => handleInputChange('gravure', e.target.value)}
                className={inputClass}
                placeholder="Texte à graver (optionnel)"
              />
              {devis.gravure && (
                <CustomSelect
                  options={[
                    { value: '', label: 'Sélectionner un style' },
                    ...Object.entries(stylesGravure).map(([style, prix]) => ({
                      value: style,
                      label: `${style} (${prix}€)`
                    }))
                  ]}
                  value={devis.styleGravure}
                  onChange={(value) => handleInputChange('styleGravure', value)}
                  className={inputClass}
                  darkMode={darkMode}
                />
              )}
            </div>
          ))}

          {renderOption("Options supplémentaires", (
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={devis.options.gravureLogoMarque}
                  onChange={() => handleOptionsChange('gravureLogoMarque', !devis.options.gravureLogoMarque)}
                  className={checkboxClass}
                />
                <span className="text-sm">Gravure logo marque ({prixMarque.gravureLogoMarque}€)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={devis.options.gravureNumeroSerie}
                  onChange={() => handleOptionsChange('gravureNumeroSerie', !devis.options.gravureNumeroSerie)}
                  className={checkboxClass}
                />
                <span className="text-sm">Gravure N° de série ({prixMarque.gravureNumeroSerie}€)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={devis.options.rhodiage}
                  onChange={() => handleOptionsChange('rhodiage', !devis.options.rhodiage)}
                  className={checkboxClass}
                />
                <span className="text-sm">Rhodiage ({parametres.prixRhodiage}€)</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-2">Total Gravure et Finition</h3>
        <p className="text-3xl text-center font-bold text-teal-600 dark:text-teal-300">
          {calculerTotal().toFixed(2)} €
        </p>
      </div>
    </div>
  );
};

export default OptionsProduit;