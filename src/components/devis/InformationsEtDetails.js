import React from 'react';
import CustomSelect from './CustomSelect';

const InformationsEtDetails = ({ devis, handleInputChange, handleClientChange, setShowNouveauClientPopup, darkMode, clients, categories, sousCategories, metaux, valeurMetal }) => {
  console.log("Métaux reçus dans InformationsEtDetails:", metaux);

  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const clientOptions = [
    { value: '', label: 'Sélectionnez un client' },
    ...clients.map(client => ({
      value: client.id,
      label: `${client.informationsPersonnelles.nom} ${client.informationsPersonnelles.prenom}`
    })),
    { value: 'nouveau', label: '+ Créer un nouveau client' }
  ];

  const categorieOptions = categories.map(cat => ({ value: cat, label: cat }));
  const sousCategorieOptions = sousCategories.map(subCat => ({ value: subCat, label: subCat }));
  const metalOptions = metaux.map(metal => ({
    value: metal.nom,
    label: `${metal.nom} - ${(metal.prix / 1000).toFixed(2)}€/g`
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations générales et détails du projet</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Client</label>
          <CustomSelect
            options={clientOptions}
            value={devis.client}
            onChange={handleClientChange}
            className={inputClass}
            darkMode={darkMode}
          />
        </div>
        <div>
          <label className="block mb-2">Titre du devis</label>
          <input
            type="text"
            value={devis.titreDevis}
            onChange={(e) => handleInputChange('titreDevis', e.target.value)}
            className={inputClass}
            placeholder="Entrez le titre du devis"
          />
        </div>
        <div>
          <label className="block mb-2">Catégorie</label>
          <CustomSelect
            options={categorieOptions}
            value={devis.categorie}
            onChange={(value) => handleInputChange('categorie', value)}
            className={inputClass}
            darkMode={darkMode}
          />
        </div>
        <div>
          <label className="block mb-2">Sous-catégorie</label>
          <CustomSelect
            options={sousCategorieOptions}
            value={devis.sousCategorie}
            onChange={(value) => handleInputChange('sousCategorie', value)}
            className={inputClass}
            darkMode={darkMode}
            disabled={!devis.categorie}
          />
        </div>
        <div>
          <label className="block mb-2">Métal</label>
          <CustomSelect
            options={metalOptions}
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
            placeholder="ex : 54, 18cm"
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
            placeholder="ex : 3.5"
          />
        </div>
        <div>
          <label className="block mb-2">Valeur métal estimée (€)</label>
          <input
            type="text"
            value={valeurMetal}
            readOnly
            className={`${inputClass} bg-gray-100`}
          />
        </div>
      </div>
      <div>
        <label className="block mb-2">Description</label>
        <textarea
          value={devis.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`${inputClass} h-32`}
          placeholder="Décrivez le projet en détail"
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2">Commentaire interne</label>
        <textarea
          value={devis.commentaireInterne}
          onChange={(e) => handleInputChange('commentaireInterne', e.target.value)}
          className={`${inputClass} h-32`}
          placeholder="Ajoutez ici des notes internes sur le devis (non visibles par le client)"
        />
      </div>
    </div>
  );
};

export default InformationsEtDetails;