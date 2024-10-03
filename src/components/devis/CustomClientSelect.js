import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase'; // Assurez-vous que le chemin d'importation est correct
import { doc, getDoc } from 'firebase/firestore';

const CustomClientSelect = ({ clients, value, onChange, className, darkMode, setShowNouveauClientPopup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [clientsWithEntreprise, setClientsWithEntreprise] = useState([]);
  const selectRef = useRef(null);

  useEffect(() => {
    const fetchEntreprises = async () => {
      const clientsWithEntrepriseData = await Promise.all(clients.map(async (client) => {
        if (client.entrepriseId) {
          const entrepriseDoc = await getDoc(doc(db, 'entreprises', client.entrepriseId));
          if (entrepriseDoc.exists()) {
            return { ...client, entreprise: entrepriseDoc.data() };
          }
        }
        return client;
      }));
      setClientsWithEntreprise(clientsWithEntrepriseData);
    };

    fetchEntreprises();
  }, [clients]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredClients(
      clientsWithEntreprise.filter(client =>
        client.informationsPersonnelles.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.entreprise && client.entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, clientsWithEntreprise]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (clientId) => {
    onChange(clientId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDisplayValue = () => {
    if (!value) return '';
    const selectedClient = clientsWithEntreprise.find(client => client.id === value);
    if (selectedClient) {
      return `${selectedClient.informationsPersonnelles.nom} ${selectedClient.informationsPersonnelles.prenom}${selectedClient.entreprise ? ` - ${selectedClient.entreprise.nom}` : ''}`;
    }
    return '';
  };

  return (
    <div className="relative w-full" ref={selectRef}>
      <div className={`${className} flex items-center`}>
        <input
          type="text"
          value={isOpen ? searchTerm : getDisplayValue()}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder="Rechercher un client ou une entreprise"
          className={`w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
        />
        <span className="ml-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>▼</span>
      </div>
      {isOpen && (
        <div 
          className={`absolute z-50 w-full mt-1 border rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          }`}
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            position: 'absolute',
            left: 0,
            top: '100%',
            width: '100%',
          }}
        >
          <div
            className={`px-4 py-2 cursor-pointer ${
              darkMode
                ? 'bg-teal-700 text-white hover:bg-teal-600'
                : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
            }`}
            onClick={() => {
              setShowNouveauClientPopup(true);
              setIsOpen(false);
            }}
          >
            + Créer un nouveau client
          </div>
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={`px-4 py-2 cursor-pointer ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
              onClick={() => handleOptionClick(client.id)}
            >
              <div>{client.informationsPersonnelles.nom} {client.informationsPersonnelles.prenom}</div>
              {client.entreprise && (
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {client.entreprise.nom}
                </div>
              )}
              {!client.entreprise && (
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Particulier
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomClientSelect;