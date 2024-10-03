import React, { useEffect, useState } from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, CalendarIcon, ChatBubbleLeftRightIcon, XMarkIcon, PencilIcon, IdentificationIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';
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
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full m-4 overflow-hidden`} onClick={e => e.stopPropagation()}>
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
              {entreprise && <p className="text-gray-600 dark:text-gray-400">{entreprise.nom}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Téléphone : {formatPhoneNumber(client.informationsPersonnelles.telephone)}</span>
                </li>
                {client.informationsPersonnelles.telFixe && (
                  <li className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
                    <span>Téléphone fixe : {formatPhoneNumber(client.informationsPersonnelles.telFixe)}</span>
                  </li>
                )}
                <li className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Email : {client.informationsPersonnelles.email}</span>
                </li>
                {client.informationsPersonnelles.linkedinUrl && (
                  <li className="flex items-center">
                    <img src={linkedinIcon} alt="LinkedIn" className="h-5 w-5 mr-2" />
                    <a href={client.informationsPersonnelles.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Profil LinkedIn
                    </a>
                  </li>
                )}
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">Relation client</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-teal-500" />
                  <span>Client depuis : {formatDate(client.relationClient.dateCreation)}</span>
                </li>
                <li className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-teal-500 mt-1" />
                  <span>Commentaire : {client.relationClient.commentaireInterne || 'Aucun commentaire'}</span>
                </li>
                <li className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-yellow-400" />
                  <span>Note client : </span>
                  <div className="flex ml-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${star <= client.relationClient.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </li>
              </ul>

              {client.relationClient.tags && client.relationClient.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap">
                    {client.relationClient.tags.map((tag, index) => (
                      <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {entreprise && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Détails de l'entreprise</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2 text-teal-500" />
                      <span>Nom : {entreprise.nom}</span>
                    </li>
                    {entreprise.raisonSociale && (
                      <li className="flex items-center">
                        <IdentificationIcon className="h-5 w-5 mr-2 text-teal-500" />
                        <span>Raison sociale : {entreprise.raisonSociale}</span>
                      </li>
                    )}
                    {entreprise.siren && (
                      <li className="flex items-center">
                        <IdentificationIcon className="h-5 w-5 mr-2 text-teal-500" />
                        <span>SIREN : {entreprise.siren}</span>
                      </li>
                    )}
                    {entreprise.siret && (
                      <li className="flex items-center">
                        <IdentificationIcon className="h-5 w-5 mr-2 text-teal-500" />
                        <span>SIRET : {entreprise.siret}</span>
                      </li>
                    )}
                    {entreprise.adresse && (
                      <li className="flex items-start">
                        <MapPinIcon className="h-5 w-5 mr-2 text-teal-500 mt-1" />
                        <span>Adresse : {entreprise.adresse}</span>
                      </li>
                    )}
                    {entreprise.siteWeb && (
                      <li className="flex items-center">
                        <GlobeAltIcon className="h-5 w-5 mr-2 text-teal-500" />
                        <a href={entreprise.siteWeb} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Site web
                        </a>
                      </li>
                    )}
                  </ul>
                </>
              )}
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