import React from 'react';
import CustomSelect from './CustomSelect';

const TarifsImpression = ({ devis, handleInputChange, darkMode, parametres }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const renderTarifSelect = (field, options) => (
    <div className="flex items-center space-x-2">
      <select
        value={devis[field] || ''}
        onChange={(e) => {
          if (e.target.value === 'custom') {
            handleInputChange(field, 'custom');
          } else {
            handleInputChange(field, e.target.value);
          }
        }}
        className={`${inputClass} flex-grow`}
      >
        <option value="">Sélectionnez un tarif</option>
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={value}>{`${key} - ${value}€`}</option>
        ))}
        <option value="custom">Tarif personnalisé</option>
      </select>
      {devis[field] === 'custom' && (
        <input
          type="number"
          value={devis[`${field}Custom`] || ''}
          onChange={(e) => handleInputChange(`${field}Custom`, e.target.value)}
          placeholder="Tarif libre"
          className={`${inputClass} w-24`}
          step="0.01"
        />
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tarifs d'impression</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block mb-2">Tarif fonte</label>
          {renderTarifSelect('tarifFonte', parametres.prixFonte)}
        </div>
        <div>
          <label className="block mb-2">Tarif impression cire</label>
          {renderTarifSelect('tarifImpressionCire', parametres.prixImpressionCire)}
        </div>
        <div>
          <label className="block mb-2">Tarif impression résine</label>
          {renderTarifSelect('tarifImpressionResine', parametres.prixImpressionResine)}
        </div>
      </div>
      <div>
        <label className="block mb-2">Type de livraison</label>
        <CustomSelect
          options={Object.entries(parametres.prixLivraison || {}).map(([type, prix]) => ({
            value: type,
            label: `${type} - ${prix}€`
          }))}
          value={devis.typeLivraison || ''}
          onChange={(value) => {
            handleInputChange('typeLivraison', value);
            handleInputChange('prixLivraison', parametres.prixLivraison[value] || 0);
          }}
          className={inputClass}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default TarifsImpression;