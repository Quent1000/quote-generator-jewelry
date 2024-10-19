import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, getDoc, doc, updateDoc } from 'firebase/firestore';
import CardDevis from '../components/devis/CardDevis';
import DevisDetail from '../components/devis/DevisDetail';
import { useNavigate } from 'react-router-dom';

const PageDevis = () => {
  const { darkMode } = useAppContext();
  const [devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">Liste des devis</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devis.map((devis) => (
              <CardDevis
                key={devis.id}
                devis={devis}
                darkMode={darkMode}
                formatDate={formatDate}
                formatMontant={formatMontant}
                getStatusColor={getStatusColor}
                onClick={() => handleDevisClick(devis.id)}
                onEdit={() => handleEditDevis(devis.id)}
              />
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
        </>
      )}
    </div>
  );
};

export default PageDevis;
