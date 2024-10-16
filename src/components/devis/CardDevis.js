import React from 'react';
import { DocumentTextIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const CardDevis = ({ devis, darkMode, formatDate, formatMontant, getStatusColor }) => {
  // Trouver l'image principale
  const mainImage = devis.images && devis.images.find(img => img.isMain);
  const imageUrl = mainImage ? mainImage.url : null;

  // Assurez-vous d'utiliser le bon champ pour le montant total
  const montantTotal = devis.totalGeneral || devis.montantTotal || 0;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105`}>
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img src={imageUrl} alt={`Devis ${devis.numeroDevis || ''}`} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DocumentTextIcon className="h-6 w-6 text-teal-500 mr-2" />
            <h2 className="text-xl font-semibold">{devis.titreDevis || `Devis n°${devis.numeroDevis || 'Non défini'}`}</h2>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(devis.status)}`}>
            {devis.status || 'Non défini'}
          </span>
        </div>
        <p className="text-sm mb-2">
          <span className="font-medium">Client:</span> {devis.clientInfo.nom} - {devis.clientInfo.entreprise}
        </p>
        <p className="text-sm mb-2"><span className="font-medium">Date:</span> {formatDate(devis.createdAt)}</p>
        <p className="text-sm mb-2"><span className="font-medium">Catégorie:</span> {devis.categorie || 'Non défini'}</p>
        <p className="text-sm mb-2"><span className="font-medium">Sous-catégorie:</span> {devis.sousCategorie || 'Non défini'}</p>
        <p className="text-sm mb-2"><span className="font-medium">Métal:</span> {devis.metal || 'Non défini'}</p>
        <p className="text-sm mb-4">
          <span className="font-medium">Montant:</span> {formatMontant(montantTotal)}
        </p>
        {devis.tags && devis.tags.length > 0 && (
          <div className="mb-4">
            <span className="font-medium">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {devis.tags.map((tag, index) => (
                <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200">
              <EyeIcon className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
              <PencilIcon className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <button className={`px-4 py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white transition-colors duration-300`}>
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDevis;
