import React from 'react';
import CustomSelect from './CustomSelect';

const InformationsGenerales = ({ devis, handleInputChange, handleClientChange, setShowNouveauClientPopup, darkMode, clients }) => {
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
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
      </div>
      <div>
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

export default InformationsGenerales;