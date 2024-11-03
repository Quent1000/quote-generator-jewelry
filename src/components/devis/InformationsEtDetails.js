import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import CustomClientSelect from './CustomClientSelect';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const InformationsEtDetails = ({ devis, handleInputChange, handleClientChange, setShowNouveauClientPopup, darkMode, clients, metaux, valeurMetal, onMetalChange, isOrGrisSelected }) => {
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = {
    "Bague": ["Alliance", "Bague de fiançailles", "Chevalière", "Solitaire", "Autre"],
    "Bracelet": ["Jonc", "Chaîne", "Manchette", "Tennis", "Autre"],
    "Boucles d'oreilles": ["Créoles", "Puces", "Pendantes", "Chandelier", "Autre"],
    "Pendentif": ["Simple", "Avec chaîne", "Médaillon", "Autre"],
    "Collier": ["Chaîne", "Ras de cou", "Sautoir", "Autre"],
    "Autre": ["Préciser"]
  };

  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  // La variable clientOptions a été supprimée car elle n'était pas utilisée

  const categorieOptions = Object.keys(categories).map(cat => ({ value: cat, label: cat }));
  const sousCategorieOptions = devis.categorie && categories[devis.categorie]
    ? categories[devis.categorie].map(subCat => ({ value: subCat, label: subCat }))
    : [];

  const ordrePersonnalise = ['Or Jaune 3N', 'Or Gris', 'Or Rouge 5N', 'Or Gris Palladié'];

  const metalOptions = ordrePersonnalise
    .map(nomMetal => {
      const metal = metaux.find(m => m.nom === nomMetal);
      return metal ? {
        value: metal.nom,
        label: `${metal.nom} - ${(metal.prix / 1000).toFixed(2)}€/g`
      } : null;
    })
    .filter(Boolean)
    .concat(
      metaux
        .filter(metal => !ordrePersonnalise.includes(metal.nom))
        .map(metal => ({
          value: metal.nom,
          label: `${metal.nom} - ${(metal.prix / 1000).toFixed(2)}€/g`
        }))
    );

  const handleMetalChange = (value) => {
    handleInputChange('metal', value);
    onMetalChange(value);
  };

  const renderOption = (label, content) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {content}
    </div>
  );

  const handlePoidsChange = (e) => {
    let value = e.target.value;
    
    // Autoriser la saisie de points, de virgules et de chiffres
    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      // Remplacer la virgule par un point pour le stockage
      value = value.replace(',', '.');
      
      // Mettre à jour l'état avec la valeur sous forme de chaîne
      handleInputChange('poidsEstime', value);
    }
  };

  const handleAddTag = () => {
    setShowTagDialog(true);
  };

  const handleTagSubmit = () => {
    if (newTag.trim()) {
      handleInputChange('tags', [...devis.tags, newTag.trim()]);
      setNewTag('');
      setShowTagDialog(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleInputChange('tags', devis.tags.filter(tag => tag !== tagToRemove));
  };

  const conditionsPaiementOptions = [
    { value: '30-70', label: '30% à la commande, 70% à la livraison' },
    { value: '50-50', label: '50% à la commande, 50% à la livraison' },
    { value: '100', label: '100% à la livraison' },
  ];

  const operationsOptions = [
    { value: 'developpement_cao', label: 'Développement CAO' },
    { value: 'cao_impression_cire', label: 'CAO + impression cire' },
    { value: 'fabrication_complete', label: 'Fabrication complète' },
    { value: 'sav_modification', label: 'SAV / modification' },
    { value: 'cao_impression_plastique', label: 'CAO + impression plastique' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Informations et détails</h2>
      
      {devis.numeroDevis && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Numéro de devis</label>
          <input
            type="text"
            value={devis.numeroDevis}
            readOnly
            className={`${inputClass} bg-gray-100`}
          />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-4">
        {renderOption("Titre du devis", (
          <input
            type="text"
            value={devis.titreDevis}
            onChange={(e) => handleInputChange('titreDevis', e.target.value)}
            className={`${inputClass} text-sm`}
            placeholder="Titre du devis"
          />
        ))}
        {renderOption("Client", (
          <CustomClientSelect
            clients={clients}
            value={devis.client}
            onChange={handleClientChange}
            className={inputClass}
            darkMode={darkMode}
            setShowNouveauClientPopup={setShowNouveauClientPopup}
          />
        ))}
        {renderOption("Catégorie", (
          <CustomSelect
            options={categorieOptions}
            value={devis.categorie}
            onChange={(value) => handleInputChange('categorie', value)}
            className={inputClass}
            darkMode={darkMode}
            placeholder="Sélectionnez une catégorie"
          />
        ))}
        {renderOption("Sous-catégorie", (
          <CustomSelect
            options={sousCategorieOptions}
            value={devis.sousCategorie || ''}
            onChange={(value) => handleInputChange('sousCategorie', value)}
            className={inputClass}
            darkMode={darkMode}
            disabled={!devis.categorie}
            placeholder="Sélectionner"
          />
        ))}
        {renderOption("Métal", (
          <>
            <CustomSelect
              options={metalOptions}
              value={devis.metal}
              onChange={handleMetalChange}
              className={inputClass}
              darkMode={darkMode}
              placeholder="Sélectionnez un métal"
            />
            {isOrGrisSelected && (
              <p className="mt-2 text-sm text-teal-600 dark:text-teal-400">
                L'option de rhodiage est recommandée pour l'or gris.
              </p>
            )}
          </>
        ))}
        {renderOption("Taille", (
          <input
            type="text"
            value={devis.taille}
            onChange={(e) => handleInputChange('taille', e.target.value)}
            className={inputClass}
            placeholder="ex : 54, 18cm"
          />
        ))}
        {renderOption("Poids estimé (g)", (
          <input
            type="text"
            value={devis.poidsEstime}
            onChange={handlePoidsChange}
            className={inputClass}
            placeholder="ex : 3.5"
          />
        ))}
        {renderOption("Valeur métal (€)", (
          <input
            type="text"
            value={valeurMetal}
            readOnly
            className={`${inputClass} bg-gray-100`}
          />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {renderOption("Référence client", (
          <input
            type="text"
            value={devis.referenceClient || ''}
            onChange={(e) => handleInputChange('referenceClient', e.target.value)}
            className={inputClass}
            placeholder="Référence client"
          />
        ))}
        {renderOption("Conditions de paiement", (
          <CustomSelect
            options={conditionsPaiementOptions}
            value={devis.paymentTerms}
            onChange={(value) => handleInputChange('paymentTerms', value)}
            className={inputClass}
            darkMode={darkMode}
            placeholder="Sélectionnez les conditions de paiement"
          />
        ))}
        {renderOption("Opérations", (
          <CustomSelect
            options={operationsOptions}
            value={devis.operation}
            onChange={(value) => handleInputChange('operation', value)}
            className={inputClass}
            darkMode={darkMode}
            placeholder="Sélectionnez le type d'opération"
          />
        ))}
        {renderOption("Délai de fabrication (jours ouvrés)", (
          <input
            type="number"
            value={devis.delaiFabrication || ''}
            onChange={(e) => handleInputChange('delaiFabrication', parseInt(e.target.value) || '')}
            className={inputClass}
            min="1"
            placeholder="Nombre de jours"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {renderOption("Description", (
          <textarea
            value={devis.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`${inputClass} h-24`}
            placeholder="Description du projet"
          />
        ))}
        {renderOption("Commentaire interne", (
          <textarea
            value={devis.commentaireInterne}
            onChange={(e) => handleInputChange('commentaireInterne', e.target.value)}
            className={`${inputClass} h-24`}
            placeholder="Notes internes (non visibles par le client)"
          />
        ))}
      </div>

      <div className="mt-4">
        {renderOption("Tags", (
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {devis.tags.map(tag => (
                <span key={tag} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <XMarkIcon className="w-4 h-4 ml-1 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </span>
              ))}
            </div>
            <button
              onClick={handleAddTag}
              className="flex items-center text-teal-600 hover:text-teal-700"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Ajouter un tag
            </button>
          </div>
        ))}
      </div>

      {showTagDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau tag</h3>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className={`w-full p-2 border rounded ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`}
              placeholder="Entrez un nouveau tag"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTagDialog(false)}
                className="mr-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleTagSubmit}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationsEtDetails;
