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
  const [activeTab, setActiveTab] = useState('informations');
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
    diamants: [],
    autresPierres: [],
    tempsProduction: {},
    tarifFonte: '',
    tarifImpressionCire: '',
    tarifImpressionResine: '',
    typeLivraison: '',
    prixLivraison: 0
  });


  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metaux, setMetaux] = useState([]);
  const [sousCategories, setSousCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImageId, setMainImageId] = useState(null);

  const [valeurMetal, setValeurMetal] = useState(0);
  const [totalPrixDiamants, setTotalPrixDiamants] = useState(0);
  const [totalPrixSertissage, setTotalPrixSertissage] = useState(0);
  const [totalPrixAutresPierres, setTotalPrixAutresPierres] = useState(0);
  const [totalPrixSertissageAutresPierres, setTotalPrixSertissageAutresPierres] = useState(0);
  const [parametres, setParametres] = useState({
    prixSertissage: {},
    prixDiamantsRonds: {},
    coefficientDiamantsRonds: 1.15,
  });
  const [stylesGravure, setStylesGravure] = useState([]);
  const [diametresEtCarats, setDiametresEtCarats] = useState({});
  const [formesPierres, setFormesPierres] = useState([]);
  const [typesPierres, setTypesPierres] = useState([]);

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
          setDiametresEtCarats(parametresData.diametresEtCarats || {});
          setFormesPierres(parametresData.formesPierres || []);
          setTypesPierres(parametresData.typesPierres || []);
          setCategories(parametresData.categories || []);
          setSousCategories(parametresData.sousCategories || []);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (devis.categorie && categories[devis.categorie]) {
      setSousCategories(categories[devis.categorie]);
    } else {
      setSousCategories([]);
    }
  }, [devis.categorie, categories]);

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

  const handleInputChange = (field, value) => {
    setDevis(prevDevis => {
      const newDevis = { ...prevDevis, [field]: value };
      
      if (field === 'categorie') {
        newDevis.sousCategorie = '';
        setSousCategories(categories[value] || []);
      }
      
      if (field === 'metal' || field === 'poidsEstime') {
        const metalSelectionne = metaux.find(m => m.nom === newDevis.metal);
        if (metalSelectionne && newDevis.poidsEstime) {
          setValeurMetal((metalSelectionne.prix * parseFloat(newDevis.poidsEstime) / 1000).toFixed(2));
        } else {
          setValeurMetal(0);
        }
      }
      
      return newDevis;
    });
  };

  const handleOptionsChange = (option, value) => {
    setDevis(prevDevis => ({
      ...prevDevis,
      options: {
        ...prevDevis.options,
        [option]: value
      }
    }));
  };

  const handleDiamantsChange = (index, field, value) => {
    setDevis(prevDevis => {
      const newDiamants = [...prevDevis.diamants];
      newDiamants[index] = { ...newDiamants[index], [field]: value };
      
      // Mise à jour automatique du carat et du prix
      if (field === 'taille') {
        newDiamants[index].carat = diametresEtCarats[value] || 0;
        newDiamants[index].prixUnitaire = parametres.prixDiamantsRonds[value] || 0;
      }

      // Calcul du prix total
      newDiamants[index].prixTotal = newDiamants[index].fourniPar === 'Client' ? 0 :
        newDiamants[index].carat * newDiamants[index].prixUnitaire * newDiamants[index].qte * parametres.coefficientDiamantsRonds;

      // Mise à jour du prix de sertissage
      if (field === 'sertissage' || field === 'qte') {
        newDiamants[index].prixSertissage = (parametres.prixSertissage[newDiamants[index].sertissage] || 0) * newDiamants[index].qte;
      }

      return { ...prevDevis, diamants: newDiamants };
    });
  };

  const handleAutresPierresChange = (index, field, value) => {
    setDevis(prevDevis => {
      const newAutresPierres = [...prevDevis.autresPierres];
      newAutresPierres[index] = { ...newAutresPierres[index], [field]: value };
      
      // Calcul du prix total
      if (field === 'prix' || field === 'qte') {
        newAutresPierres[index].prixTotal = newAutresPierres[index].fourniPar === 'Client' ? 0 :
          newAutresPierres[index].prix * newAutresPierres[index].qte;
      }

      // Mise à jour du prix de sertissage
      if (field === 'sertissage' || field === 'qte') {
        newAutresPierres[index].prixSertissage = (parametres.prixSertissage[newAutresPierres[index].sertissage] || 0) * newAutresPierres[index].qte;
      }

      return { ...prevDevis, autresPierres: newAutresPierres };
    });
  };

  const handleAddDiamant = () => {
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, { 
        taille: Object.keys(diametresEtCarats)[0] || '', 
        qte: 1, 
        fourniPar: 'TGN 409', 
        sertissage: '', 
        carat: diametresEtCarats[Object.keys(diametresEtCarats)[0]] || 0,
        prixUnitaire: 0, 
        prixTotal: 0, 
        prixSertissage: 0 
      }]
    }));
  };

  const handleRemoveDiamant = (index) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.filter((_, i) => i !== index)
    }));
  };


  const handleAddAutrePierre = () => {
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
  };

  const handleRemoveAutrePierre = (index) => {
    setDevis(prev => ({
      ...prev,
      autresPierres: prev.autresPierres.filter((_, i) => i !== index)
    }));
  };

  const calculerPrixDiamants = useCallback(() => {
    const total = devis.diamants.reduce((acc, diamant) => acc + diamant.prixTotal, 0);
    setTotalPrixDiamants(total);
    return total;
  }, [devis.diamants]);

  const calculerPrixSertissage = useCallback(() => {
    const total = devis.diamants.reduce((acc, diamant) => acc + diamant.prixSertissage, 0);
    setTotalPrixSertissage(total);
    return total;
  }, [devis.diamants]);

  const calculerPrixAutresPierres = useCallback(() => {
    const total = devis.autresPierres.reduce((acc, pierre) => acc + pierre.prixTotal, 0);
    setTotalPrixAutresPierres(total);
    return total;
  }, [devis.autresPierres]);

  const calculerPrixSertissageAutresPierres = useCallback(() => {
    const total = devis.autresPierres.reduce((acc, pierre) => acc + pierre.prixSertissage, 0);
    setTotalPrixSertissageAutresPierres(total);
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

  const setAsMainImage = (id) => {
    setMainImageId(id);
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

      console.log("Devis à envoyer:", newDevis); // Ajoutez cette ligne pour déboguer

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
    { id: 'options', label: 'Options du produit' },
    { id: 'diamants', label: 'Diamants et pierres' },
    { id: 'temps', label: 'Temps de production' },
    { id: 'tarifs', label: "Tarifs d'impression" },
    { id: 'images', label: 'Images' },
  ];

  const handleClientChange = (clientId) => {
    if (clientId === 'nouveau') {
      setShowNouveauClientPopup(true);
    } else {
      setDevis(prevDevis => ({ ...prevDevis, client: clientId }));
    }
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
            categories={Object.keys(categories)}
            sousCategories={sousCategories}
            metaux={metaux}
            valeurMetal={valeurMetal}
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
          />
        );
      case 'diamants':
        return (
          <DiamantsPierres
            devis={devis}
            setDevis={setDevis}
            handleDiamantsChange={handleDiamantsChange}
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
            typesPierres={typesPierres}
            parametres={parametres}
          />
        );
      case 'temps':
        return (
          <TempsProduction
            devis={devis}
            handleInputChange={handleInputChange}
            darkMode={darkMode}
          />
        );
      case 'tarifs':
        return (
          <TarifsImpression
            devis={devis}
            handleInputChange={handleInputChange}
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
            setAsMainImage={setAsMainImage}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            handlePaste={handlePaste}
            darkMode={darkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
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
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {renderTabContent()}
        <button
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