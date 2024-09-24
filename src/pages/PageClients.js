import React, { useState } from 'react';
import ClientList from '../components/clients/ClientList';
import NouveauClientForm from '../components/clients/NouveauClientForm';
import ClientDetails from '../components/clients/ClientDetails';
import SearchInput from '../components/common/SearchInput';
import useClients from '../hooks/useClients';
import { exportClientsToCSV } from '../utils/exportClients';
import { useAppContext } from '../context/AppContext';

const PageClients = () => {
  const { darkMode } = useAppContext();
    const {
        clients,
        setClients,
        searchTerm,
        setSearchTerm,
        currentPage,
        paginate,
        totalPages,
        requestSort,
        sortConfig,
        allClients
    } = useClients();

    const [afficherFormulaire, setAfficherFormulaire] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const ajouterClient = (nouveauClient) => {
      setClients(prevClients => [...prevClients, { ...nouveauClient, id: Date.now() }]);
      setAfficherFormulaire(false);
    };

    const buttonClass = 'bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

    return (
      <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300">Clients ({clients.length})</h2>
            <div>
              <button onClick={() => setAfficherFormulaire(!afficherFormulaire)} className={`${buttonClass} mr-2`}>
                {afficherFormulaire ? 'Annuler' : 'Ajouter un client'}
              </button>
              <button onClick={() => exportClientsToCSV(allClients)} className={buttonClass}>
                Exporter CSV
              </button>
            </div>
          </div>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            darkMode={darkMode}
          />
          {afficherFormulaire && <NouveauClientForm onAjouterClient={ajouterClient} darkMode={darkMode} />}
        </div>
        <ClientList
          clients={clients}
          darkMode={darkMode}
          onClientClick={setSelectedClient}
          requestSort={requestSort}
          sortConfig={sortConfig}
        />
        <div className="p-4 flex justify-center">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === number + 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {number + 1}
            </button>
          ))}
        </div>
        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            darkMode={darkMode}
          />
        )}
      </div>
    );
};

export default PageClients;