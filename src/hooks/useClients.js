import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entreprises, setEntreprises] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Trier les clients par prénom
        const sortedClients = clientsList.sort((a, b) => 
          a.informationsPersonnelles.prenom.localeCompare(b.informationsPersonnelles.prenom)
        );
        
        setClients(sortedClients);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEntreprises = async () => {
      try {
        const entreprisesSnapshot = await getDocs(collection(db, 'entreprises'));
        const entreprisesMap = {};
        entreprisesSnapshot.docs.forEach(doc => {
          entreprisesMap[doc.id] = doc.data();
        });
        setEntreprises(entreprisesMap);
      } catch (error) {
        console.error("Erreur lors du chargement des entreprises:", error);
      }
    };

    fetchClients();
    fetchEntreprises();
  }, []);

  const addClient = async (newClient) => {
    // Vérifier si un client avec le même email existe déjà
    const clientsCollection = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsCollection);
    const existingClient = clientsSnapshot.docs.find(doc => doc.data().informationsPersonnelles.email === newClient.informationsPersonnelles.email);

    if (existingClient) {
      console.log('Client djà existant avec cet email:', existingClient.id);
      return; // Ne pas ajouter le client si un client avec le même email existe déjà
    }

    if (newClient.entreprise) {
      const entrepriseRef = await addDoc(collection(db, 'entreprises'), {
        nom: newClient.entreprise.nom,
        raisonSociale: newClient.entreprise.raisonSociale,
        // ... (autres champs de l'entreprise)
      });
      newClient.entrepriseId = entrepriseRef.id;
    }

    await addDoc(clientsCollection, newClient);
  };

  const updateClient = async (updatedClient) => {
    try {
      if (!updatedClient || !updatedClient.id) {
        console.error("Client invalide ou ID manquant");
        return;
      }

      const clientRef = doc(db, 'clients', updatedClient.id);
      await updateDoc(clientRef, {
        informationsPersonnelles: updatedClient.informationsPersonnelles,
        entrepriseId: updatedClient.entrepriseId,
        relationClient: updatedClient.relationClient
      });

      // Mise à jour de l'entreprise si nécessaire
      if (updatedClient.entreprise && updatedClient.entreprise.id) {
        const entrepriseRef = doc(db, 'entreprises', updatedClient.entreprise.id);
        const entrepriseUpdate = {
          nom: updatedClient.entreprise.nom || '',
          // Vérifier si raisonSociale existe et n'est pas undefined
          ...(updatedClient.entreprise.raisonSociale !== undefined && {
            raisonSociale: updatedClient.entreprise.raisonSociale
          }),
          // Ajouter d'autres champs de l'entreprise ici, en vérifiant qu'ils ne sont pas undefined
        };
        await updateDoc(entrepriseRef, entrepriseUpdate);
      }

      const updatedClients = clients.map(client =>
        client.id === updatedClient.id ? updatedClient : client
      );
      setClients(updatedClients);

      // Mise à jour de l'état des entreprises
      if (updatedClient.entreprise && updatedClient.entreprise.id) {
        setEntreprises(prev => ({
          ...prev,
          [updatedClient.entreprise.id]: updatedClient.entreprise
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      throw error;
    }
  };

  const deleteClient = async (clientId) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      throw error;
    }
  };

  return {
    clients,
    searchTerm,
    setSearchTerm,
    addClient,
    updateClient,
    entreprises,
    deleteClient,
    isLoading
  };
};

export default useClients;
