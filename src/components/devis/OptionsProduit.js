import React from 'react';
import CustomSelect from './CustomSelect';

const OptionsProduit = ({ devis, handleInputChange, handleOptionsChange, darkMode, parametres }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const checkboxClass = `mr-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`;

  const prixPoincons = parametres?.prixPoincons || { poinconMaitre: {}, poinconTitre: {} };
  const prixMarque = parametres?.prixPoincons?.marque || {};
  const stylesGravure = parametres?.prixGravure || {};

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gravure et Finition</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Gravure</label>
          <input
            type="text"
            value={devis.gravure}
            onChange={(e) => handleInputChange('gravure', e.target.value)}
            className={inputClass}
            placeholder="Texte à graver (optionnel)"
          />
        </div>
        {devis.gravure && (
          <div>
            <label className="block mb-2">Style de gravure</label>
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
          </div>
        )}
        <div>
          <label className="block mb-2">Poinçon de maître</label>
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
        </div>
        <div>
          <label className="block mb-2">Poinçon de titre</label>
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
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Options de marque</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={devis.options.gravureLogoMarque}
                onChange={(e) => handleOptionsChange('gravureLogoMarque', e.target.checked)}
                className={checkboxClass}
              />
              <span>Gravure logo marque ({prixMarque.gravureLogoMarque}€)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={devis.options.gravureNumeroSerie}
                onChange={(e) => handleOptionsChange('gravureNumeroSerie', e.target.checked)}
                className={checkboxClass}
              />
              <span>Gravure N° de série ({prixMarque.gravureNumeroSerie}€)</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Finition</label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={devis.options.rhodiage}
              onChange={(e) => handleOptionsChange('rhodiage', e.target.checked)}
              className={checkboxClass}
            />
            <span>Rhodiage ({parametres.prixRhodiage}€)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OptionsProduit;