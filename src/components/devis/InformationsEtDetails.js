import React from 'react';
import CustomSelect from './CustomSelect';

const InformationsEtDetails = ({ devis, handleInputChange, handleClientChange, setShowNouveauClientPopup, darkMode, clients, metaux, valeurMetal, onMetalChange, isOrGrisSelected }) => {
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

  const clientOptions = [
    { value: '', label: 'Sélectionnez un client' },
    ...clients.map(client => ({
      value: client.id,
      label: `${client.informationsPersonnelles.nom} ${client.informationsPersonnelles.prenom}`.trim()
    })),
    { value: 'nouveau', label: '+ Créer un nouveau client' }
  ];

  const getSelectedClientLabel = () => {
    const selectedClient = clientOptions.find(option => option.value === devis.client);
    return selectedClient ? selectedClient.label : '';
  };

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

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Informations et Détails du Devis</h2>
      
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
          <CustomSelect
            options={clientOptions}
            value={devis.client}
            onChange={(value) => {
              if (value === 'nouveau') {
                setShowNouveauClientPopup(true);
              } else {
                handleClientChange(value);
              }
            }}
            className={inputClass}
            darkMode={darkMode}
            displayValue={getSelectedClientLabel()}
          />
        ))}
        {renderOption("Catégorie", (
          <CustomSelect
            options={categorieOptions}
            value={devis.categorie}
            onChange={(value) => handleInputChange('categorie', value)}
            className={inputClass}
            darkMode={darkMode}
          />
        ))}
        {renderOption("Sous-catégorie", (
          <CustomSelect
            options={sousCategorieOptions}
            value={devis.sousCategorie}
            onChange={(value) => handleInputChange('sousCategorie', value)}
            className={inputClass}
            darkMode={darkMode}
            disabled={!devis.categorie}
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
            type="number"
            value={devis.poidsEstime}
            onChange={(e) => handleInputChange('poidsEstime', parseFloat(e.target.value))}
            className={inputClass}
            step="0.01"
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

      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default InformationsEtDetails;