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
      <div className="grid grid-cols-4 gap-4">
        {/* Première colonne : Poinçon de maître et Gravure */}
        <div className="space-y-4">
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
        </div>

        {/* Deuxième colonne : Poinçon de titre */}
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

        {/* Troisième colonne : Options de marque */}
        <div>
          <label className="font-semibold mb-2 block">Options de marque</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={devis.options.gravureLogoMarque}
                onChange={() => handleOptionsChange('gravureLogoMarque', !devis.options.gravureLogoMarque)}
                className={`${checkboxClass} form-checkbox`}
              />
              <span>Gravure logo marque ({prixMarque.gravureLogoMarque}€)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={devis.options.gravureNumeroSerie}
                onChange={() => handleOptionsChange('gravureNumeroSerie', !devis.options.gravureNumeroSerie)}
                className={`${checkboxClass} form-checkbox`}
              />
              <span>Gravure N° de série ({prixMarque.gravureNumeroSerie}€)</span>
            </label>
          </div>
        </div>

        {/* Quatrième colonne : Finition */}
        <div>
          <label className="font-semibold mb-2 block">Finition</label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.rhodiage}
              onChange={() => handleOptionsChange('rhodiage', !devis.options.rhodiage)}
              className={`${checkboxClass} form-checkbox`}
            />
            <span>Rhodiage ({parametres.prixRhodiage}€)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OptionsProduit;