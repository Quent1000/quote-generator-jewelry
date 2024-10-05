import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const InfosSupplementaires = ({ devis, handleInputChange, darkMode }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const handleAddTag = () => {
    const newTag = prompt("Entrez un nouveau tag :");
    if (newTag) {
      handleInputChange('tags', [...devis.tags, newTag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleInputChange('tags', devis.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Informations supplémentaires</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Conditions de paiement</label>
        <input
          type="text"
          value={devis.paymentTerms}
          onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
          className={inputClass}
          placeholder="Ex: 50% à la commande, 50% à la livraison"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {devis.tags.map(tag => (
            <span key={tag} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm flex items-center">
              {tag}
              <XMarkIcon className="w-4 h-4 ml-1 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </span>
          ))}
        </div>
        <button
          onClick={handleAddTag}
          className="flex items-center text-teal-600 hover:text-teal-700"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Ajouter un tag
        </button>
      </div>
    </div>
  );
};

export default InfosSupplementaires;