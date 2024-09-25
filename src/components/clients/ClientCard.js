import React, { useState, useEffect } from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';

const ClientCard = ({ client, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useAppContext();
  const [entreprise, setEntreprise] = useState(null);

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

  const getInitials = () => {
    const prenom = client.informationsPersonnelles?.prenom || '';
    const nom = client.informationsPersonnelles?.nom || '';
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  };

  if (!client || !client.informationsPersonnelles) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="px-6 py-4">
        <div className="flex items-center mb-2">
          {entreprise && entreprise.logo ? (
            <img 
              src={entreprise.logo} 
              alt={`Logo ${entreprise.nom}`} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4 ${
              darkMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'
            }`}>
              {getInitials()}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">
              {client.informationsPersonnelles.prenom} {client.informationsPersonnelles.nom}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{entreprise?.nom || 'Chargement...'}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 min-h-[96px]"> {/* Ajout d'une hauteur minimale */}
          {client.informationsPersonnelles.email && (
            <p className="flex items-center text-sm">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-teal-500" />
              {client.informationsPersonnelles.email}
            </p>
          )}
          {client.informationsPersonnelles.telephone && (
            <p className="flex items-center text-sm">
              <PhoneIcon className="h-5 w-5 mr-2 text-teal-500" />
              {formatPhoneNumber(client.informationsPersonnelles.telephone)}
            </p>
          )}
          {entreprise?.siteWeb && (
            <p className="flex items-center text-sm">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-teal-500" />
              {entreprise.siteWeb}
            </p>
          )}
        </div>
      </div>
      
      <div className={`px-5 py-3 mt-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ease-in-out ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      } ${
        isHovered ? 'bg-opacity-90' : ''
      }`}>
        Client depuis : {new Date(client.relationClient?.dateCreation || Date.now()).toLocaleDateString()}
      </div>
      
      {isHovered && (
        <div className={`absolute bottom-0 left-0 right-0 p-3 text-xs bg-teal-500 text-white transform transition-transform duration-300 ease-in-out ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {client.relationClient?.commentaireInterne || 'Aucun commentaire'}
        </div>
      )}
    </div>
  );
};

export default ClientCard;