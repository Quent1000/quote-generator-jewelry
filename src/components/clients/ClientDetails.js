import React, { useEffect, useState } from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, CalendarIcon, ChatBubbleLeftRightIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';
import linkedinIcon from '../../assets/icone-linkedin.png';

const ClientDetails = ({ client, onClose, darkMode, onEdit }) => {
  const [entreprise, setEntreprise] = useState(null);
  const buttonClass = 'bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

  useEffect(() => {
    const fetchEntreprise = async () => {
      if (client.entrepriseId) {
        const entrepriseDoc = await getDoc(doc(db, 'entreprises', client.entrepriseId));
        if (entrepriseDoc.exists()) {
          setEntreprise(entrepriseDoc.data());
        }
      }
    };
    fetchEntreprise();
  }, [client.entrepriseId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

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
          <button 
            onClick={onEdit}
            className="absolute top-4 right-14 text-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
          >
            <PencilIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center mb-6">
            {entreprise && entreprise.logo ? (
              <img src={entreprise.logo} alt={`Logo ${entreprise.nom}`} className="w-20 h-20 rounded-full mr-6 object-cover" />
            ) : (
              <div className={`w-20 h-20 rounded-full mr-6 flex items-center justify-center text-3xl font-bold ${darkMode ? 'bg-gray-700' : 'bg-teal-100 text-teal-800'}`}>
                {client.informationsPersonnelles.prenom.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{client.informationsPersonnelles.prenom} {client.informationsPersonnelles.nom}</h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {entreprise ? entreprise.nom : 'Particulier'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations de contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Portable : {formatPhoneNumber(client.informationsPersonnelles.telephone)}</span>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Fixe : {client.informationsPersonnelles.telFixe ? formatPhoneNumber(client.informationsPersonnelles.telFixe) : 'Non renseigné'}</span>
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>{client.informationsPersonnelles.email}</span>
                </li>
                {entreprise && entreprise.siteWeb && (
                  <li className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 mr-2 text-teal-500" />
                    <a 
                      href={entreprise.siteWeb.startsWith('http') ? entreprise.siteWeb : `https://${entreprise.siteWeb}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {entreprise.siteWeb}
                    </a>
                  </li>
                )}
                {client.informationsPersonnelles.linkedinUrl && (
                  <li className="flex items-center">
                    <img src={linkedinIcon} alt="LinkedIn" className="h-5 w-5 mr-2" />
                    <a 
                      href={client.informationsPersonnelles.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Profil LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Détails</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Client depuis : {formatDate(client.relationClient.dateCreation)}</span>
                </li>
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-teal-500 mt-1" />
                  <span>Commentaire : {client.relationClient.commentaireInterne || 'Aucun commentaire'}</span>
                </li>
              </ul>
            </div>
          </div>
          {entreprise && entreprise.adresse && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Adresse</h3>
              <p>{entreprise.adresse}</p>
            </div>
          )}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Note client</h3>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-6 w-6 ${star <= client.relationClient.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
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