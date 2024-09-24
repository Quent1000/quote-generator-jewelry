import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const useClients = () => {
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 12;

  useEffect(() => {
    const fetchClients = async () => {
      const clientsCollection = collection(db, 'clients');
      const clientsQuery = query(clientsCollection, orderBy('informationsPersonnelles.nom'));
      const clientsSnapshot = await getDocs(clientsQuery);
      const clientsList = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllClients(clientsList);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    let filteredClients = allClients;

    if (searchTerm) {
      filteredClients = allClients.filter(client =>
        client.informationsPersonnelles.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.informationsPersonnelles.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setClients(filteredClients);
  }, [allClients, searchTerm]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const addClient = useCallback((newClient) => {
    setAllClients(prevClients => [...prevClients, newClient]);
  }, []);

  return {
    clients: currentClients,
    allClients,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    totalPages: Math.ceil(clients.length / clientsPerPage),
    addClient
  };
};

export default useClients;