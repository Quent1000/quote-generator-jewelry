import React, { useState, useEffect, useMemo } from 'react';
import PriceInput from '../components/PriceInput';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TimeInput = ({ label, hours, minutes, onChange, price, darkMode }) => {
  const selectClass = `w-full p-1 text-xs border rounded ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring focus:ring-teal-200`;

  const totalMinutes = hours * 60 + minutes;
  const totalTimeString = totalMinutes > 0 
    ? `${hours}h${minutes.toString().padStart(2, '0')}`
    : '0min';

  return (
    <div className={`space-y-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <label className="block text-xs font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <select
          value={hours}
          onChange={(e) => onChange(parseInt(e.target.value), minutes)}
          className={selectClass}
        >
          {[...Array(24).keys()].map(h => (
            <option key={h} value={h}>{h}h</option>
          ))}
        </select>
        <select
          value={minutes}
          onChange={(e) => onChange(hours, parseInt(e.target.value))}
          className={selectClass}
        >
          {[...Array(12).keys()].map(m => (
            <option key={m} value={m * 5}>{m * 5}min</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between text-xs">
        <span>{totalTimeString}</span>
        <span>{price.toFixed(2)} €</span>
      </div>
    </div>
  );
};

const PageCreerDevis = () => {
  const { darkMode } = useAppContext();

  const [devis, setDevis] = useState({
    numero: '',
    client: '',
    titre: '',
    description: '',
    commentairePrivé: '',
    categorieBijou: '',
    metal: '',
    taille: '',
    gravure: '',
    poincon: false,
    dessertissage: false,
    rhodiage: false,
    temps: {
      administratif: { hours: 0, minutes: 0 },
      cao: { hours: 0, minutes: 0 },
      repare: { hours: 0, minutes: 0 },
      polissage: { hours: 0, minutes: 0 },
      dessertissage: { hours: 0, minutes: 0 }
    },
    tarifFonte: '',
    tarifImpressionCire: '',
    tarifImpressionResine: '',
    methodeLivraison: '',
    remiseGenerale: '',
    images: [],
    diamants: [{ taille: '', quantite: 0, sertissage: 'Serti grain', fournisseur: 'TGN 409' }],
    poidsEstime: '',
    styleGravure: '',
    prixLivraison: 0,
  });
  // Génération du numéro de devis
  useEffect(() => {
    const nouveauNumero = `DEV-${Date.now()}`;
    setDevis(prev => ({ ...prev, numero: nouveauNumero }));
  }, []);


  const clients = [
    { id: 1, nom: 'david gusky', societe: 'DAVIDOR' },
    { id: 2, nom: 'Quentin Imhoff', societe: 'TGN409' }
  ];

  const categoriesBijoux = [
    'Bague', 'Collier / Pendentif', 'Boucle d\'oreille', 'Bracelet', 'Autres'
  ];

  const metaux = ['JAUNE', 'GRIS', 'GPD', 'ROUGE 5N', 'ROSE 4N'];

  const typesSertissage = [
    'Serti grain', 'Serti rail', 'Serti copeaux', 'Serti clos', 'Serti descendu', 'Serti masse'
  ];

  const taillesDiamant = [
    '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0',
    '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '3.0', '3.1', '3.2'
  ];
  const diamantData = useMemo(() => ({
    "0.5": { prixCarat: 750, poidsUnit: 0.00025 },
    "0.6": { prixCarat: 750, poidsUnit: 0.003 },
    "0.7": { prixCarat: 750, poidsUnit: 0.004 },
    "0.8": { prixCarat: 750, poidsUnit: 0.005 },
    "0.9": { prixCarat: 750, poidsUnit: 0.006 },
    "1.0": { prixCarat: 750, poidsUnit: 0.007 },
    "1.1": { prixCarat: 750, poidsUnit: 0.008 },
    "1.2": { prixCarat: 750, poidsUnit: 0.009 },
    "1.25": { prixCarat: 725, poidsUnit: 0.01 },
    "1.3": { prixCarat: 725, poidsUnit: 0.0105 },
    "1.4": { prixCarat: 725, poidsUnit: 0.012 },
    "1.5": { prixCarat: 725, poidsUnit: 0.015 },
    "1.6": { prixCarat: 725, poidsUnit: 0.02 },
    "1.7": { prixCarat: 725, poidsUnit: 0.025 },
    "1.8": { prixCarat: 750, poidsUnit: 0.028 },
    "1.9": { prixCarat: 750, poidsUnit: 0.03 },
    "2.0": { prixCarat: 750, poidsUnit: 0.035 },
    "2.1": { prixCarat: 750, poidsUnit: 0.038 },
    "2.2": { prixCarat: 750, poidsUnit: 0.04 },
    "2.3": { prixCarat: 750, poidsUnit: 0.045 },
    "2.4": { prixCarat: 750, poidsUnit: 0.05 },
    "2.5": { prixCarat: 750, poidsUnit: 0.06 },
    "2.6": { prixCarat: 750, poidsUnit: 0.07 },
    "2.7": { prixCarat: 1088, poidsUnit: 0.08 },
    "2.8": { prixCarat: 1088, poidsUnit: 0.1 },
    "2.9": { prixCarat: 1088, poidsUnit: 0.11 },
    "3.0": { prixCarat: 1088, poidsUnit: 0.12 },
    "3.25": { prixCarat: 1088, poidsUnit: 0.13 },
  }), []);

  const [parametres, setParametres] = useState({
    tauxHoraireCAO: 50,
    tauxHoraireBijouterie: 50,
    tauxHoraireAdministratif: 50,
    prixSertissage: {
      "Serti grain": 3,
      "Serti rail": 4,
      "Serti copeaux": 5,
      "Serti clos": 6,
      "Serti descendu": 7,
      "Serti masse": 8
    },
    prixGravure: {
      "Manuscrite": 20,
      "Bâton": 15
    },
    prixMetaux: {
      "JAUNE": 50000,
      "GRIS": 55000,
      "GPD": 60000,
      "ROUGE 5N": 58000,
      "ROSE 4N": 56000
    },
    prixRhodiage: 30,
    prixLivraison: {
      "Sur site": 0,
      "VD la poste": 10,
      "DHL": 20,
      "Fedex": 25
    }
  });

  useEffect(() => {
    const fetchParametres = async () => {
      const docRef = doc(db, 'parametresDevis', 'default');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setParametres(docSnap.data());
      }
    };
    fetchParametres();
  }, []);

  const [autresPierres, setAutresPierres] = useState([{
    forme: '',
    dimension: '',
    type: '',
    prix: '',
    caratage: '',
    fournisseur: 'TGN 409',
    quantite: 1
  }]);
  
  
  
  const ajouterAutrePierre = () => {
    setAutresPierres(prev => [...prev, {
      forme: '',
      dimension: '',
      type: '',
      prix: '',
      caratage: '',
      fournisseur: 'TGN 409',
      quantite: 1
    }]);
  };
  
  const supprimerAutrePierre = (index) => {
    setAutresPierres(prev => prev.filter((_, i) => i !== index));
  };

  const [coutsSertissage, setCoutsSertissage] = useState(0);
  const [prixCAO, setPrixCAO] = useState(0);
  const [prixBijouterie, setPrixBijouterie] = useState(0);

  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

  const [prixGravure, setPrixGravure] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDevis(prev => {
      if (name === 'prixLivraison') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      if (name === 'remiseGenerale') {
        // Assurez-vous que la valeur est un nombre entre 0 et 100
        const remise = Math.max(0, Math.min(100, Number(value) || 0));
        return { ...prev, [name]: remise };
      }
      if (name.startsWith('temps')) {
        const timeType = name.replace('temps', '').toLowerCase();
        return {
          ...prev,
          temps: {
            ...prev.temps,
            [timeType]: {
              ...prev.temps[timeType],
              ...(typeof value === 'object' ? value : {})
            }
          }
        };
      }
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleDiamantAdd = () => {
    setDevis(prev => {
      const newDiamants = [...prev.diamants, { taille: '', quantite: 0, fournisseur: 'TGN 409', sertissage: 'Serti grain' }];
      return {
        ...prev,
        diamants: newDiamants
      };
    });
  };

  const handleDiamantChange = (index, field, value) => {
    setDevis(prev => {
      const newDiamants = prev.diamants.map((diamant, i) =>
        i === index ? { ...diamant, [field]: field === 'quantite' ? parseInt(value) || 0 : value } : diamant
      );
      return {
        ...prev,
        diamants: newDiamants
      };
    });
  };

  const handleDiamantRemove = (index) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.filter((_, i) => i !== index)
    }));
  };

  const handleAutrePierreChange = (index, field, value) => {
    setAutresPierres(prev => prev.map((pierre, i) =>
      i === index ? { ...pierre, [field]: value } : pierre
    ));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setDevis(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setDevis(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const calculerPrixDiamants = () => {
      let totalSertissage = 0;
      const totalPrix = (devis.diamants || []).reduce((total, diamant) => {
        const data = diamantData[diamant.taille];
        if (data && parametres.prixSertissage && diamant.sertissage) {
          const prix = data.prixCarat * data.poidsUnit * diamant.quantite;
          const coutSertissage = (parametres.prixSertissage[diamant.sertissage] || 0) * diamant.quantite;
          totalSertissage += coutSertissage;
          return total + prix;
        }
        return total;
      }, 0);
      setCoutsSertissage(totalSertissage);
      return totalPrix;
    };

    const prixDiamants = calculerPrixDiamants();
    const prixAutresPierres = (autresPierres || []).reduce((total, pierre) => total + parseFloat(pierre.prix || 0), 0);
    const prixMetal = (parseFloat(devis.poidsEstime) || 0) * (parametres.prixMetaux && devis.metal ? parametres.prixMetaux[devis.metal] || 0 : 0) / 1000;

    const prixCAO = ((devis.temps?.cao?.hours || 0) * parametres.tauxHoraireCAO) +
      ((devis.temps?.cao?.minutes || 0) / 60 * parametres.tauxHoraireCAO);
    const prixAdministratif = ((devis.temps?.administratif?.hours || 0) * parametres.tauxHoraireAdministratif) +
      ((devis.temps?.administratif?.minutes || 0) / 60 * parametres.tauxHoraireAdministratif);
    const prixBijouterie = ((devis.temps?.repare?.hours || 0) + (devis.temps?.polissage?.hours || 0)) * parametres.tauxHoraireBijouterie +
      ((devis.temps?.repare?.minutes || 0) + (devis.temps?.polissage?.minutes || 0)) / 60 * parametres.tauxHoraireBijouterie;

    setPrixCAO(prixCAO + prixAdministratif);
    setPrixBijouterie(prixBijouterie);

    const nouveauPrixGravure = devis.gravure && parametres.prixGravure ? parametres.prixGravure[devis.styleGravure] || 0 : 0;
    setPrixGravure(nouveauPrixGravure);

    const prixRhodiage = devis.rhodiage ? parametres.prixRhodiage || 0 : 0;

    // Calculer le prix de la livraison en fonction de la méthode sélectionnée
    const prixLivraison = devis.methodeLivraison ? parametres.prixLivraison[devis.methodeLivraison] || 0 : 0;

    const sousTotal = prixDiamants + prixAutresPierres + prixMetal + coutsSertissage + prixCAO + prixAdministratif + prixBijouterie + nouveauPrixGravure + prixRhodiage + prixLivraison;
    const remiseGenerale = parseFloat(devis.remiseGenerale) || 0;
    const remise = sousTotal * (remiseGenerale / 100);
    const ht = sousTotal - remise;
    const tva = ht * 0.2;
    setTotalHT(ht);
    setTotalTVA(tva);
    setTotalTTC(ht + tva);
  }, [devis, autresPierres, parametres, diamantData, coutsSertissage]);

  const inputClass = `w-full p-1 text-xs border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring focus:ring-teal-200`;
  const labelClass = 'block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300';
  const buttonClass = 'bg-teal-500 text-white px-2 py-1 text-xs rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';
  const deleteButtonClass = `flex items-center justify-center ${inputClass} w-8 h-8 p-0 aspect-square`;

  const handleTimeChange = (type, hours, minutes) => {
    setDevis(prev => ({
      ...prev,
      temps: {
        ...prev.temps,
        [type]: { hours, minutes }
      }
    }));
  };

  const styleGravures = ['Manuscrite', 'Bâton'];

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h2 className="text-xl font-bold mb-4 text-teal-700 dark:text-teal-300">Nouveau devis - {devis.numero}</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Colonne 1 */}
          <div className="space-y-2">
            <div>
              <label className={labelClass}>Client</label>
              <select name="client" value={devis.client} onChange={handleChange} className={inputClass}>
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.nom} - {client.societe}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Titre du devis</label>
              <input type="text" name="titre" value={devis.titre} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={devis.description} onChange={handleChange} className={`${inputClass} h-16`} rows="2"></textarea>
            </div>
            <div>
              <label className={labelClass}>Commentaire privé</label>
              <textarea name="commentairePrivé" value={devis.commentairePrivé} onChange={handleChange} className={`${inputClass} h-16`} rows="2" placeholder="Commentaire interne"></textarea>
            </div>
          </div>

          {/* Colonne 2 */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Catégorie</label>
                <select name="categorieBijou" value={devis.categorieBijou} onChange={handleChange} className={inputClass}>
                  <option value="">Sélectionner</option>
                  {categoriesBijoux.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Métal</label>
                <select name="metal" value={devis.metal} onChange={handleChange} className={inputClass}>
                  <option value="">Sélectionner</option>
                  {metaux.map(metal => (
                    <option key={metal} value={metal}>{metal}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Taille</label>
                <input type="text" name="taille" value={devis.taille} onChange={handleChange} className={inputClass} placeholder="Ex: 54, 18cm" />
              </div>
              <div>
                <label className={labelClass}>Poids estimé (g)</label>
                <input type="number" name="poidsEstime" value={devis.poidsEstime || ''} onChange={handleChange} className={inputClass} min="0" step="0.1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Gravure</label>
                <input 
                  type="text" 
                  name="gravure" 
                  value={devis.gravure} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="Texte à graver" 
                />
              </div>
              <div>
                <label className={labelClass}>Style de gravure</label>
                <select 
                  name="styleGravure" 
                  value={devis.styleGravure} 
                  onChange={handleChange} 
                  className={inputClass}
                >
                  <option value="">Sélectionner</option>
                  {styleGravures.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="checkbox" name="poincon" checked={devis.poincon} onChange={handleChange} className="mr-1" />
                <span className="text-xs">Poinçon d'état</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="dessertissage" checked={devis.dessertissage} onChange={handleChange} className="mr-1" />
                <span className="text-xs">Dé-ssertissage</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="rhodiage" checked={devis.rhodiage} onChange={handleChange} className="mr-1" />
                <span className="text-xs">Rhodiage</span>
              </label>
            </div>
          </div>

          {/* Colonne 3 */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {['Administratif', 'CAO', 'Repare', 'Polissage'].map((type) => (
                <TimeInput
                  key={type}
                  label={`Temps ${type}`}
                  hours={devis.temps?.[type.toLowerCase()]?.hours || 0}
                  minutes={devis.temps?.[type.toLowerCase()]?.minutes || 0}
                  onChange={(h, m) => handleTimeChange(type.toLowerCase(), h, m)}
                  price={
                    ((devis.temps?.[type.toLowerCase()]?.hours || 0) + ((devis.temps?.[type.toLowerCase()]?.minutes || 0) / 60)) * 
                    (type === 'Administratif' ? parametres.tauxHoraireAdministratif :
                     type === 'CAO' ? parametres.tauxHoraireCAO :
                     parametres.tauxHoraireBijouterie)
                  }
                  darkMode={darkMode}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Fonte', 'ImpressionCire', 'ImpressionResine'].map((type) => (
                <div key={type}>
                  <label className={labelClass}>{`Tarif ${type.replace(/([A-Z])/g, ' $1').trim()}`}</label>
                  <PriceInput name={`tarif${type}`} value={devis[`tarif${type}`]} onChange={handleChange} darkMode={darkMode} className={inputClass} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Diamants et Autres Pierres */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-teal-500 rounded-lg p-4 bg-teal-50 dark:bg-teal-900 dark:border-teal-700">
            <h3 className="text-sm font-semibold mb-4 text-teal-700 dark:text-teal-300">Diamants</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-[2fr_1fr_2fr_2fr_40px] gap-2 text-xs font-medium text-teal-600 dark:text-teal-400">
                <div>Taille</div>
                <div>Qté</div>
                <div>Fourni par</div>
                <div>Sertissage</div>
                <div></div>
              </div>
              {(devis.diamants || []).map((diamant, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_2fr_2fr_40px] gap-2">
                  <select 
                    value={diamant.taille} 
                    onChange={(e) => handleDiamantChange(index, 'taille', e.target.value)} 
                    className={`${inputClass} bg-white dark:bg-gray-700`}
                  >
                    <option value="">Taille</option>
                    {taillesDiamant.map(taille => (
                      <option key={taille} value={taille}>{taille} mm</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    value={diamant.quantite} 
                    onChange={(e) => handleDiamantChange(index, 'quantite', e.target.value)} 
                    placeholder="Qté" 
                    className={`${inputClass} bg-white dark:bg-gray-700`} 
                    min="0" 
                  />
                  <select 
                    value={diamant.fournisseur} 
                    onChange={(e) => handleDiamantChange(index, 'fournisseur', e.target.value)} 
                    className={`${inputClass} bg-white dark:bg-gray-700`}
                  >
                    <option value="TGN 409">TGN 409</option>
                    <option value="Client">Client</option>
                  </select>
                  <select 
                    value={diamant.sertissage || 'Serti grain'} 
                    onChange={(e) => handleDiamantChange(index, 'sertissage', e.target.value)} 
                    className={`${inputClass} bg-white dark:bg-gray-700`}
                  >
                    {typesSertissage.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleDiamantRemove(index)} 
                    className={`${deleteButtonClass} w-10 h-10 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center`}
                    type="button"
                    aria-label="Supprimer le diamant"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button onClick={handleDiamantAdd} className={`${buttonClass} w-full bg-teal-600 hover:bg-teal-700 text-white`} type="button">+ Diamant</button>
            </div>
          </div>
          <div className="border border-teal-500 rounded-lg p-4 bg-teal-50 dark:bg-teal-900 dark:border-teal-700">
            <h3 className="text-sm font-semibold mb-4 text-teal-700 dark:text-teal-300">Autres Pierres</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr_1.5fr_1fr_40px] gap-2 text-xs font-medium text-teal-600 dark:text-teal-400">
                <div>Forme</div>
                <div>Dimension</div>
                <div>Type</div>
                <div>Prix</div>
                <div>Carat</div>
                <div>Fourni par</div>
                <div>Qté</div>
                <div></div>
              </div>
              {(autresPierres || []).map((pierre, index) => (
                <div key={index} className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr_1.5fr_1fr_40px] gap-2">
                  <select 
                    value={pierre.forme} 
                    onChange={(e) => handleAutrePierreChange(index, 'forme', e.target.value)} 
                    className={inputClass}
                  >
                    <option value="">Forme</option>
                    {['Ronde', 'Poire', 'Princesse', 'Rpc', 'Coeur'].map(forme => (
                      <option key={forme} value={forme}>{forme}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={pierre.dimension} 
                    onChange={(e) => handleAutrePierreChange(index, 'dimension', e.target.value)} 
                    placeholder="Dim" 
                    className={inputClass}
                  />
                  <select 
                    value={pierre.type} 
                    onChange={(e) => handleAutrePierreChange(index, 'type', e.target.value)} 
                    className={inputClass}
                  >
                    <option value="">Type</option>
                    {['Diamant', 'Saphir', 'Rubis', 'Émeraude'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    value={pierre.prix} 
                    onChange={(e) => handleAutrePierreChange(index, 'prix', e.target.value)} 
                    placeholder="Prix" 
                    className={inputClass}
                  />
                  <input 
                    type="number" 
                    value={pierre.caratage} 
                    onChange={(e) => handleAutrePierreChange(index, 'caratage', e.target.value)} 
                    placeholder="Carat" 
                    className={inputClass}
                  />
                  <select 
                    value={pierre.fournisseur} 
                    onChange={(e) => handleAutrePierreChange(index, 'fournisseur', e.target.value)} 
                    className={inputClass}
                  >
                    <option value="TGN 409">TGN 409</option>
                    <option value="Client">Client</option>
                  </select>
                  <input 
                    type="number" 
                    value={pierre.quantite} 
                    onChange={(e) => handleAutrePierreChange(index, 'quantite', e.target.value)} 
                    placeholder="Qté" 
                    className={inputClass}
                    min="1"
                  />
                  <button 
                    onClick={() => supprimerAutrePierre(index)} 
                    className={`${deleteButtonClass} w-10 h-10 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center`}
                    type="button"
                    aria-label="Supprimer la pierre"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button onClick={ajouterAutrePierre} className={`${buttonClass} w-full bg-teal-600 hover:bg-teal-700 text-white`} type="button">+ Autre Pierre</button>
            </div>
          </div>
        </div>

        {/* Section Images */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Images</h3>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">Cliquez pour uploader</span> ou glissez et déposez</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG ou GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageUpload} />
            </label>
          </div>
          {devis.images.length > 0 && (
            <div className="mt-2 grid grid-cols-6 gap-2">
              {devis.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(img)} alt={`Uploaded ${index + 1}`} className="w-full h-16 object-cover rounded" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détails du prix */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Détail du prix</h3>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Colonne 1 et 2 : Coûts détaillés */}
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 dark:bg-teal-900 p-3 rounded-lg">
                  <h4 className="font-medium text-teal-700 dark:text-teal-300 mb-2">Coûts de production</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Sertissage</span>
                      <span>{(coutsSertissage || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAO</span>
                      <span>{(prixCAO || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bijouterie</span>
                      <span>{(prixBijouterie || 0).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Coûts d'impression</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Résine</span>
                      <span>{(parseFloat(devis.tarifImpressionResine) || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cire</span>
                      <span>{(parseFloat(devis.tarifImpressionCire) || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fonte</span>
                      <span>{(parseFloat(devis.tarifFonte) || 0).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Finitions</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Gravure</span>
                      <span>{(prixGravure || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rhodiage</span>
                      <span>{(devis.rhodiage ? parametres.prixRhodiage : 0).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-3">Autres</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="remiseGenerale" className="text-sm font-medium">Remise générale</label>
                      <div className="flex items-center w-24">
                        <input
                          type="number"
                          id="remiseGenerale"
                          name="remiseGenerale"
                          value={devis.remiseGenerale || ''}
                          onChange={handleChange}
                          className={`${inputClass} w-16 text-right pr-1`}
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <span className="ml-1 text-sm">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="methodeLivraison" className="text-sm font-medium">Méthode de livraison</label>
                      <select 
                        id="methodeLivraison"
                        name="methodeLivraison" 
                        value={devis.methodeLivraison} 
                        onChange={handleChange} 
                        className={`${inputClass} w-40`}
                      >
                        <option value="">Sélectionner</option>
                        {Object.keys(parametres.prixLivraison).map(methode => (
                          <option key={methode} value={methode}>{methode}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Coût de livraison</span>
                      <span>{(devis.methodeLivraison ? parametres.prixLivraison[devis.methodeLivraison] || 0 : 0).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 3 : Récapitulatif */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Récapitulatif</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total HT</span>
                  <span className="font-medium">{(totalHT || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Remise</span>
                  <span>-{((totalHT || 0) * (parseFloat(devis.remiseGenerale) || 0) / 100).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total HT final</span>
                  <span>{(totalHT - ((totalHT || 0) * (parseFloat(devis.remiseGenerale) || 0) / 100)).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%)</span>
                  <span>{(totalTVA || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-300 dark:border-gray-500">
                  <span>Total TTC</span>
                  <span>{(totalTTC || 0).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div>
          <button type="submit" className={`${buttonClass} w-full`}>Créer le devis</button>
        </div>
      </form>
    </div>
  );
};

export default PageCreerDevis;