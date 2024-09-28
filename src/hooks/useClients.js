import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [entreprises, setEntreprises] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const clientsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllClients(clientsList);
      setClients(clientsList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEntreprises = async () => {
      const entreprisesSnapshot = await getDocs(collection(db, 'entreprises'));
      const entreprisesMap = {};
      entreprisesSnapshot.docs.forEach(doc => {
        entreprisesMap[doc.id] = doc.data();
      });
      setEntreprises(entreprisesMap);
    };

    fetchEntreprises();
  }, []);

  useEffect(() => {
    const filteredClients = allClients.filter(client => {
      const clientMatch = 
        client.informationsPersonnelles.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.email.toLowerCase().includes(searchTerm.toLowerCase());

      const entreprise = entreprises[client.entrepriseId];
      const entrepriseMatch = entreprise 
        ? entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase())
        : 'particulier'.includes(searchTerm.toLowerCase());

      return clientMatch || entrepriseMatch;
    });

    setClients(filteredClients);
    setCurrentPage(1);
  }, [searchTerm, allClients, entreprises]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addClient = async (newClient) => {
    // Vérifier si un client avec le même email existe déjà
    const clientsCollection = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsCollection);
    const existingClient = clientsSnapshot.docs.find(doc => doc.data().informationsPersonnelles.email === newClient.informationsPersonnelles.email);

    if (existingClient) {
      console.log('Client déjà existant avec cet email:', existingClient.id);
      return; // Ne pas ajouter le client si un client avec le même email existe déjà
    }

    await addDoc(clientsCollection, newClient);
  };

  const updateClient = async (updatedClient) => {
    try {
      const clientRef = doc(db, 'clients', updatedClient.id);
      await updateDoc(clientRef, updatedClient);
      const updatedClients = allClients.map(client =>
        client.id === updatedClient.id ? updatedClient : client
      );
      setAllClients(updatedClients);
      setClients(updatedClients);
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
    clients: currentClients,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    totalPages: Math.ceil(clients.length / clientsPerPage),
    allClients,
    addClient,
    updateClient,
    entreprises,
    deleteClient
  };
};

export default useClients;