import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useClientState = (initialClient) => {
  const [clientData, setClientData] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (initialClient) {
      setClientData(initialClient);
      setTags(initialClient.relationClient.tags || []);
      fetchEntreprise(initialClient.entrepriseId);
    }
  }, [initialClient]);

  const fetchEntreprise = async (entrepriseId) => {
    if (entrepriseId) {
      const entrepriseDoc = await getDoc(doc(db, 'entreprises', entrepriseId));
      if (entrepriseDoc.exists()) {
        setEntreprise(entrepriseDoc.data());
      }
    }
  };

  const updateClientData = (field, value) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  const updateEntreprise = (field, value) => {
    setEntreprise(prev => ({ ...prev, [field]: value }));
  };

  return { clientData, entreprise, tags, updateClientData, updateEntreprise, setTags };
};

export default useClientState;