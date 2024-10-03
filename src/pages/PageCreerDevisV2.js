import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import NouveauClientPopup from '../components/clients/NouveauClientPopup';
import DiamantsPierres from '../components/devis/DiamantsPierres';

// Importation des composants
import InformationsEtDetails from '../components/devis/InformationsEtDetails';
import OptionsProduit from '../components/devis/OptionsProduit';
import TempsProduction from '../components/devis/TempsProduction';
import TarifsImpression from '../components/devis/TarifsImpression';
import ImagesDevis from '../components/devis/ImagesDevis';

const PageCreerDevisV2 = () => {
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
      qte: 1,
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
      qte: 1,
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
      polissage: { heures: 0, minutes: 0 },
      dessertissage: { heures: 0, minutes: 0 },
      design: { heures: 0, minutes: 0 },
    },
    tarifFonte: '',
    tarifImpressionCire: '',
    tarifImpressionResine: '',
    typeLivraison: '',
    prixLivraison: 0
  });


  const [clients, setClients] = useState([]);
  const [metaux, setMetaux] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImageId, setMainImageId] = useState(null);

  const [valeurMetal, setValeurMetal] = useState(0);
  const [parametres, setParametres] = useState({
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
    cao: 0,
    bijouterie: 0,
    polissage: 0,
    dessertissage: 0,
    design: 0,
  });
  const [isOrGrisSelected, setIsOrGrisSelected] = useState(false);

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
        setTauxHoraires({
          administratif: data.tauxHoraireAdministratif || 0,
          cao: data.tauxHoraireCAO || 0,
          bijouterie: data.tauxHoraireBijouterie || 0,
          polissage: data.tauxHoraireBijouterie || 0, // Utilise le même taux que bijouterie
          dessertissage: data.tauxHoraireDesertissage || 0,
          design: data.tauxHoraireDesign || 0,
        });
      }
    };

    fetchTauxHoraires();
  }, []);

  const handleInputChange = (field, value) => {
    setDevis(prevDevis => {
      const newDevis = { ...prevDevis };
      const fields = field.split('.');
      let current = newDevis;
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      return newDevis;
    });
  };

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

  const handleAddDiamant = useCallback((e) => {
    if (e) e.preventDefault();
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, {
        taille: '',
        qte: 1,
        fourniPar: 'TGN 409',
        sertissage: '',
        carat: 0,
        prixUnitaire: 0,
        prixTotalDiamants: 0,
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

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImages];
      if (!mainImageId && updatedImages.length > 0) {
        setMainImageId(updatedImages[0].id);
      }
      return updatedImages;
    });
  }, [mainImageId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = (id) => {
    setImages(prevImages => prevImages.filter(image => image.id !== id));
    if (mainImageId === id) {
      setMainImageId(images.length > 1 ? images[0].id : null);
    }
  };

  const setMainImage = (imageId) => {
    console.log("Changement d'image principale. Nouvel ID:", imageId);
    setMainImageId(imageId);
  };

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

  const validateDevis = () => {
    const requiredFields = ['client', 'titreDevis', 'categorie', 'metal'];
    for (let field of requiredFields) {
      if (!devis[field]) {
        throw new Error(`Le champ ${field} est requis.`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateDevis();
      // Upload des images
      const imageUrls = await Promise.all(images.map(async (image) => {
        const imageRef = ref(storage, `devis_images/${image.id}`);
        await uploadBytes(imageRef, image.file);
        return getDownloadURL(imageRef);
      }));
      
      // Créer le devis avec les URLs des images
      const newDevis = {
        ...devis,
        images: imageUrls,
        imageprincipale: imageUrls[mainImageId] // L'image principale
      };

      console.log("Devis  envoyer:", newDevis); // Ajoutez cette ligne pour déboguer

      // Ajouter le devis à Firestore
      const docRef = await addDoc(collection(db, 'devis'), newDevis);
      console.log("Document written with ID: ", docRef.id);
      alert('Devis créé avec succès !');
      // Réinitialiser le formulaire ou rediriger
    } catch (error) {
      console.error("Erreur détaillée lors de la création du devis :", error);
      alert(`Une erreur est survenue lors de la création du devis : ${error.message}`);
    }
  };

  const tabs = [
    { id: 'informations', label: 'Informations et détails' },
    { id: 'tarifs', label: "Tarifs d'impression" },
    { id: 'diamants', label: 'Diamants et pierres' },
    { id: 'temps', label: 'Temps de production' },
    { id: 'options', label: 'Gravure et Finition' },
    { id: 'images', label: 'Images' },
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
      case 'images':
        return (
          <ImagesDevis
            images={images}
            onDrop={onDrop}
            removeImage={removeImage}
            setMainImage={setMainImage}  // Utilisez setMainImage ici
            mainImageId={mainImageId}
            darkMode={darkMode}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            handlePaste={handlePaste}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-8`}>
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau devis (V2)</h1>
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
      <form onSubmit={(e) => e.preventDefault()}>
        {renderTabContent()}
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors mt-4"
        >
          Créer le devis
        </button>
      </form>
      {showNouveauClientPopup && (
        <NouveauClientPopup
          isOpen={showNouveauClientPopup}
          onClose={() => setShowNouveauClientPopup(false)}
          darkMode={darkMode}
          onClientAdded={handleNouveauClientAdded}
        />
      )}
    </div>
  );
};


export default PageCreerDevisV2;