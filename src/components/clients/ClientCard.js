import React, { useState, useEffect } from 'react';
import { PhoneIcon, EnvelopeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';

const ClientCard = ({ client, darkMode, onClick }) => {
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

  const cardClass = `p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
    darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-50'
  }`;

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="flex items-center mb-2">
        {entreprise && entreprise.logo ? (
          <img src={entreprise.logo} alt={`Logo ${entreprise.nom}`} className="w-12 h-12 rounded-full mr-4 object-cover" />
        ) : (
          <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-xl font-bold ${darkMode ? 'bg-gray-700' : 'bg-teal-100 text-teal-800'}`}>
            {client.informationsPersonnelles.prenom.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{client.informationsPersonnelles.prenom} {client.informationsPersonnelles.nom}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {client.entrepriseId ? (entreprise ? entreprise.nom : "Chargement...") : "Particulier"}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="flex items-center text-sm">
          <PhoneIcon className="h-4 w-4 mr-2 text-teal-500" />
          {formatPhoneNumber(client.informationsPersonnelles.telephone)}
        </p>
        <p className="flex items-center text-sm">
          <EnvelopeIcon className="h-4 w-4 mr-2 text-teal-500" />
          {client.informationsPersonnelles.email}
        </p>
        {entreprise && entreprise.adresse && (
          <p className="flex items-center text-sm">
            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-teal-500" />
            {entreprise.adresse}
          </p>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-4 w-4 ${star <= client.relationClient.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Client depuis : {new Date(client.relationClient.dateCreation).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ClientCard;