import React from 'react';
import ClientCard from './ClientCard';

const ClientList = ({ clients, darkMode, onClientClick, requestSort, sortConfig }) => {
  const getSortDirection = (key) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key ? sortConfig.direction : undefined;
  };

  return (
    <div className="flex-grow overflow-auto p-4">
      <div className="mb-4 flex justify-between">
        <button onClick={() => requestSort('nom')} className="px-2 py-1 bg-teal-500 text-white rounded">
          Trier par nom {getSortDirection('nom') === 'ascending' ? '↑' : '↓'}
        </button>
        <button onClick={() => requestSort('entreprise.nom')} className="px-2 py-1 bg-teal-500 text-white rounded">
          Trier par entreprise {getSortDirection('entreprise.nom') === 'ascending' ? '↑' : '↓'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={{
              id: client.id,
              prenom: client.informationsPersonnelles.prenom,
              nom: client.informationsPersonnelles.nom,
              societe: client.entreprise.nom,
              email: client.informationsPersonnelles.email,
              telephone: client.informationsPersonnelles.telephone,
              adresse: client.entreprise.adresse,
              logo: client.entreprise.logo,
              telFixe: client.informationsPersonnelles.telFixe,
              siteWeb: client.entreprise.siteWeb,
              dateCreation: client.relationClient.dateCreation,
              commentaireInterne: client.relationClient.commentaireInterne,
            }}
            darkMode={darkMode}
            onClick={() => onClientClick(client)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientList;