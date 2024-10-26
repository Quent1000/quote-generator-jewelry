import React, { useState } from 'react';
import ClientDetails from '../components/clients/ClientDetails';
import SearchInput from '../components/common/SearchInput';
import NouveauClientPopup from '../components/clients/NouveauClientPopup';
import ModifierClientPopup from '../components/clients/ModifierClientPopup';
import useClients from '../hooks/useClients';
import { useAppContext } from '../context/AppContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import ClientCard from '../components/clients/ClientCard';

const PageClients = () => {
  const { darkMode } = useAppContext();
  const {
    clients,
    searchTerm,
    setSearchTerm,
    addClient,
    updateClient,
    entreprises,
    isLoading
  } = useClients();

  const [selectedClient, setSelectedClient] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModifierPopupOpen, setIsModifierPopupOpen] = useState(false);

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

  const filteredClients = clients
    .filter(client => {
      const clientMatch = 
        client.informationsPersonnelles.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.email.toLowerCase().includes(searchTerm.toLowerCase());

      const entreprise = entreprises[client.entrepriseId];
      const entrepriseMatch = entreprise 
        ? entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      return clientMatch || entrepriseMatch;
    })
    .sort((a, b) => a.informationsPersonnelles.prenom.localeCompare(b.informationsPersonnelles.prenom));

  return (
    <AnimatedBackground darkMode={darkMode} intensity="low">
      <div className={`min-h-screen flex flex-col ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
              Clients <span className="text-2xl font-normal">({clients.length})</span>
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
        {isLoading ? (
          <p className="text-center">Chargement des clients...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                darkMode={darkMode}
                onClick={() => setSelectedClient(client)}
              />
            ))}
          </div>
        )}
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
    </AnimatedBackground>
  );
};

export default PageClients;
