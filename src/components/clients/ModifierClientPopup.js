import React, { useState } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ClientForm from './ClientForm';
import useClientState from '../../hooks/useClientState';
import { validateClientForm } from '../../utils/clientValidation';
import { formatWebsite } from '../../utils/formatters';
import useClients from '../../hooks/useClients'; // Ajoutez cette ligne

const ModifierClientPopup = ({ isOpen, onClose, client, darkMode, onClientUpdated }) => {
  const { clientData, entreprise, tags, updateClientData, updateEntreprise, setTags } = useClientState(client);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { deleteClient } = useClients(); // Ajoutez cette ligne

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateClientForm(clientData, entreprise);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const updatedClient = {
          ...clientData,
          relationClient: { ...clientData.relationClient, tags }
        };
        await updateDoc(doc(db, 'clients', clientData.id), updatedClient);
        
        if (entreprise && clientData.entrepriseId) {
          const updatedEntreprise = {
            ...entreprise,
            siteWeb: formatWebsite(entreprise.siteWeb)
          };
          await updateDoc(doc(db, 'entreprises', clientData.entrepriseId), updatedEntreprise);
        }
        
        onClientUpdated(updatedClient);
        onClose();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du client :", error);
        alert("Une erreur s'est produite lors de la mise à jour du client.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.")) {
      try {
        await deleteClient(clientData.id);
        onClose();
        // Vous pouvez ajouter ici une notification ou un message de succès
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        // Gérez l'erreur (par exemple, affichez un message d'erreur à l'utilisateur)
      }
    }
  };

  if (!isOpen || !clientData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className={`relative w-full max-w-4xl p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-300">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
          Modifier le client
        </h2>
        <ClientForm
          client={clientData}
          entreprise={entreprise}
          onChange={updateClientData}
          onEntrepriseChange={updateEntreprise}
          onTagsChange={setTags}
          errors={errors}
          darkMode={darkMode}
        />
        <div className="flex justify-between space-x-4 mt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
          >
            <TrashIcon className="h-5 w-5 inline-block mr-2" />
            Supprimer le client
          </button>
          <div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-colors duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`ml-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierClientPopup;