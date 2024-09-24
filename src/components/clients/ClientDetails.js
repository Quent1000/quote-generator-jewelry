import React from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, CalendarIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ClientDetails = ({ client, onClose, darkMode }) => {
  const buttonClass = 'bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full m-4 overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="relative p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center mb-6">
            {client.entreprise.logo ? (
              <img src={client.entreprise.logo} alt={`Logo ${client.entreprise.nom}`} className="w-20 h-20 rounded-full mr-6 object-cover" />
            ) : (
              <div className={`w-20 h-20 rounded-full mr-6 flex items-center justify-center text-3xl font-bold ${darkMode ? 'bg-gray-700' : 'bg-teal-100 text-teal-800'}`}>
                {client.entreprise.nom.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{client.informationsPersonnelles.prenom} {client.informationsPersonnelles.nom}</h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{client.entreprise.nom}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations de contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Portable : {client.informationsPersonnelles.telephone}</span>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Fixe : {client.informationsPersonnelles.telFixe || 'Non renseigné'}</span>
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>{client.informationsPersonnelles.email}</span>
                </li>
                <li className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>{client.entreprise.siteWeb || 'Non renseigné'}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Détails</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Client depuis : {new Date(client.relationClient.dateCreation).toLocaleDateString()}</span>
                </li>
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-teal-500 mt-1" />
                  <span>Commentaire : {client.relationClient.commentaireInterne || 'Aucun commentaire'}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Adresse</h3>
            <p>{client.entreprise.adresse}</p>
          </div>
        </div>
        <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <button className={`${buttonClass} w-full`} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;