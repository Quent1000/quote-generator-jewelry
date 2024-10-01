import React from 'react';

const InformationsGenerales = ({ devis, handleInputChange, clients, setShowNouveauClientPopup, darkMode }) => {
  // Définition de inputClass
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Client</label>
          <select
            value={devis.client}
            onChange={(e) => handleInputChange('client', e.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionnez un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.nom}</option>
            ))}
          </select>
          {/* Ajoutez ici un bouton pour créer un nouveau client si nécessaire */}
          <button 
            onClick={() => setShowNouveauClientPopup(true)}
            className="mt-2 text-teal-500 hover:text-teal-600"
          >
            + Créer un nouveau client
          </button>
        </div>
        {/* Ajoutez ici d'autres champs pour les informations générales */}
      </div>
    </div>
  );
};

export default InformationsGenerales;