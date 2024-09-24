import React, { useState } from 'react';
import { PhoneIcon, GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../context/AppContext';

const ClientCard = ({ client, onClick }) => {
  const { darkMode } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden rounded-lg transition-all duration-300 ease-in-out transform ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } ${
        isHovered ? 'shadow-lg scale-105' : 'shadow-md'
      } cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}  // Ajout de l'événement onClick ici
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 opacity-0 transition-opacity duration-300 ease-in-out z-0" 
           style={{ opacity: isHovered ? 0.1 : 0 }}
      ></div>
      
      <div className="relative z-10 p-5">
        <div className="flex items-center mb-4">
          {client.logo ? (
            <img src={client.logo} alt={`Logo ${client.societe}`} className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-teal-500" />
          ) : (
            <div className={`w-16 h-16 rounded-full mr-4 flex items-center justify-center text-2xl font-bold ${darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`}>
              {client.societe.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-xl">{client.prenom} {client.nom}</h3>
            <p className={`text-sm ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>{client.societe}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="flex items-center transition-transform duration-200 ease-in-out transform hover:translate-x-2">
            <PhoneIcon className="h-4 w-4 mr-2 text-teal-500" />
            {client.telephone}
          </p>
          <p className="flex items-center transition-transform duration-200 ease-in-out transform hover:translate-x-2">
            <EnvelopeIcon className="h-4 w-4 mr-2 text-teal-500" />
            {client.email}
          </p>
          <p className="flex items-center transition-transform duration-200 ease-in-out transform hover:translate-x-2">
            <GlobeAltIcon className="h-4 w-4 mr-2 text-teal-500" />
            {client.siteWeb || 'Non renseigné'}
          </p>
        </div>
      </div>
      
      <div className={`px-5 py-3 mt-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ease-in-out ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      } ${
        isHovered ? 'bg-opacity-90' : ''
      }`}>
        Client depuis : {new Date(client.dateCreation).toLocaleDateString()}
      </div>
      
      {isHovered && (
        <div className={`absolute bottom-0 left-0 right-0 p-3 text-xs bg-teal-500 text-white transform transition-transform duration-300 ease-in-out ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {client.commentaireInterne || 'Aucun commentaire'}
        </div>
      )}
    </div>
  );
};

export default ClientCard;