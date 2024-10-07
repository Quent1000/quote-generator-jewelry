import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import CardDevis from '../components/devis/CardDevis';

const PageDevis = () => {
  const { darkMode } = useAppContext();
  const [devis, setDevis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const devisRef = collection(db, 'devis');
        const q = query(devisRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const devisData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Assurez-vous que totalGeneral est bien récupéré
          return {
            id: doc.id,
            ...data,
            totalGeneral: data.totalGeneral || data.montantTotal || 0,
          };
        });
        console.log("Devis récupérés:", devisData);
        setDevis(devisData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des devis:", error);
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

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">Liste des devis</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : devis.length === 0 ? (
        <p>Aucun devis trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devis.map((devis) => (
            <CardDevis
              key={devis.id}
              devis={devis}
              darkMode={darkMode}
              formatDate={formatDate}
              formatMontant={formatMontant}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageDevis;