import React, { useState } from 'react';
import ClientCard from './ClientCard';
import NouveauClientForm from './NouveauClientForm';

const PageClients = ({ darkMode }) => {
    const [clients, setClients] = useState([
      { id: 1, prenom: 'David', nom: 'Gusky', societe: 'DAVIDOR', email: 'dgusky@davidor.com', telephone: '0783009816', adresse: '12 Place Vendôme, 75001 Paris' },
      { id: 2, prenom: 'Quentin', nom: 'Imhoff', societe: 'TGN409', email: 'imhoff.quentin@orange.fr', telephone: '0645376438', adresse: '24 Rue du Faubourg Saint-Honoré, 75008 Paris' },
      { id: 3, prenom: 'Sophie', nom: 'Marceau', societe: 'Bijoux de Star', email: 'sophie@bijouxdestar.fr', telephone: '0198765432', adresse: '8 Avenue Montaigne, 75008 Paris' },
      { id: 4, prenom: 'Pierre', nom: 'Dubois', societe: 'Joaillerie Élégance', email: 'pierre@joaillerie-elegance.com', telephone: '0456789012', adresse: '15 Rue de la Paix, 75002 Paris' },
      { id: 5, prenom: 'Marie', nom: 'Lefort', societe: 'Diamants & Co', email: 'marie@diamantsetco.fr', telephone: '0567890123', adresse: '30 Rue du Rhône, 1204 Genève, Suisse' },
      { id: 6, prenom: 'Jean', nom: 'Martin', societe: 'Bijoux Précieux', email: 'jean@bijouxprecieux.com', telephone: '0678901234', adresse: '5 Rue du Faubourg Saint-Honoré, 75008 Paris' },
      { id: 7, prenom: 'Isabelle', nom: 'Dupont', societe: 'Perles Rares', email: 'isabelle@perlesrares.fr', telephone: '0789012345', adresse: '18 Place Vendôme, 75001 Paris' },
      { id: 8, prenom: 'François', nom: 'Leclerc', societe: 'Or & Argent', email: 'francois@oretargent.com', telephone: '0890123456', adresse: '10 Rue de la Paix, 75002 Paris' },
      // Ajoutez autant de clients que nécessaire...
    ]);

    const [afficherFormulaire, setAfficherFormulaire] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    const ajouterClient = (nouveauClient) => {
      setClients(prevClients => [...prevClients, { ...nouveauClient, id: Date.now() }]);
      setAfficherFormulaire(false);
    };

    const filteredClients = clients.filter(client =>
      `${client.prenom} ${client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.societe.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputClass = `w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring focus:ring-teal-200`;
    const buttonClass = 'bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

    return (
      <div className={`h-full flex flex-col ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-gray-50'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300">Clients ({clients.length})</h2>
            <button onClick={() => setAfficherFormulaire(!afficherFormulaire)} className={buttonClass}>
              {afficherFormulaire ? 'Annuler' : 'Ajouter un client'}
            </button>
          </div>
          <input
            type="text"
            placeholder="Rechercher un client..."
            className={`${inputClass} mb-4`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {afficherFormulaire && <NouveauClientForm onAjouterClient={ajouterClient} darkMode={darkMode} />}
        </div>
        <div className="flex-grow overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div key={client.id} onClick={() => setSelectedClient(client)}>
                <ClientCard client={client} darkMode={darkMode} />
              </div>
            ))}
          </div>
        </div>
        {selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setSelectedClient(null)}>
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full`} onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">{selectedClient.prenom} {selectedClient.nom}</h2>
              <p><strong>Société:</strong> {selectedClient.societe}</p>
              <p><strong>Email:</strong> {selectedClient.email}</p>
              <p><strong>Téléphone:</strong> {selectedClient.telephone}</p>
              <p><strong>Adresse:</strong> {selectedClient.adresse}</p>
              <button className={`${buttonClass} mt-4`} onClick={() => setSelectedClient(null)}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    );
};

export default PageClients;