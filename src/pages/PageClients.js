import { useState, useEffect } from 'react';
import ClientList from '../components/clients/ClientList';
import ClientDetails from '../components/clients/ClientDetails';
import SearchInput from '../components/common/SearchInput';
import NouveauClientPopup from '../components/clients/NouveauClientPopup';
import ModifierClientPopup from '../components/clients/ModifierClientPopup';
import useClients from '../hooks/useClients';
import { useAppContext } from '../context/AppContext';
import { PlusIcon } from '@heroicons/react/24/outline';

const PageClients = () => {
  const { darkMode } = useAppContext();
  const {
    clients,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    totalPages,
    allClients,
    addClient,
    updateClient
  } = useClients();

  const [selectedClient, setSelectedClient] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModifierPopupOpen, setIsModifierPopupOpen] = useState(false);

  useEffect(() => {
    // Réagir aux changements de l'état des clients
  }, [clients]);

  const buttonClass = `
    group
    relative
    overflow-hidden
    bg-gradient-to-r from-teal-500 to-teal-400
    text-white
    font-semibold
    py-3 px-6
    rounded-full
    shadow-lg
    transform transition duration-200 ease-in-out
    hover:scale-105 hover:shadow-xl
    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50
  `;

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            Clients <span className="text-2xl font-normal">({allClients.length})</span>
          </h2>
          <button onClick={() => setIsPopupOpen(true)} className={buttonClass}>
            <span className="absolute inset-0 bg-white opacity-20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out"></span>
            <span className="relative flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter un client
            </span>
          </button>
        </div>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          darkMode={darkMode}
        />
      </div>
      <ClientList
        clients={clients}
        darkMode={darkMode}
        onClientClick={setSelectedClient}
      />
      <div className="p-4 flex justify-center">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`mx-1 px-4 py-2 rounded-full
              ${currentPage === number + 1
                ? 'bg-teal-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              transition duration-200 ease-in-out
            `}
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
          onEdit={() => {
            setIsModifierPopupOpen(true);
            setSelectedClient(null);
          }}
        />
      )}
      <NouveauClientPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        darkMode={darkMode}
        onClientAdded={(newClient) => {
          addClient(newClient);
          setIsPopupOpen(false);
        }}
      />
      <ModifierClientPopup
        isOpen={isModifierPopupOpen}
        onClose={() => setIsModifierPopupOpen(false)}
        client={selectedClient}
        darkMode={darkMode}
        onClientUpdated={(updatedClient) => {
          updateClient(updatedClient);
          setIsModifierPopupOpen(false);
        }}
      />
    </div>
  );
};

export default PageClients;