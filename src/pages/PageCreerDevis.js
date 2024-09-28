import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import NouveauClientPopup from '../components/clients/NouveauClientPopup';

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
    autresPierres: [{ forme: '', dimension: '', type: '', prix: 0, carat: 0, fourniPar: 'TGN 409', qte: 0 }],
    images: [],
    tempsAdministratif: { heures: 0, minutes: 0 },
    tempsCAO: { heures: 0, minutes: 0 },
    tempsRepare: { heures: 0, minutes: 0 },
    tempsPolissage: { heures: 0, minutes: 0 },
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
    coefficientDiamantsRonds: 1.15
  });

  const metaux = [
    "Or Jaune 3N",
    "Or Rouge 5N",
    "Or Rose 4N",
    "Or Gris",
    "Or Gris Palladié",
    "Argent 925",
    "Or jaune 24K",
    "Or jaune 2N"
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

  useEffect(() => {
    const fetchStylesGravure = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStylesGravure(Object.keys(data.prixGravure || {}));
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
          coefficientDiamantsRonds: data.coefficientDiamantsRonds || 1.15
        });
        setTypesSertissage(Object.keys(data.prixSertissage || {}));
      }
    };

    fetchParametres();
  }, []);

  const handleInputChange = (field, value) => {
    setDevis(prev => ({ ...prev, [field]: value }));
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

      // Calculer le prix du sertissage
      const prixSertissageUnitaire = parametres.prixSertissage[newDiamants[index].sertissage] || 0;
      newDiamants[index].prixSertissage = prixSertissageUnitaire * newDiamants[index].qte;
    }

    setDevis(prev => ({ ...prev, diamants: newDiamants }));
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
      autresPierres: [...prev.autresPierres, { forme: '', dimension: '', type: '', prix: 0, carat: 0, fourniPar: 'TGN 409', qte: 0 }]
    }));
  };

  const handleImageUpload = (event) => {
    // Logique pour gérer l'upload d'images
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'devis'), devis);
      alert('Devis créé avec succès !');
      // Réinitialiser le formulaire ou rediriger
    } catch (error) {
      console.error("Erreur lors de la création du devis :", error);
      alert('Une erreur est survenue lors de la création du devis.');
    }
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
          <label className="block mb-2">Métal</label>
          <select
            value={devis.metal}
            onChange={(e) => handleInputChange('metal', e.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner un métal</option>
            {metaux.map(metal => (
              <option key={metal} value={metal}>{metal}</option>
            ))}
          </select>
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

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Gravure</label>
          <input
            type="text"
            value={devis.gravure}
            onChange={(e) => handleInputChange('gravure', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Style de gravure</label>
          <select
            value={devis.styleGravure}
            onChange={(e) => handleInputChange('styleGravure', e.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner un style</option>
            {stylesGravure.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Poinçon de maître</label>
          <select
            value={devis.options.poinconMaitre}
            onChange={(e) => handleOptionsChange('poinconMaitre', e.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner</option>
            {Object.keys(parametres.prixPoincons.poinconMaitre).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Poinçon de titre</label>
          <select
            value={devis.options.poinconTitre}
            onChange={(e) => handleOptionsChange('poinconTitre', e.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner</option>
            {Object.keys(parametres.prixPoincons.poinconTitre).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.gravureLogoMarque}
              onChange={() => handleCheckboxChange('gravureLogoMarque')}
              className="mr-2"
            />
            Gravure logo marque
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.gravureNumeroSerie}
              onChange={() => handleCheckboxChange('gravureNumeroSerie')}
              className="mr-2"
            />
            Gravure N° série
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.rhodiage}
              onChange={() => handleCheckboxChange('rhodiage')}
              className="mr-2"
            />
            Rhodiage
          </label>
        </div>
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
              <label className="block mb-2">Quantité</label>
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
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Temps administratif</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={devis.tempsAdministratif.heures}
              onChange={(e) => handleInputChange('tempsAdministratif', { ...devis.tempsAdministratif, heures: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>h</span>
            <input
              type="number"
              value={devis.tempsAdministratif.minutes}
              onChange={(e) => handleInputChange('tempsAdministratif', { ...devis.tempsAdministratif, minutes: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>min</span>
          </div>
        </div>
        <div>
          <label className="block mb-2">Temps CAO</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={devis.tempsCAO.heures}
              onChange={(e) => handleInputChange('tempsCAO', { ...devis.tempsCAO, heures: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>h</span>
            <input
              type="number"
              value={devis.tempsCAO.minutes}
              onChange={(e) => handleInputChange('tempsCAO', { ...devis.tempsCAO, minutes: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>min</span>
          </div>
        </div>
        <div>
          <label className="block mb-2">Temps réparé</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={devis.tempsRepare.heures}
              onChange={(e) => handleInputChange('tempsRepare', { ...devis.tempsRepare, heures: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>h</span>
            <input
              type="number"
              value={devis.tempsRepare.minutes}
              onChange={(e) => handleInputChange('tempsRepare', { ...devis.tempsRepare, minutes: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>min</span>
          </div>
        </div>
        <div>
          <label className="block mb-2">Temps polissage</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={devis.tempsPolissage.heures}
              onChange={(e) => handleInputChange('tempsPolissage', { ...devis.tempsPolissage, heures: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>h</span>
            <input
              type="number"
              value={devis.tempsPolissage.minutes}
              onChange={(e) => handleInputChange('tempsPolissage', { ...devis.tempsPolissage, minutes: parseInt(e.target.value) })}
              className={inputClass}
            />
            <span>min</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Tarif fonte</label>
          <input
            type="text"
            value={devis.tarifFonte}
            onChange={(e) => handleInputChange('tarifFonte', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Tarif impression cire</label>
          <input
            type="text"
            value={devis.tarifImpressionCire}
            onChange={(e) => handleInputChange('tarifImpressionCire', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Tarif impression résine</label>
          <input
            type="text"
            value={devis.tarifImpressionResine}
            onChange={(e) => handleInputChange('tarifImpressionResine', e.target.value)}
            className={inputClass}
          />
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
    </div>
  );
};

export default PageCreerDevis;