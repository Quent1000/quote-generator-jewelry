import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import NouveauClientPopup from '../components/clients/NouveauClientPopup';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon, ArrowUpTrayIcon, StarIcon } from '@heroicons/react/24/outline';
import { storage } from '../firebase'; // Assurez-vous d'avoir configuré Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Ajoutez cette importation en haut du fichier
import InformationsGenerales from '../components/devis/InformationsGenerales';

const CustomSelect = ({ options, value, onChange, className, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`${className} cursor-pointer flex justify-between items-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || "Sélectionnez un métal"}</span>
        {value && options.find(opt => opt.value === value)?.price && (
          <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
            {options.find(opt => opt.value === value).price}€/g
          </span>
        )}
      </div>
      {isOpen && (
        <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer flex justify-between ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.price && <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{option.price}€/g</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PageCreerDevis = () => {
  const { darkMode } = useAppContext();
  const [clients, setClients] = useState([]);
  const [showNouveauClientPopup, setShowNouveauClientPopup] = useState(false);
  const [devis, setDevis] = useState({
    client: '',
    categorie: '',
    sousCategorie: '',
    metal: '',
    titreDevis: '',
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
    commentaireInterne: '',
    diamants: [{ taille: '', qte: 0, fourniPar: 'TGN 409', sertissage: '', prixSertissage: 0 }],
    autresPierres: [{ forme: '', dimension: '', type: '', prix: 0, carat: 0, fourniPar: 'TGN 409', qte: 0, sertissage: '' }],
    images: [],
    tempsAdministratif: { heures: 0, minutes: 0 },
    tempsCAO: { heures: 0, minutes: 0 },
    tempsRepare: { heures: 0, minutes: 0 },
    tempsPolissage: { heures: 0, minutes: 0 },
    tempsDessertissage: { heures: 0, minutes: 0 },
    tempsDesign: { heures: 0, minutes: 0 },
    tarifFonte: '',
    tarifImpressionCire: '',
    tarifImpressionResine: '',
    couts: {
      production: { sertissage: 0, cao: 0, bijouterie: 0 },
      impression: { resine: 0, cire: 0, fonte: 0 }
    }
  });

  const [stylesGravure, setStylesGravure] = useState([]);
  const [typesSertissage, setTypesSertissage] = useState([]);
  const [parametres, setParametres] = useState({
    prixSertissage: {},
    prixDiamantsRonds: {},
    prixPoincons: {
      poinconMaitre: {},
      poinconTitre: {},
      marque: {}
    },
    coefficientDiamantsRonds: 1.15,
    prixFonte: {},
    prixImpressionCire: {},
    prixImpressionResine: {},
    prixRhodiage: 0,
  });

  const [tauxHoraires, setTauxHoraires] = useState({
    administratif: 0,
    cao: 0,
    bijouterie: 0,
    polissage: 0,
    dessertissage: 0,
    design: 0,
  });

  const metaux = [
    "Or Jaune 3N",
    "Or Rouge 5N",
    "Or Rose 4N",
    "Or Gris",
    "Or Gris Palladié",
    "Argent 925",
    "Or jaune 24K",
    "Or jaune 2N",
    "Platine" // Ajout du platine à la liste
  ];

  const formesPierres = [
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
  ];

  const typesPierres = [
    "Diamant",
    "Saphir",
    "Rubis",
    "Émeraude",
    "Améthyste",
    "Topaze",
    "Péridot",
    "Citrine",
    "Aigue-marine",
    "Grenat",
    "Tourmaline",
    "Tanzanite",
    "Opale",
    "Quartz rose",
    "Lapis-lazuli"
  ];

  const [images, setImages] = useState([]);
  const [mainImageId, setMainImageId] = useState(null);

  // Modifiez ces constantes pour inclure plus d'options si nécessaire
  const heuresOptions = Array.from({length: 25}, (_, i) => i); // 0h à 24h
  const minutesOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const [prixMetaux, setPrixMetaux] = useState({});

  const [valeurMetal, setValeurMetal] = useState(0);

  const [totalPrixDiamants, setTotalPrixDiamants] = useState(0);
  const [totalPrixSertissage, setTotalPrixSertissage] = useState(0); // Nouvel état pour le total du sertissage

  const calculerTotalPrixDiamants = useCallback(() => {
    const total = devis.diamants.reduce((sum, diamant) => sum + (diamant.prixTotal || 0), 0);
    setTotalPrixDiamants(total);
  }, [devis.diamants]);

  const calculerTotalPrixSertissage = useCallback(() => {
    const total = devis.diamants.reduce((sum, diamant) => sum + (diamant.prixSertissage || 0), 0);
    setTotalPrixSertissage(total);
  }, [devis.diamants]);

  useEffect(() => {
    calculerTotalPrixDiamants();
    calculerTotalPrixSertissage();
  }, [calculerTotalPrixDiamants, calculerTotalPrixSertissage]);

  useEffect(() => {
    console.log("Images actuelles:", images);
    console.log("Index de l'image principale:", mainImageId);
  }, [images, mainImageId]);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Fichiers déposés:", acceptedFiles);
    const newImages = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file)
    }));
    console.log("Nouvelles images créées:", newImages);
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImages];
      console.log("Images mises à jour:", updatedImages);
      if (!mainImageId && updatedImages.length > 0) {
        setMainImageId(updatedImages[0].id);
      }
      return updatedImages;
    });
  }, [mainImageId]);

  const handlePaste = useCallback((event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    const pastedFiles = [];
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        pastedFiles.push(blob);
      }
    }
    if (pastedFiles.length > 0) {
      onDrop(pastedFiles);
    }
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true
  });

  const removeImage = (id) => {
    console.log("Suppression de l'image à l'index:", id);
    setImages(prevImages => {
      const newImages = prevImages.filter(img => img.id !== id);
      console.log("Images après suppression:", newImages);
      if (id === mainImageId) {
        console.log("L'image principale a été supprimée, mise à jour de l'index principal");
        setMainImageId(newImages.length > 0 ? newImages[0].id : null);
      }
      return newImages;
    });
  };

  const setAsMainImage = (id) => {
    console.log("Changement d'image principale. Nouvel index:", id);
    setMainImageId(id);
  };

  useEffect(() => {
    return () => images.forEach(image => URL.revokeObjectURL(image.preview));
  }, [images]);

  useEffect(() => {
    const fetchStylesGravure = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStylesGravure(data.prixGravure || {});
      }
    };

    fetchStylesGravure();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      const clientsSnapshot = await getDocs(collection(db, 'clients'));
      const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(clientsList);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchParametres = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setParametres({
          prixSertissage: data.prixSertissage || {},
          prixDiamantsRonds: data.prixDiamantsRonds || {},
          prixPoincons: data.prixPoincons || {
            poinconMaitre: {},
            poinconTitre: {},
            marque: {}
          },
          coefficientDiamantsRonds: data.coefficientDiamantsRonds || 1.15,
          prixFonte: data.prixFonte || {},
          prixImpressionCire: data.prixImpressionCire || {},
          prixImpressionResine: data.prixImpressionResine || {},
          prixRhodiage: data.prixRhodiage || 0,
        });
        setTypesSertissage(Object.keys(data.prixSertissage || {}));
      }
    };

    fetchParametres();
  }, []);

  useEffect(() => {
    const fetchPrixMetaux = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPrixMetaux(data.prixMetaux || {});
      }
    };

    fetchPrixMetaux();
  }, []);

  useEffect(() => {
    const poids = parseFloat(devis.poidsEstime) || 0;
    const prixMetal = prixMetaux[devis.metal] ? prixMetaux[devis.metal] / 1000 : 0;
    setValeurMetal((poids * prixMetal).toFixed(2));
  }, [devis.poidsEstime, devis.metal, prixMetaux]);

  const metalOptions = metaux.map(metal => ({
    value: metal,
    label: metal,
    price: prixMetaux[metal] ? (prixMetaux[metal] / 1000).toFixed(2) : null
  }));

  const handleInputChange = (field, value) => {
    setDevis(prev => {
      const newDevis = { ...prev, [field]: value };

      // Si le champ modifié est le métal
      if (field === 'metal') {
        // Si le nouveau métal est "Or Gris", cocher le rhodiage
        if (value === 'Or Gris') {
          newDevis.options = { ...newDevis.options, rhodiage: true };
        } else {
          // Sinon, décocher le rhodiage
          newDevis.options = { ...newDevis.options, rhodiage: false };
        }
      }

      // Calculer la valeur du métal si le poids estimé ou le métal change
      if (field === 'poidsEstime' || field === 'metal') {
        const prixMetal = prixMetaux[newDevis.metal] || 0;
        const poidsEstime = parseFloat(newDevis.poidsEstime) || 0;
        const nouvelleValeurMetal = (prixMetal * poidsEstime) / 1000;
        setValeurMetal(nouvelleValeurMetal);
      }

      return newDevis;
    });
  };

  const handleOptionsChange = (option, value) => {
    setDevis(prev => ({
      ...prev,
      options: { ...prev.options, [option]: value }
    }));
  };

  const handleCheckboxChange = (option) => {
    setDevis(prev => ({
      ...prev,
      options: { ...prev.options, [option]: !prev.options[option] }
    }));
  };

  const handleDiamantsChange = (index, field, value) => {
    const newDiamants = [...devis.diamants];
    newDiamants[index][field] = value;
    
    if (field === 'taille' || field === 'qte' || field === 'fourniPar' || field === 'sertissage') {
      const tailleMm = parseFloat(newDiamants[index].taille);
      const carat = diametresEtCarats[newDiamants[index].taille] || 0;
      newDiamants[index].carat = carat;
      
      // Trouver la catégorie de prix correspondante
      const prixCategorie = Object.entries(parametres.prixDiamantsRonds).find(([categorie]) => {
        const [min, max] = categorie.split(' - ').map(parseFloat);
        return tailleMm >= min && tailleMm <= max;
      });

      if (prixCategorie) {
        newDiamants[index].prixCarat = prixCategorie[1];
      } else {
        newDiamants[index].prixCarat = 0;
      }

      // Calculer le prix total pour ce diamant
      if (newDiamants[index].fourniPar === 'Client') {
        newDiamants[index].prixTotal = 0;
      } else if (newDiamants[index].carat && newDiamants[index].prixCarat && newDiamants[index].qte) {
        newDiamants[index].prixTotal = newDiamants[index].carat * newDiamants[index].prixCarat * newDiamants[index].qte;
      } else {
        newDiamants[index].prixTotal = 0;
      }

      // Réinitialiser le coût de sertissage unitaire si le type de sertissage change
      if (field === 'sertissage') {
        newDiamants[index].coutSertissageUnitaire = parametres.prixSertissage[value] || 0;
      }

      // Calculer le prix du sertissage
      const coutSertissageUnitaire = newDiamants[index].coutSertissageUnitaire || 
        (newDiamants[index].sertissage ? parametres.prixSertissage[newDiamants[index].sertissage] || 0 : 0);
      newDiamants[index].prixSertissage = coutSertissageUnitaire * newDiamants[index].qte;
    } else if (field === 'coutSertissageUnitaire') {
      // Si le coût de sertissage unitaire est modifié manuellement
      newDiamants[index].prixSertissage = value * newDiamants[index].qte;
    }

    setDevis(prev => ({ ...prev, diamants: newDiamants }));
    calculerTotalPrixDiamants();
    calculerTotalPrixSertissage();
  };

  const handleAutresPierresChange = (index, field, value) => {
    const newAutresPierres = [...devis.autresPierres];
    if (field === 'prix' || field === 'carat') {
      // Permet uniquement les chiffres et un seul point décimal
      const regex = /^\d*\.?\d*$/;
      if (regex.test(value) || value === '') {
        newAutresPierres[index][field] = value;
      }
    } else {
      newAutresPierres[index][field] = value;
    }
    setDevis(prev => ({ ...prev, autresPierres: newAutresPierres }));
  };

  const handleAddDiamant = () => {
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, { taille: '', qte: 0, fourniPar: 'TGN 409', sertissage: '', prixSertissage: 0 }]
    }));
  };

  const handleRemoveDiamant = (index) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAutrePierre = (index) => {
    setDevis(prev => ({
      ...prev,
      autresPierres: prev.autresPierres.filter((_, i) => i !== index)
    }));
  };

  const handleAddAutrePierre = () => {
    setDevis(prev => ({
      ...prev,
      autresPierres: [...prev.autresPierres, { forme: '', dimension: '', type: '', prix: 0, carat: 0, fourniPar: 'TGN 409', qte: 0, sertissage: '' }]
    }));
  };

  const handleSubmit = async () => {
    try {
      // Upload des images
      const imageUrls = await Promise.all(images.map(uploadImage));
      
      // Créer le devis avec les URLs des images
      const newDevis = {
        ...devis,
        images: imageUrls,
        imageprincipale: imageUrls[0] // La première image est l'image principale
      };

      // Ajouter le devis à Firestore
      await addDoc(collection(db, 'devis'), newDevis);
      alert('Devis créé avec succès !');
      // Réinitialiser le formulaire ou rediriger
    } catch (error) {
      console.error("Erreur lors de la création du devis :", error);
      alert('Une erreur est survenue lors de la création du devis.');
    }
  };

  const uploadImage = async (image) => {
    const storageRef = ref(storage, `devis_images/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const inputClass = `w-full p-2 rounded-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`;

  const categories = {
    "Bague": ["Alliance", "Bague de fiançailles", "Chevalière", "Solitaire", "Autre"],
    "Bracelet": ["Jonc", "Chaîne", "Manchette", "Tennis", "Autre"],
    "Boucles d'oreilles": ["Créoles", "Puces", "Pendantes", "Chandelier", "Autre"],
    "Pendentif": ["Simple", "Avec chaîne", "Médaillon", "Autre"],
    "Collier": ["Chaîne", "Ras de cou", "Sautoir", "Autre"],
    "Autre": ["Préciser"]
  };

  const handleCategorieChange = (e) => {
    const nouvelleCategorie = e.target.value;
    setDevis(prev => ({
      ...prev,
      categorie: nouvelleCategorie,
      sousCategorie: ''
    }));
  };

  const handleSousCategorieChange = (e) => {
    setDevis(prev => ({
      ...prev,
      sousCategorie: e.target.value
    }));
  };

  const handleClientChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'nouveau') {
      setShowNouveauClientPopup(true);
    } else {
      handleInputChange('client', selectedValue);
    }
  };

  const handleNouveauClientAdded = (newClient) => {
    setClients(prevClients => [...prevClients, newClient]);
    handleInputChange('client', newClient.id);
    setShowNouveauClientPopup(false);
  };

  const diametresEtCarats = {
    "0.5": 0.00025,
    "0.6": 0.003,
    "0.7": 0.004,
    "0.8": 0.005,
    "0.9": 0.006,
    "1.0": 0.007,
    "1.1": 0.008,
    "1.2": 0.009,
    "1.25": 0.01,
    "1.3": 0.0105,
    "1.4": 0.012,
    "1.5": 0.015,
    "1.6": 0.02,
    "1.7": 0.025,
    "1.8": 0.028,
    "1.9": 0.03,
    "2.0": 0.035,
    "2.1": 0.038,
    "2.2": 0.04,
    "2.3": 0.045,
    "2.4": 0.05,
    "2.5": 0.06,
    "2.6": 0.07,
    "2.7": 0.08,
    "2.8": 0.1,
    "2.9": 0.11,
    "3.0": 0.12,
    "3.25": 0.13,
    "3.3": 0.14,
    "3.4": 0.155,
    "3.5": 0.17,
    "3.55": 0.18,
    "3.65": 0.19,
    "3.7": 0.2,
    "3.75": 0.21,
    "3.8": 0.22,
    "3.85": 0.23,
    "3.9": 0.24,
    "3.95": 0.25,
    "4.0": 0.26,
    "4.05": 0.27,
    "4.1": 0.28,
    "4.15": 0.29,
    "4.2": 0.3,
    "4.25": 0.31,
    "4.3": 0.32,
    "4.35": 0.33,
    "4.4": 0.34,
    "4.45": 0.35,
    "4.5": 0.36,
    "4.55": 0.37
  };

  // Ajoutez cette fonction pour récupérer les taux horaires
  const fetchTauxHoraires = useCallback(async () => {
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
  }, []);

  // Appelez cette fonction dans un useEffect
  useEffect(() => {
    fetchTauxHoraires();
  }, [fetchTauxHoraires]);

  const calculerPrix = useCallback((temps, tauxHoraire) => {
    const heures = temps.heures || 0;
    const minutes = temps.minutes || 0;
    const tempsTotal = heures + minutes / 60;
    return tempsTotal * tauxHoraire;
  }, []);

  return (
    <div className={`min-h-screen ${bgClass} p-8`}>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Nouveau devis
      </h1>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Client</label>
          <select
            value={devis.client}
            onChange={handleClientChange}
            className={inputClass}
          >
            <option value="">Sélectionner un client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.informationsPersonnelles.nom} {client.informationsPersonnelles.prenom}
              </option>
            ))}
            <option value="nouveau">+ Créer un nouveau client</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Catégorie</label>
          <select
            value={devis.categorie}
            onChange={handleCategorieChange}
            className={inputClass}
          >
            <option value="">Sélectionner une catégorie</option>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Sous-catégorie</label>
          <select
            value={devis.sousCategorie}
            onChange={handleSousCategorieChange}
            className={inputClass}
            disabled={!devis.categorie}
          >
            <option value="">Sélectionner une sous-catégorie</option>
            {devis.categorie && categories[devis.categorie].map(subCat => (
              <option key={subCat} value={subCat}>{subCat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Métal</label>
          <CustomSelect
            options={metalOptions}
            value={devis.metal}
            onChange={(value) => handleInputChange('metal', value)}
            className={`${inputClass} w-full`}
            darkMode={darkMode}
          />
        </div>
        <div>
          <label className="block mb-2">Titre du devis</label>
          <input
            type="text"
            value={devis.titreDevis}
            onChange={(e) => handleInputChange('titreDevis', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Taille</label>
          <input
            type="text"
            value={devis.taille}
            onChange={(e) => handleInputChange('taille', e.target.value)}
            className={inputClass}
            placeholder="ex : 54, 18cm"
          />
        </div>
        <div>
          <label className="block mb-2">Poids estimé (g)</label>
          <input
            type="number"
            value={devis.poidsEstime}
            onChange={(e) => handleInputChange('poidsEstime', e.target.value)}
            className={inputClass}
            step="0.1"
            min="0"
            placeholder="ex : 10.5"
          />
        </div>
        <div>
          <label className="block mb-2">Valeur métal estimée (€)</label>
          <input
            type="text"
            value={valeurMetal}
            readOnly
            className={`${inputClass} w-full bg-gray-100`}
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-2">Description</label>
          <textarea
            value={devis.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`${inputClass} h-24 resize-vertical`}
            placeholder="Entrez une description détaillée"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Gravure et Finition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">Gravure</label>
            <input
              type="text"
              value={devis.gravure}
              onChange={(e) => handleInputChange('gravure', e.target.value)}
              className={`${inputClass} w-full`}
              placeholder="Texte à graver (optionnel)"
            />
          </div>
          {devis.gravure && (
            <div>
              <label className="block mb-2 font-semibold">Style de gravure</label>
              <select
                value={devis.styleGravure}
                onChange={(e) => handleInputChange('styleGravure', e.target.value)}
                className={`${inputClass} w-full`}
              >
                <option value="">Sélectionner un style</option>
                {Object.entries(stylesGravure).map(([style, prix]) => (
                  <option key={style} value={style}>{`${style} (${prix}€)`}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block mb-2 font-semibold">Poinçon de maître</label>
            <select
              value={devis.options.poinconMaitre}
              onChange={(e) => handleOptionsChange('poinconMaitre', e.target.value)}
              className={`${inputClass} w-full`}
            >
              <option value="">Sélectionnez une option</option>
              {Object.entries(parametres.prixPoincons.poinconMaitre).map(([type, prix]) => (
                <option key={type} value={type}>
                  {type === 'gravureLaser' ? 'Gravure laser' : type === 'frappe' ? 'Frappé' : type} - {prix}€
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Poinçon de titre</label>
            <select
              value={devis.options.poinconTitre}
              onChange={(e) => handleOptionsChange('poinconTitre', e.target.value)}
              className={`${inputClass} w-full`}
            >
              <option value="">Sélectionnez une option</option>
              {Object.entries(parametres.prixPoincons.poinconTitre).map(([type, prix]) => (
                <option key={type} value={type}>
                  {type === 'gravureLaser' ? 'Gravure laser' : type === 'frappe' ? 'Frappé' : type} - {prix}€
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Options de marque</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={devis.options.gravureLogoMarque}
                  onChange={() => handleCheckboxChange('gravureLogoMarque')}
                  className="form-checkbox h-5 w-5 text-teal-600"
                />
                <span>Gravure logo marque ({parametres.prixPoincons.marque.gravureLogoMarque}€)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={devis.options.gravureNumeroSerie}
                  onChange={() => handleCheckboxChange('gravureNumeroSerie')}
                  className="form-checkbox h-5 w-5 text-teal-600"
                />
                <span>Gravure N° de série ({parametres.prixPoincons.marque.gravureNumeroSerie}€)</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Finition</label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={devis.options.rhodiage}
                onChange={() => handleCheckboxChange('rhodiage')}
                className="form-checkbox h-5 w-5 text-teal-600"
              />
              <span>Rhodiage ({parametres.prixRhodiage}€)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Commentaire interne</label>
          <textarea
            value={devis.commentaireInterne}
            onChange={(e) => handleInputChange('commentaireInterne', e.target.value)}
            className={`${inputClass} h-24 resize-vertical`}
            placeholder="Ajoutez ici des notes internes sur le devis (non visibles par le client)"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Diamants Ronds</h2>
        {devis.diamants.map((diamant, index) => (
          <div key={index} className="flex mb-4 space-x-4 items-end">
            <div>
              <label className="block mb-2">Diamètre (mm)</label>
              <select
                value={diamant.taille}
                onChange={(e) => handleDiamantsChange(index, 'taille', e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner un diamètre</option>
                {Object.keys(diametresEtCarats).map(diametre => (
                  <option key={diametre} value={diametre}>
                    ø {diametre} mm ({diametresEtCarats[diametre]} ct)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Quantité</label>
              <input
                type="number"
                value={diamant.qte}
                onChange={(e) => handleDiamantsChange(index, 'qte', parseInt(e.target.value))}
                className={inputClass}
                min="0"
              />
            </div>
            <div>
              <label className="block mb-2">Fourni par</label>
              <select
                value={diamant.fourniPar}
                onChange={(e) => handleDiamantsChange(index, 'fourniPar', e.target.value)}
                className={inputClass}
              >
                <option value="Client">Client</option>
                <option value="TGN 409">TGN 409</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Sertissage</label>
              <select
                value={diamant.sertissage}
                onChange={(e) => handleDiamantsChange(index, 'sertissage', e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner un sertissage</option>
                {typesSertissage.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Coût sertissage unitaire</label>
              <input
                type="number"
                value={diamant.coutSertissageUnitaire || (diamant.sertissage ? parametres.prixSertissage[diamant.sertissage] || 0 : 0)}
                onChange={(e) => handleDiamantsChange(index, 'coutSertissageUnitaire', parseFloat(e.target.value))}
                className={inputClass}
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-2">Prix diamants</label>
              <input
                type="text"
                value={diamant.prixTotal ? `${diamant.prixTotal.toFixed(2)} €` : '0.00 €'}
                readOnly
                className={inputClass}
              />
            </div>
            <div>
              <label className="block mb-2">Prix sertissage</label>
              <input
                type="text"
                value={diamant.prixSertissage ? `${diamant.prixSertissage.toFixed(2)} €` : '0.00 €'}
                readOnly
                className={inputClass}
              />
            </div>
            <button
              onClick={() => handleRemoveDiamant(index)}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          onClick={handleAddDiamant}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors mt-2"
        >
          Ajouter un diamant
        </button>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Total prix diamants</label>
            <input
              type="text"
              value={`${totalPrixDiamants.toFixed(2)} €`}
              readOnly
              className={`${inputClass} w-full bg-gray-100`}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Total prix sertissage</label>
            <input
              type="text"
              value={`${totalPrixSertissage.toFixed(2)} €`}
              readOnly
              className={`${inputClass} w-full bg-gray-100`}
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Autres pierres</h2>
        {devis.autresPierres.map((pierre, index) => (
          <div key={index} className="flex mb-4 space-x-4 items-end">
            <div>
              <label className="block mb-2">Forme</label>
              <select
                value={pierre.forme}
                onChange={(e) => handleAutresPierresChange(index, 'forme', e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner une forme</option>
                {formesPierres.map((forme) => (
                  <option key={forme} value={forme}>{forme}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Dimension</label>
              <input
                type="text"
                value={pierre.dimension}
                onChange={(e) => handleAutresPierresChange(index, 'dimension', e.target.value)}
                className={inputClass}
                placeholder="ex : 4.34 x 2.61 x 2.2"
              />
            </div>
            <div>
              <label className="block mb-2">Type de pierres</label>
              <select
                value={pierre.type}
                onChange={(e) => handleAutresPierresChange(index, 'type', e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner un type</option>
                {typesPierres.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Prix de la pierre</label>
              <div className="relative">
                <input
                  type="text"
                  value={pierre.prix}
                  onChange={(e) => handleAutresPierresChange(index, 'prix', e.target.value)}
                  className={`${inputClass} pr-8`}
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">€</span>
              </div>
            </div>
            <div>
              <label className="block mb-2">Caratage</label>
              <div className="relative">
                <input
                  type="text"
                  value={pierre.carat}
                  onChange={(e) => handleAutresPierresChange(index, 'carat', e.target.value)}
                  className={`${inputClass} pr-8`}
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">ct</span>
              </div>
            </div>
            <div>
              <label className="block mb-2">Sertissage</label>
              <select
                value={pierre.sertissage}
                onChange={(e) => handleAutresPierresChange(index, 'sertissage', e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner un sertissage</option>
                {typesSertissage.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Fourni par</label>
              <select
                value={pierre.fourniPar}
                onChange={(e) => handleAutresPierresChange(index, 'fourniPar', e.target.value)}
                className={inputClass}
              >
                <option value="TGN 409">TGN 409</option>
                <option value="Client">Client</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Quantit</label>
              <input
                type="number"
                value={pierre.qte}
                onChange={(e) => handleAutresPierresChange(index, 'qte', parseInt(e.target.value))}
                className={inputClass}
              />
            </div>
            <button
              onClick={() => handleRemoveAutrePierre(index)}
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          onClick={handleAddAutrePierre}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors mt-2"
        >
          Ajouter une autre pierre
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Images du devis</h2>
        <div 
          {...getRootProps()} 
          className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900' 
              : 'border-gray-300 hover:border-teal-500'
          }`}
          onPaste={handlePaste}
        >
          <input {...getInputProps()} />
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Glissez et déposez des images ici, ou cliquez pour sélectionner des fichiers</p>
          <p className="text-sm text-gray-500">Vous pouvez aussi coller une image directement (Ctrl+V)</p>
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                {console.log("Rendu de l'image:", image.id, image)}
                <img 
                  src={image.preview} 
                  alt={`Aperçu ${image.id}`}
                  className={`w-full h-full object-cover rounded-lg ${image.id === mainImageId ? 'border-4 border-teal-500' : ''}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  {image.id !== mainImageId && (
                    <button
                      onClick={() => setAsMainImage(image.id)}
                      className="p-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
                    >
                      <StarIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Temps administratif</label>
          <div className="flex space-x-2">
            <select
              value={devis.tempsAdministratif.heures}
              onChange={(e) => handleInputChange('tempsAdministratif', { heures: parseInt(e.target.value) })}
              className={inputClass}
            >
              {heuresOptions.map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
            <select
              value={devis.tempsAdministratif.minutes}
              onChange={(e) => handleInputChange('tempsAdministratif', { minutes: parseInt(e.target.value) })}
              className={inputClass}
            >
              {minutesOptions.map(m => (
                <option key={m} value={m}>{m}min</option>
              ))}
            </select>
          </div>
          <p className="mt-2">Prix : {calculerPrix(devis.tempsAdministratif, tauxHoraires.administratif).toFixed(2)} €</p>
        </div>
        <div>
          <label className="block mb-2">Temps CAO</label>
          <div className="flex space-x-2">
            <select
              value={devis.tempsCAO.heures}
              onChange={(e) => handleInputChange('tempsCAO', { heures: parseInt(e.target.value) })}
              className={inputClass}
            >
              {heuresOptions.map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
            <select
              value={devis.tempsCAO.minutes}
              onChange={(e) => handleInputChange('tempsCAO', { minutes: parseInt(e.target.value) })}
              className={inputClass}
            >
              {minutesOptions.map(m => (
                <option key={m} value={m}>{m}min</option>
              ))}
            </select>
          </div>
          <p className="mt-2">Prix : {calculerPrix(devis.tempsCAO, tauxHoraires.cao).toFixed(2)} €</p>
        </div>
        <div>
          <label className="block mb-2">Temps bijouterie</label>
          <div className="flex space-x-2">
            <select
              value={devis.tempsRepare.heures}
              onChange={(e) => handleInputChange('tempsRepare', { heures: parseInt(e.target.value) })}
              className={inputClass}
            >
              {heuresOptions.map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
            <select
              value={devis.tempsRepare.minutes}
              onChange={(e) => handleInputChange('tempsRepare', { minutes: parseInt(e.target.value) })}
              className={inputClass}
            >
              {minutesOptions.map(m => (
                <option key={m} value={m}>{m}min</option>
              ))}
            </select>
          </div>
          <p className="mt-2">Prix : {calculerPrix(devis.tempsRepare, tauxHoraires.bijouterie).toFixed(2)} €</p>
        </div>
        <div>
          <label className="block mb-2">Temps polissage</label>
          <div className="flex space-x-2">
            <select
              value={devis.tempsPolissage.heures}
              onChange={(e) => handleInputChange('tempsPolissage', { heures: parseInt(e.target.value) })}
              className={inputClass}
            >
              {heuresOptions.map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
            <select
              value={devis.tempsPolissage.minutes}
              onChange={(e) => handleInputChange('tempsPolissage', { minutes: parseInt(e.target.value) })}
              className={inputClass}
            >
              {minutesOptions.map(m => (
                <option key={m} value={m}>{m}min</option>
              ))}
            </select>
          </div>
          <p className="mt-2">Prix : {calculerPrix(devis.tempsPolissage, tauxHoraires.bijouterie).toFixed(2)} €</p>
        </div>
        <div>
          <label className="block mb-2">Temps de désertissage</label>
          <div className="flex space-x-2">
            <select
              value={devis.tempsDessertissage.heures}
              onChange={(e) => handleInputChange('tempsDessertissage', { heures: parseInt(e.target.value) })}
              className={inputClass}
            >
              {heuresOptions.map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
            <select
              value={devis.tempsDessertissage.minutes}
              onChange={(e) => handleInputChange('tempsDessertissage', { minutes: parseInt(e.target.value) })}
              className={inputClass}
            >
              {minutesOptions.map(m => (
                <option key={m} value={m}>{m}min</option>
              ))}
            </select>
          </div>
          <p className="mt-2">Prix : {calculerPrix(devis.tempsDessertissage, tauxHoraires.dessertissage).toFixed(2)} €</p>
        </div>
        <div>
          <label className="block mb-2">Temps Design/Réflexion</label>
          <div className="flex space-x-2">
            <select
              value={devis.tempsDesign.heures}
              onChange={(e) => handleInputChange('tempsDesign', { heures: parseInt(e.target.value) })}
              className={inputClass}
            >
              {heuresOptions.map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
            <select
              value={devis.tempsDesign.minutes}
              onChange={(e) => handleInputChange('tempsDesign', { minutes: parseInt(e.target.value) })}
              className={inputClass}
            >
              {minutesOptions.map(m => (
                <option key={m} value={m}>{m}min</option>
              ))}
            </select>
          </div>
          <p className="mt-2">Prix : {calculerPrix(devis.tempsDesign, tauxHoraires.design).toFixed(2)} €</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Tarif fonte</label>
          <div className="flex items-center space-x-2">
            <select
              value={devis.tarifFonte}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  handleInputChange('tarifFonte', 'custom');
                } else {
                  handleInputChange('tarifFonte', e.target.value);
                }
              }}
              className={`${inputClass} flex-grow`}
            >
              <option value="">Sélectionnez un tarif</option>
              {Object.entries(parametres.prixFonte).map(([poids, prix]) => (
                <option key={poids} value={prix}>{`${poids} - ${prix}€`}</option>
              ))}
              <option value="custom">Tarif personnalisé</option>
            </select>
            {devis.tarifFonte === 'custom' && (
              <input
                type="number"
                value={devis.tarifFonteCustom || ''}
                onChange={(e) => handleInputChange('tarifFonteCustom', e.target.value)}
                placeholder="Tarif libre"
                className={`${inputClass} w-24`}
                step="0.01"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block mb-2">Tarif impression cire</label>
          <div className="flex items-center space-x-2">
            <select
              value={devis.tarifImpressionCire}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  handleInputChange('tarifImpressionCire', 'custom');
                } else {
                  handleInputChange('tarifImpressionCire', e.target.value);
                }
              }}
              className={`${inputClass} flex-grow`}
            >
              <option value="">Sélectionnez un tarif</option>
              {Object.entries(parametres.prixImpressionCire).map(([taille, prix]) => (
                <option key={taille} value={prix}>{`${taille} - ${prix}€`}</option>
              ))}
              <option value="custom">Tarif personnalisé</option>
            </select>
            {devis.tarifImpressionCire === 'custom' && (
              <input
                type="number"
                value={devis.tarifImpressionCireCustom || ''}
                onChange={(e) => handleInputChange('tarifImpressionCireCustom', e.target.value)}
                placeholder="Tarif libre"
                className={`${inputClass} w-24`}
                step="0.01"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block mb-2">Tarif impression résine</label>
          <div className="flex items-center space-x-2">
            <select
              value={devis.tarifImpressionResine}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  handleInputChange('tarifImpressionResine', 'custom');
                } else {
                  handleInputChange('tarifImpressionResine', e.target.value);
                }
              }}
              className={`${inputClass} flex-grow`}
            >
              <option value="">Sélectionnez un tarif</option>
              {Object.entries(parametres.prixImpressionResine).map(([taille, prix]) => (
                <option key={taille} value={prix}>{`${taille} - ${prix}€`}</option>
              ))}
              <option value="custom">Tarif personnalisé</option>
            </select>
            {devis.tarifImpressionResine === 'custom' && (
              <input
                type="number"
                value={devis.tarifImpressionResineCustom || ''}
                onChange={(e) => handleInputChange('tarifImpressionResineCustom', e.target.value)}
                placeholder="Tarif libre"
                className={`${inputClass} w-24`}
                step="0.01"
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Coût de production - Sertissage</label>
          <input
            type="number"
            value={devis.couts.production.sertissage}
            onChange={(e) => handleInputChange('couts', { ...devis.couts, production: { ...devis.couts.production, sertissage: parseFloat(e.target.value) } })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Coût de production - CAO</label>
          <input
            type="number"
            value={devis.couts.production.cao}
            onChange={(e) => handleInputChange('couts', { ...devis.couts, production: { ...devis.couts.production, cao: parseFloat(e.target.value) } })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Coût de production - Bijouterie</label>
          <input
            type="number"
            value={devis.couts.production.bijouterie}
            onChange={(e) => handleInputChange('couts', { ...devis.couts, production: { ...devis.couts.production, bijouterie: parseFloat(e.target.value) } })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Coût d'impression - Résine</label>
          <input
            type="number"
            value={devis.couts.impression.resine}
            onChange={(e) => handleInputChange('couts', { ...devis.couts, impression: { ...devis.couts.impression, resine: parseFloat(e.target.value) } })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Coût d'impression - Cire</label>
          <input
            type="number"
            value={devis.couts.impression.cire}
            onChange={(e) => handleInputChange('couts', { ...devis.couts, impression: { ...devis.couts.impression, cire: parseFloat(e.target.value) } })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Coût d'impression - Fonte</label>
          <input
            type="number"
            value={devis.couts.impression.fonte}
            onChange={(e) => handleInputChange('couts', { ...devis.couts, impression: { ...devis.couts.impression, fonte: parseFloat(e.target.value) } })}
            className={inputClass}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition-colors text-lg font-semibold mt-8"
      >
        Créer le devis
      </button>

      {showNouveauClientPopup && (
        <NouveauClientPopup
          isOpen={showNouveauClientPopup}
          onClose={() => setShowNouveauClientPopup(false)}
          darkMode={darkMode}
          onClientAdded={handleNouveauClientAdded}
        />
      )}

      <InformationsGenerales
        devis={devis}
        handleInputChange={handleInputChange}
        clients={clients}
        setShowNouveauClientPopup={setShowNouveauClientPopup}
        darkMode={darkMode}
      />
    </div>
  );
};

export default PageCreerDevis;