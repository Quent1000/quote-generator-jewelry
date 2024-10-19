import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { db, storage, getNextDevisNumber, getLastDevisNumber, auth } from '../firebase';  // Ajoutez getNextDevisNumber ici
import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import NouveauClientPopup from '../components/clients/NouveauClientPopup';
import DiamantsPierres from '../components/devis/DiamantsPierres';
import ComposantsEtAutres from '../components/devis/ComposantsEtAutres'; // Ajoutez cette ligne
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useParams, useNavigate } from 'react-router-dom';

// Importation des composants
import InformationsEtDetails from '../components/devis/InformationsEtDetails';
import OptionsProduit from '../components/devis/OptionsProduit';
import TempsProduction from '../components/devis/TempsProduction';
import TarifsImpression from '../components/devis/TarifsImpression';
import ImagesDevis from '../components/devis/ImagesDevis';
import ResumeDevis from '../components/devis/ResumeDevis'; // Créez ce composant
import { calculateDevis } from '../utils/devisUtils';

const PageCreerDevisV2 = () => {
  const { devisId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeDevisTab') || 'informations';
  });
  const [showNouveauClientPopup, setShowNouveauClientPopup] = useState(false);
  const [devis, setDevis] = useState({
    client: '',
    titreDevis: '',
    commentaireInterne: '',
    categorie: '',
    sousCategorie: '',
    metal: '',
    taille: '',
    poidsEstime: '',
    description: '',
    gravure: '',
    styleGravure: '',
    options: {
      poinconMaitre: '',
      poinconTitre: '',
      marque: '',
      gravureLogoMarque: false,
      gravureNumeroSerie: false,
      rhodiage: false
    },
    diamants: [{
      taille: '',
      qte: 0, // Changé de 1 à 0
      fourniPar: 'TGN 409',
      sertissage: '',
      carat: 0,
      prixUnitaire: 0,
      prixTotal: 0,
      prixSertissage: 0
    }],
    autresPierres: [{
      forme: '',
      type: '',
      taille: '',
      qte: 0, // Changé de 1 à 0
      fourniPar: 'TGN 409',
      sertissage: '',
      prix: 0,
      prixTotal: 0,
      prixSertissage: 0
    }],
    tempsProduction: {
      administratif: { heures: 0, minutes: 0 },
      cao: { heures: 0, minutes: 0 },
      bijouterie: { heures: 0, minutes: 0 },
      joaillerie: { heures: 0, minutes: 0 }, // Changé de polissage à joaillerie
      dessertissage: { heures: 0, minutes: 0 },
      design: { heures: 0, minutes: 0 },
    },
    tarifFonte: '',
    tarifImpressionCire: '',
    tarifImpressionResine: '',
    typeLivraison: '',
    prixLivraison: 0,
    remise: { type: 'pourcentage', valeur: 0 },
    composantsFrequents: [],
    composantsLibres: [],
    createdBy: '', // ID de l'utilisateur créateur
    createdAt: null, // Date de création
    updatedAt: null, // Date de dernière modification
    status: 'brouillon', // Statut du devis
    version: 1, // Numéro de version
    tags: [], // Tags ou catégories
    currency: 'EUR', // Devise
    validUntil: null, // Date de validité
    paymentTerms: '', // Conditions de paiement
    internalNotes: '', // Notes internes
    images: [], // Assurez-vous que c'est initialisé comme un tableau vide
  });


  const [clients, setClients] = useState([]);
  const [metaux, setMetaux] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImageId, setMainImageId] = useState(null);

  const [valeurMetal, setValeurMetal] = useState(0);
  const [parametres, setParametres] = useState({
    tauxHoraires: {
      administratif: 0,
      cao: 0,
      bijouterie: 0,
      joaillerie: 0,
      desertissage: 0,
      design: 0,
    },
    prixSertissage: {},
    prixDiamantsRonds: {},
    coefficientDiamantsRonds: 1.15,
  });
  const [stylesGravure, setStylesGravure] = useState([]);
  const [diametresEtCarats, setDiametresEtCarats] = useState({
    "0.5": 0.00025, "0.6": 0.003, "0.7": 0.004, "0.8": 0.005, "0.9": 0.006,
    "1.0": 0.007, "1.1": 0.008, "1.2": 0.009, "1.25": 0.01, "1.3": 0.0105,
    "1.4": 0.012, "1.5": 0.015, "1.6": 0.02, "1.7": 0.025, "1.8": 0.028,
    "1.9": 0.03, "2.0": 0.035, "2.1": 0.038, "2.2": 0.04, "2.3": 0.045,
    "2.4": 0.05, "2.5": 0.06, "2.6": 0.07, "2.7": 0.08, "2.8": 0.1,
    "2.9": 0.11, "3.0": 0.12, "3.25": 0.13, "3.3": 0.14, "3.4": 0.155,
    "3.5": 0.17, "3.55": 0.18, "3.65": 0.19, "3.7": 0.2, "3.75": 0.21,
    "3.8": 0.22, "3.85": 0.23, "3.9": 0.24, "3.95": 0.25, "4.0": 0.26,
    "4.05": 0.27, "4.1": 0.28, "4.15": 0.29, "4.2": 0.3, "4.25": 0.31,
    "4.3": 0.32, "4.35": 0.33, "4.4": 0.34, "4.45": 0.35, "4.5": 0.36,
    "4.55": 0.37
  });
  const [formesPierres, setFormesPierres] = useState([
    "Rond",
    "Ovale",
    "Poire",
    "Coussin",
    "Marquise",
    "Émeraude",
    "Princesse",
    "Asscher",
    "Cœur",
    "Trillion",
    "Radiant",
    "Baguette"
  ]);
  const [parametresDevis, setParametresDevis] = useState({
    prixFonte: {},
    prixImpressionCire: {},
    prixImpressionResine: {},
    prixLivraison: {}
  });
  const [tauxHoraires, setTauxHoraires] = useState({
    administratif: 0,
    bijouterie: 0,
    cao: 0,
    desertissage: 0,
    design: 0,
    joaillerie: 0,
  });
  const [isOrGrisSelected, setIsOrGrisSelected] = useState(false);

  // Ajoutez cet état pour stocker le numéro de devis
  const [devisNumber, setDevisNumber] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (devisId) {
      setIsEditing(true);
      fetchDevis(devisId);
    } else {
      setIsEditing(false);
      // Réinitialiser le devis si nécessaire pour une nouvelle création
    }
  }, [devisId]);

  const fetchDevis = async (id) => {
    try {
      const devisDoc = await getDoc(doc(db, 'devis', id));
      if (devisDoc.exists()) {
        const devisData = devisDoc.data();
        setDevis(devisData);
        setImages(devisData.images || []); // Ajoutez cette ligne
        setMainImageId(devisData.images?.find(img => img.isMain)?.id || null); // Et celle-ci
        setDevisNumber(devisData.numeroDevis.split('-')[1]);
      } else {
        console.error("Devis non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du devis:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des clients
        const clientsCollection = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsCollection);
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsList);

        // Récupération des paramètres de devis
        const parametresDoc = await getDoc(doc(db, 'parametresDevis', 'default'));
        if (parametresDoc.exists()) {
          const parametresData = parametresDoc.data();
          console.log("Métaux récupérés:", parametresData.prixMetaux);
          setMetaux(Object.entries(parametresData.prixMetaux || {}).map(([nom, prix]) => ({ nom, prix })));
          setParametres(parametresData);
          setStylesGravure(parametresData.stylesGravure || []);
          setDiametresEtCarats(prevDiametres => ({
            ...prevDiametres,
            ...(parametresData.diametresEtCarats || {})
          }));
          if (parametresData.formesPierres && parametresData.formesPierres.length > 0) {
            setFormesPierres(parametresData.formesPierres);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchParametres = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setParametres({
          ...data,
          tauxHoraires: {
            administratif: data.tauxHoraireAdministratif || 0,
            cao: data.tauxHoraireCAO || 0,
            bijouterie: data.tauxHoraireBijouterie || 0,
            joaillerie: data.tauxHoraireJoaillerie || 0,
            desertissage: data.tauxHoraireDesertissage || 0,
            design: data.tauxHoraireDesign || 0,
          },
          prixSertissage: data.prixSertissage || {},
          prixDiamantsRonds: data.prixDiamantsRonds || {},
          coefficientDiamantsRonds: data.coefficientDiamantsRonds || 1.15,
        });
        setParametresDevis({
          prixFonte: data.prixFonte || {},
          prixImpressionCire: data.prixImpressionCire || {},
          prixImpressionResine: data.prixImpressionResine || {},
          prixLivraison: data.prixLivraison || {}
        });
      }
    };

    fetchParametres();
  }, []);

  useEffect(() => {
    if (devis.metal && devis.poidsEstime) {
      const metalSelectionne = metaux.find(m => m.nom === devis.metal);
      if (metalSelectionne) {
        setValeurMetal((metalSelectionne.prix * parseFloat(devis.poidsEstime) / 1000).toFixed(2));
      }
    } else {
      setValeurMetal(0);
    }
  }, [devis.metal, devis.poidsEstime, metaux]);

  useEffect(() => {
    const fetchTauxHoraires = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Données récupérées :", data);
        setTauxHoraires({
          administratif: data.tauxHoraireAdministratif || 0,
          bijouterie: data.tauxHoraireBijouterie || 0,
          cao: data.tauxHoraireCAO || 0,
          desertissage: data.tauxHoraireDesertissage || 0,
          design: data.tauxHoraireDesign || 0,
          joaillerie: data.tauxHoraireJoaillerie || 0,
        });
      } else {
        console.error("Aucun document trouvé !");
      }
    };

    fetchTauxHoraires();
  }, []);

  const updateDevisCalculations = useCallback(() => {
    if (parametres.tauxHoraires) {
      setDevis(prevDevis => calculateDevis(prevDevis, parametres));
    }
  }, [parametres]);

  useEffect(() => {
    updateDevisCalculations();
  }, [
    devis.metal,
    devis.poidsEstime,
    devis.diamants,
    devis.autresPierres,
    devis.composantsFrequents,
    devis.composantsLibres,
    devis.tempsProduction,
    devis.tarifFonte,
    devis.tarifImpressionCire,
    devis.tarifImpressionResine,
    devis.prixLivraison,
    devis.remise,
    devis.options,
    devis.gravure,
    devis.styleGravure,
    updateDevisCalculations
  ]);

  const memoizedCalculateDevis = useMemo(() => {
    return (devis, parametres) => calculateDevis(devis, parametres);
  }, []);

  useEffect(() => {
    const updatedDevis = memoizedCalculateDevis(devis, parametres);
    if (JSON.stringify(updatedDevis) !== JSON.stringify(devis)) {
      setDevis(updatedDevis);
    }
  }, [devis, parametres, memoizedCalculateDevis]);

  const handleInputChange = useCallback((field, value) => {
    setDevis(prevDevis => {
      const newDevis = { ...prevDevis };
      if (field.includes('.')) {
        const [parent, child, grandchild] = field.split('.');
        if (grandchild) {
          newDevis[parent] = {
            ...newDevis[parent],
            [child]: {
              ...newDevis[parent][child],
              [grandchild]: value
            }
          };
        } else {
          newDevis[parent] = {
            ...newDevis[parent],
            [child]: value
          };
        }
      } else {
        newDevis[field] = value;
      }
      return newDevis;
    });
  }, []);

  const handleOptionsChange = useCallback((option, value) => {
    setDevis(prevDevis => {
      const newDevis = { ...prevDevis };
      if (option === 'rhodiage') {
        newDevis.options = { ...newDevis.options, rhodiage: value };
      } else {
        // Gestion des autres options
        newDevis.options = { ...newDevis.options, [option]: value };
      }
      return newDevis;
    });
  }, []);

  const handleDiamantChange = (index, field, value) => {
    setDevis(prevDevis => {
      const newDiamants = [...prevDevis.diamants];
      if (field === 'diamant') {
        newDiamants[index] = value;
      } else {
        newDiamants[index] = { ...newDiamants[index], [field]: value };
      }
      
      // Recalculer prixTotalDiamants
      const diamant = newDiamants[index];
      if (diamant.fourniPar === 'Client') {
        diamant.prixTotalDiamants = 0;
      } else {
        const prixUnitaire = parseFloat(diamant.prixUnitaire) || 0;
        const quantite = parseInt(diamant.qte) || 0;
        diamant.prixTotalDiamants = prixUnitaire * quantite;
      }

      return { ...prevDevis, diamants: newDiamants };
    });
  };

  const handleAutresPierresChange = (index, updatedPierre) => {
    setDevis(prevDevis => {
      const newAutresPierres = [...prevDevis.autresPierres];
      newAutresPierres[index] = updatedPierre;
      return { ...prevDevis, autresPierres: newAutresPierres };
    });
  };

  const handleAddDiamant = useCallback(() => {
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, {
        taille: '',
        qte: 0, // Changé de 1 à 0
        fourniPar: 'TGN 409',
        sertissage: '',
        carat: 0,
        prixUnitaire: 0,
        prixTotal: 0,
        prixSertissage: 0,
        coutSertissageUnitaire: 0
      }]
    }));
  }, []);

  const handleRemoveDiamant = (index) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.filter((_, i) => i !== index)
    }));
  };


  const handleAddAutrePierre = useCallback((e) => {
    if (e) e.preventDefault();
    setDevis(prev => ({
      ...prev,
      autresPierres: [...prev.autresPierres, { 
        forme: '', 
        type: '', 
        taille: '', 
        qte: 1, 
        fourniPar: 'TGN 409', 
        sertissage: '', 
        prix: 0, 
        prixTotal: 0, 
        prixSertissage: 0 
      }]
    }));
  }, []);

  const handleRemoveAutrePierre = (index) => {
    setDevis(prev => ({
      ...prev,
      autresPierres: prev.autresPierres.filter((_, i) => i !== index)
    }));
  };

  const calculerPrixDiamants = useCallback(() => {
    const total = devis.diamants.reduce((acc, diamant) => {
      const prixTotal = parseFloat(diamant.prixTotalDiamants) || 0;
      return acc + prixTotal;
    }, 0);
    return isNaN(total) ? 0 : total;
  }, [devis.diamants]);

  const calculerPrixSertissage = useCallback(() => {
    const total = devis.diamants.reduce((acc, diamant) => acc + diamant.prixSertissage, 0);
    return total;
  }, [devis.diamants]);

  const calculerPrixAutresPierres = useCallback(() => {
    const total = devis.autresPierres.reduce((acc, pierre) => acc + pierre.prixTotal, 0);
    return total;
  }, [devis.autresPierres]);

  const calculerPrixSertissageAutresPierres = useCallback(() => {
    const total = devis.autresPierres.reduce((acc, pierre) => acc + pierre.prixSertissage, 0);
    return total;
  }, [devis.autresPierres]);

  useEffect(() => {
    calculerPrixDiamants();
    calculerPrixSertissage();
    calculerPrixAutresPierres();
    calculerPrixSertissageAutresPierres();
  }, [calculerPrixDiamants, calculerPrixSertissage, calculerPrixAutresPierres, calculerPrixSertissageAutresPierres]);

  const uploadImage = useCallback(async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `devis_images/${uuidv4()}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newImages = [...images];
    for (const file of acceptedFiles) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        const newImage = {
          id: uuidv4(),
          url: imageUrl,
          isMain: newImages.length === 0 && !mainImageId // Modifié ici
        };
        newImages.push(newImage);
        if (!mainImageId) {
          setMainImageId(newImage.id);
        }
      }
    }
    setImages(newImages);
    setDevis(prevDevis => ({ ...prevDevis, images: newImages }));
  }, [images, uploadImage, mainImageId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = useCallback((id) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
    setDevis(prevDevis => ({
      ...prevDevis,
      images: prevDevis.images.filter(img => img.id !== id)
    }));
  }, []);

  const setMainImage = useCallback((id) => {
    setImages(prevImages => prevImages.map(img => ({
      ...img,
      isMain: img.id === id
    })));
    setMainImageId(id);
    setDevis(prevDevis => ({
      ...prevDevis,
      images: prevDevis.images.map(img => ({
        ...img,
        isMain: img.id === id
      }))
    }));
  }, []);

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        onDrop([blob]);
      }
    }
  };

  const handleNouveauClientAdded = (newClient) => {
    setClients(prevClients => [...prevClients, newClient]);
    handleInputChange('client', newClient.id);
    setShowNouveauClientPopup(false);
  };

  const validateDevis = useCallback(() => {
    const requiredFields = ['client', 'titreDevis', 'categorie', 'metal'];
    for (let field of requiredFields) {
      if (!devis[field]) {
        throw new Error(`Le champ ${field} est requis.`);
      }
    }
  }, [devis]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      validateDevis();
      
      const currentUser = auth.currentUser;
      
      const calculatedDevis = calculateDevis(devis, parametres);
      
      const devisToSave = {
        ...calculatedDevis,
        updatedAt: new Date().toISOString(),
        images: images.map(img => ({ 
          id: img.id, 
          url: img.url, 
          isMain: img.id === mainImageId 
        })),
      };

      if (isEditing) {
        // Mise à jour d'un devis existant
        await updateDoc(doc(db, 'devis', devisId), devisToSave);
        console.log("Devis mis à jour avec succès");
        setAlertMessage('Devis mis à jour avec succès !');
      } else {
        // Création d'un nouveau devis
        const newDevisNumber = await getNextDevisNumber();
        setDevisNumber(newDevisNumber);
        
        const newDevis = {
          ...devisToSave,
          numeroDevis: `TGN-${newDevisNumber.toString().padStart(5, '0')}`,
          createdBy: currentUser ? currentUser.uid : null,
          createdAt: new Date().toISOString(),
          status: 'brouillon',
          version: 1,
          currency: 'EUR',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        const docRef = await addDoc(collection(db, 'devis'), newDevis);
        console.log("Document written with ID: ", docRef.id);
        setAlertMessage('Devis créé avec succès !');
      }

      setAlertType('success');
      setShowAlert(true);
      
      // Redirection vers la page des devis
      navigate('/devis');
      
    } catch (error) {
      console.error("Erreur détaillée lors de la création/modification du devis :", error);
      setAlertMessage(`Une erreur est survenue : ${error.message}`);
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  }, [devis, parametres, images, validateDevis, mainImageId, isEditing, devisId, navigate]);

  const tabs = [
    { id: 'informations', label: 'Informations et détails' },
    { id: 'options', label: 'Gravure et Finition' },
    { id: 'temps', label: 'Temps de production' },
    { id: 'diamants', label: 'Diamants et pierres' },
    { id: 'tarifs', label: "Impression 3D et Fonte" }, // Modifié ici
    { id: 'composants', label: 'Composants et autres' },
    { id: 'images', label: 'Images' },
    { id: 'resume', label: 'Résumé du devis' },
  ];

  const handleClientChange = (clientId) => {
    if (clientId === 'nouveau') {
      setShowNouveauClientPopup(true);
    } else {
      setDevis(prevDevis => ({ ...prevDevis, client: clientId }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Ajouter cet useEffect pour sauvegarder l'onglet actif dans localStorage
  useEffect(() => {
    localStorage.setItem('activeDevisTab', activeTab);
  }, [activeTab]);

  const handleMetalChange = useCallback((metalValue) => {
    setDevis(prevDevis => {
      const newDevis = { ...prevDevis, metal: metalValue };
      const isOrGris = metalValue.toLowerCase().includes('or gris');
      setIsOrGrisSelected(isOrGris); // Utilisation de setIsOrGrisSelected
      if (isOrGris) {
        // Suggérer le rhodiage pour l'or gris, mais ne pas le forcer
        newDevis.options = { ...newDevis.options, rhodiage: true };
      } else {
        // Désélectionner le rhodiage pour les autres métaux
        newDevis.options = { ...newDevis.options, rhodiage: false };
      }
      return newDevis;
    });
  }, []);

  const handleRemiseChange = useCallback((type, valeur) => {
    setDevis(prevDevis => ({
      ...prevDevis,
      remise: { type, valeur: parseFloat(valeur) }
    }));
  }, []);

  // Ajoutez cette fonction dans le composant PageCreerDevisV2
  const handleComposantChange = (index, field, value, type) => {
    setDevis(prevDevis => {
      const newComposants = [...prevDevis[type]];
      if (field === 'composant') {
        newComposants[index] = value;
      } else {
        newComposants[index] = { ...newComposants[index], [field]: value };
      }
      
      // Recalculer le prix total du composant si nécessaire
      if (field === 'prix' || field === 'quantite') {
        newComposants[index].prixTotal = (parseFloat(newComposants[index].prix) || 0) * (parseInt(newComposants[index].quantite) || 1);
      }
      
      return { ...prevDevis, [type]: newComposants };
    });
  };

  const renderNavButtons = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const isFirstTab = currentIndex === 0;
    const isLastTab = currentIndex === tabs.length - 1;

    return (
      <div className="flex justify-between mt-6">
        <button
          type="button" // Changé de 'submit' à 'button'
          onClick={() => handleTabChange(tabs[currentIndex - 1].id)}
          className={`px-4 py-2 rounded-md ${
            isFirstTab
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : darkMode
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
          disabled={isFirstTab}
        >
          <ChevronLeftIcon className="w-5 h-5 inline-block mr-2" />
          Précédent
        </button>
        {!isLastTab && (
          <button
            type="button" // Changé de 'submit' à 'button'
            onClick={() => handleTabChange(tabs[currentIndex + 1].id)}
            className={`px-4 py-2 rounded-md ${
              darkMode
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            Suivant
            <ChevronRightIcon className="w-5 h-5 inline-block ml-2" />
          </button>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informations':
        return (
          <InformationsEtDetails
            devis={devis}
            handleInputChange={handleInputChange}
            handleClientChange={handleClientChange}
            setShowNouveauClientPopup={setShowNouveauClientPopup}
            darkMode={darkMode}
            clients={clients}
            metaux={metaux}
            valeurMetal={valeurMetal}
            onMetalChange={handleMetalChange}
            isOrGrisSelected={isOrGrisSelected} // Passer isOrGrisSelected comme prop
          />
        );
      case 'tarifs':
        return (
          <TarifsImpression
            devis={devis}
            handleInputChange={handleInputChange}
            darkMode={darkMode}
            parametres={parametresDevis}
          />
        );
      case 'diamants':
        return (
          <DiamantsPierres
            devis={devis}
            handleDiamantsChange={handleDiamantChange}
            handleAutresPierresChange={handleAutresPierresChange}
            handleAddDiamant={handleAddDiamant}
            handleRemoveDiamant={handleRemoveDiamant}
            handleAddAutrePierre={handleAddAutrePierre}
            handleRemoveAutrePierre={handleRemoveAutrePierre}
            calculerPrixDiamants={calculerPrixDiamants}
            calculerPrixSertissage={calculerPrixSertissage}
            calculerPrixAutresPierres={calculerPrixAutresPierres}
            calculerPrixSertissageAutresPierres={calculerPrixSertissageAutresPierres}
            darkMode={darkMode}
            diametresEtCarats={diametresEtCarats}
            formesPierres={formesPierres}
            parametres={parametres}
          />
        );
      case 'temps':
        return (
          <TempsProduction
            devis={devis}
            handleInputChange={handleInputChange}
            darkMode={darkMode}
            tauxHoraires={tauxHoraires}
          />
        );
      case 'options':
        return (
          <OptionsProduit
            devis={devis}
            handleInputChange={handleInputChange}
            handleOptionsChange={handleOptionsChange}
            darkMode={darkMode}
            parametres={parametres}
            stylesGravure={stylesGravure}  // Passez stylesGravure ici
            defaultRhodiage={isOrGrisSelected}
          />
        );
      case 'composants':
        return (
          <ComposantsEtAutres
            devis={devis}
            handleInputChange={handleInputChange}
            handleComposantChange={handleComposantChange} // Ajoutez cette ligne
            darkMode={darkMode}
          />
        );
      case 'images':
        return (
          <ImagesDevis
            images={images}
            mainImageId={mainImageId}
            onDrop={onDrop}
            removeImage={removeImage}
            setMainImage={setMainImage}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            handlePaste={handlePaste}
            darkMode={darkMode}
          />
        );
      case 'resume':
        return clients.length > 0 ? (
          <ResumeDevis 
            devis={devis}
            darkMode={darkMode} 
            clients={clients} 
            parametres={parametres}
            handleInputChange={handleInputChange}
            tauxHoraires={tauxHoraires}
            handleRemiseChange={handleRemiseChange}
            handleSubmit={handleSubmit}
            isEditing={isEditing}  // Passez l'état d'édition au composant ResumeDevis
          />
        ) : (
          <div>Chargement des données client...</div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("Paramètres mis à jour:", parametres);
  }, [parametres]);

  useEffect(() => {
    const fetchLastDevisNumber = async () => {
      const lastNumber = await getLastDevisNumber(); // Vous devrez implémenter cette fonction dans firebase.js
      setDevisNumber(lastNumber + 1);
    };
    fetchLastDevisNumber();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-8`}>
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        {isEditing ? `Modifier le devis n° ${devis.numeroDevis}` : `Nouveau devis n° TGN-${(devisNumber || 1).toString().padStart(5, '0')}`}
      </h1>
      <div className="mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 ${
                activeTab === tab.id
                  ? 'border-b-2 border-teal-500 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        {renderTabContent()}
        {renderNavButtons()}
      </div>
      {showNouveauClientPopup && (
        <NouveauClientPopup
          isOpen={showNouveauClientPopup}
          onClose={() => setShowNouveauClientPopup(false)}
          darkMode={darkMode}
          onClientAdded={handleNouveauClientAdded}
        />
      )}
      {showAlert && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          alertType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <p>{alertMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PageCreerDevisV2;