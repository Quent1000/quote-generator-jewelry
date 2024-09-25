import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [entreprises, setEntreprises] = useState({});

  useEffect(() => {
    fetchClientsAndEntreprises();
  }, []);

  const fetchClientsAndEntreprises = async () => {
    const clientsCollection = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsCollection);
    const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const entreprisesCollection = collection(db, 'entreprises');
    const entreprisesSnapshot = await getDocs(entreprisesCollection);
    const entreprisesMap = {};
    entreprisesSnapshot.docs.forEach(doc => {
      entreprisesMap[doc.id] = doc.data();
    });

    setAllClients(clientsList);
    setClients(clientsList);
    setEntreprises(entreprisesMap);
  };

  useEffect(() => {
    const filteredClients = allClients.filter(client => {
      const clientMatch = 
        client.informationsPersonnelles.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.email.toLowerCase().includes(searchTerm.toLowerCase());

      const entreprise = entreprises[client.entrepriseId];
      const entrepriseMatch = entreprise && entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase());

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
    const docRef = await addDoc(collection(db, 'clients'), newClient);
    const clientWithId = { id: docRef.id, ...newClient };
    setAllClients([...allClients, clientWithId]);
    setClients([...clients, clientWithId]);
  };

  const updateClient = (updatedClient) => {
    const updatedClients = allClients.map(client =>
      client.id === updatedClient.id ? updatedClient : client
    );
    setAllClients(updatedClients);
    setClients(updatedClients);
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
    entreprises
  };
};

export default useClients;