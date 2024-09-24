import { useState, useEffect, useMemo } from 'react';
import clientsData from '../data/clientsData';

const useClients = (clientsPerPage = 12) => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    setClients(clientsData);
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client &&
      client.informationsPersonnelles &&
      client.informationsPersonnelles.prenom &&
      client.informationsPersonnelles.nom &&
      client.entreprise &&
      client.entreprise.nom &&
      (`${client.informationsPersonnelles.prenom} ${client.informationsPersonnelles.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clients, searchTerm]);

  const sortedClients = useMemo(() => {
    let sortableClients = [...filteredClients];
    if (sortConfig.key !== null) {
      sortableClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClients;
  }, [filteredClients, sortConfig]);

  const currentClients = useMemo(() => {
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    return sortedClients.slice(indexOfFirstClient, indexOfLastClient);
  }, [sortedClients, currentPage, clientsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return {
    clients: currentClients,
    allClients: clients, // Ajout de cette ligne
    setClients,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    totalPages: Math.ceil(sortedClients.length / clientsPerPage),
    requestSort,
    sortConfig
  };
};

export default useClients;