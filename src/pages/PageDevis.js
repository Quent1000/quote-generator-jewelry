import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import CardDevis from '../components/devis/CardDevis';
import DevisDetail from '../components/devis/DevisDetail';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PageDevis = () => {
  const { darkMode } = useAppContext();
  const [devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [devisToDelete, setDevisToDelete] = useState(null);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const devisPerPage = 12; // 3 lignes de 4 colonnes

  const indexOfLastDevis = currentPage * devisPerPage;
  const indexOfFirstDevis = indexOfLastDevis - devisPerPage;
  const currentDevis = filteredDevis.slice(indexOfFirstDevis, indexOfLastDevis);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const devisRef = collection(db, 'devis');
        const q = query(devisRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        console.log("Nombre de devis récupérés:", querySnapshot.docs.length);
        
        const devisData = await Promise.all(querySnapshot.docs.map(async (devisDoc) => {
          const data = devisDoc.data();
          let clientInfo = { nom: 'Non défini', entreprise: 'Non définie' };
          
          if (data.client) {
            const clientDoc = await getDoc(doc(db, 'clients', data.client));
            if (clientDoc.exists()) {
              const clientData = clientDoc.data();
              clientInfo = {
                nom: `${clientData.informationsPersonnelles.prenom} ${clientData.informationsPersonnelles.nom}`,
                entreprise: clientData.entrepriseId ? 'À récupérer' : 'Particulier'
              };
              
              if (clientData.entrepriseId) {
                const entrepriseDoc = await getDoc(doc(db, 'entreprises', clientData.entrepriseId));
                if (entrepriseDoc.exists()) {
                  clientInfo.entreprise = entrepriseDoc.data().nom;
                }
              }
            }
          }
          
          return {
            id: devisDoc.id,
            ...data,
            totalGeneral: data.totalGeneral || data.montantTotal || 0,
            clientInfo: clientInfo
          };
        }));
        
        console.log("Devis traités:", devisData);
        setDevis(devisData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur détaillée lors de la récupération des devis:", error);
        setIsLoading(false);
      }
    };

    fetchDevis();
  }, []);

  useEffect(() => {
    let result = [...devis];
    
    // Filtrage par statut
    if (filterStatus !== 'all') {
      result = result.filter(d => d.status === filterStatus);
    }
    
    // Recherche
    if (searchTerm) {
      result = result.filter(d => 
        d.titreDevis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.numeroDevis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.clientInfo.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tri
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
      } else if (sortBy === 'montant') {
        return sortOrder === 'asc' ? a.totalGeneral - b.totalGeneral : b.totalGeneral - a.totalGeneral;
      }
      return 0;
    });

    setFilteredDevis(result);
  }, [devis, filterStatus, sortBy, sortOrder, searchTerm]);

  const formatDate = (date) => {
    if (!date) return 'Date non disponible';
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return 'Date invalide';
    }
    
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMontant = (montant) => {
    if (montant === undefined || montant === null) return 'Non défini';
    return `${parseFloat(montant).toFixed(2)} €`;
  };

  const handleDevisClick = async (devisId) => {
    setIsLoading(true);
    try {
      const devisDoc = await getDoc(doc(db, 'devis', devisId));
      if (devisDoc.exists()) {
        const devisData = devisDoc.data();
        let clientInfo = { nom: 'Non défini', entreprise: 'Non définie' };
        
        if (devisData.client) {
          const clientDoc = await getDoc(doc(db, 'clients', devisData.client));
          if (clientDoc.exists()) {
            const clientData = clientDoc.data();
            clientInfo = {
              nom: `${clientData.informationsPersonnelles.prenom} ${clientData.informationsPersonnelles.nom}`,
              telephone: clientData.informationsPersonnelles.telephone,
              email: clientData.informationsPersonnelles.email,
              entreprise: 'Particulier'
            };
            
            if (clientData.entrepriseId) {
              const entrepriseDoc = await getDoc(doc(db, 'entreprises', clientData.entrepriseId));
              if (entrepriseDoc.exists()) {
                const entrepriseData = entrepriseDoc.data();
                clientInfo.entreprise = entrepriseData.nom;
                clientInfo.adresse = entrepriseData.adresse;
                clientInfo.siret = entrepriseData.siret;
              }
            }
          }
        }
        
        setSelectedDevis({ id: devisDoc.id, ...devisData, clientInfo });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du devis:", error);
    }
    setIsLoading(false);
  };

  const handleCloseDetail = () => {
    setSelectedDevis(null);
  };

  const handleUpdateMainImage = async (devisId, imageId) => {
    try {
      const devisRef = doc(db, 'devis', devisId);
      const devisDoc = await getDoc(devisRef);
      if (devisDoc.exists()) {
        const devisData = devisDoc.data();
        const updatedImages = devisData.images.map(img => ({
          ...img,
          isMain: img.id === imageId
        }));
        
        await updateDoc(devisRef, { images: updatedImages });
        
        // Mettre à jour l'état local
        setSelectedDevis(prevDevis => ({
          ...prevDevis,
          images: updatedImages
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image principale:", error);
    }
  };

  const handleEditDevis = (devisId) => {
    navigate(`/modifier-devis/${devisId}`);
  };

  const handleDeleteDevis = (devisId) => {
    setDevisToDelete(devisId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (devisToDelete) {
      try {
        await deleteDoc(doc(db, 'devis', devisToDelete));
        setDevis(prevDevis => prevDevis.filter(d => d.id !== devisToDelete));
        console.log("Devis supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression du devis:", error);
      }
    }
    setShowDeleteConfirmation(false);
    setDevisToDelete(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-8`}>
      <h1 className="text-3xl font-bold mb-6">Liste des devis</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label htmlFor="filterStatus" className="mr-2">Filtrer par statut:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded bg-white dark:bg-gray-800"
          >
            <option value="all">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Accepté">Accepté</option>
            <option value="Refusé">Refusé</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortBy" className="mr-2">Trier par:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded bg-white dark:bg-gray-800 mr-2"
          >
            <option value="date">Date</option>
            <option value="montant">Montant</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded bg-teal-500 text-white"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentDevis.map((devis) => (
              <CardDevis
                key={devis.id}
                devis={devis}
                darkMode={darkMode}
                formatDate={formatDate}
                formatMontant={formatMontant}
                getStatusColor={getStatusColor}
                onClick={() => handleDevisClick(devis.id)}
                onEdit={() => handleEditDevis(devis.id)}
                onDelete={() => handleDeleteDevis(devis.id)}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            {Array.from({ length: Math.ceil(filteredDevis.length / devisPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {selectedDevis && (
            <DevisDetail 
              devis={selectedDevis} 
              onClose={handleCloseDetail}
              darkMode={darkMode}
              onUpdateMainImage={handleUpdateMainImage}
            />
          )}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex items-center mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
                </div>
                <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PageDevis;
