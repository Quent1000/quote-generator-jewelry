import React from 'react';
import CustomSelect from './CustomSelect';
import CustomClientSelect from './CustomClientSelect';

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