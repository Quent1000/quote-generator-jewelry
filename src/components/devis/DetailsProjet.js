import React from 'react';
import CustomSelect from './CustomSelect';

const DetailsProjet = ({ devis, handleInputChange, darkMode, categories, sousCategories, metaux }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Détails du projet</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Catégorie</label>
          <CustomSelect
            options={categories.map(cat => ({ value: cat.nom, label: cat.nom }))}
            value={devis.categorie}
            onChange={(value) => handleInputChange('categorie', value)}
            className={inputClass}
            darkMode={darkMode}
          />
        </div>
        <div>
          <label className="block mb-2">Sous-catégorie</label>
          <CustomSelect
            options={sousCategories.map(subCat => ({ value: subCat, label: subCat }))}
            value={devis.sousCategorie}
            onChange={(value) => handleInputChange('sousCategorie', value)}
            className={inputClass}
            darkMode={darkMode}
          />
        </div>
        <div>
          <label className="block mb-2">Métal</label>
          <CustomSelect
            options={metaux.map(metal => ({ value: metal.nom, label: `${metal.nom} - ${metal.prix}€/g` }))}
            value={devis.metal}
            onChange={(value) => handleInputChange('metal', value)}
            className={inputClass}
            darkMode={darkMode}
          />
        </div>
        <div>
          <label className="block mb-2">Taille</label>
          <input
            type="text"
            value={devis.taille}
            onChange={(e) => handleInputChange('taille', e.target.value)}
            className={inputClass}
            placeholder="Entrez la taille"
          />
        </div>
        <div>
          <label className="block mb-2">Poids estimé (g)</label>
          <input
            type="number"
            value={devis.poidsEstime}
            onChange={(e) => handleInputChange('poidsEstime', parseFloat(e.target.value))}
            className={inputClass}
            step="0.01"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2">Description</label>
        <textarea
          value={devis.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`${inputClass} h-32`}
        />
      </div>
    </div>
  );
};

export default DetailsProjet;