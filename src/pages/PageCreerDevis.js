import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const PageCreerDevis = () => {
  const { darkMode } = useAppContext();
  const [clients, setClients] = useState([]);
  const [devis, setDevis] = useState({
    client: '',
    categorie: '',
    metal: '',
    titreDevis: '',
    taille: '',
    poidsEstime: '',
    description: '',
    gravure: '',
    styleGravure: '',
    options: {
      poinconEtat: false,
      deSertissage: false,
      rhodiage: false
    },
    commentaireInterne: '',
    diamants: [{ taille: '', qte: 0, fourniPar: 'TGN 409', sertissage: 'Serti grain' }],
    autresPierres: [{ forme: '', dimension: '', type: '', prix: 0, carat: 0, fourniPar: 'TGN 409', qte: 1 }],
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

  useEffect(() => {
    const fetchClients = async () => {
      const clientsSnapshot = await getDocs(collection(db, 'clients'));
      const clientsList = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(clientsList);
    };

    fetchClients();
  }, []);

  const handleInputChange = (field, value) => {
    setDevis(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionsChange = (option) => {
    setDevis(prev => ({
      ...prev,
      options: { ...prev.options, [option]: !prev.options[option] }
    }));
  };

  const handleDiamantsChange = (index, field, value) => {
    const newDiamants = [...devis.diamants];
    newDiamants[index][field] = value;
    setDevis(prev => ({ ...prev, diamants: newDiamants }));
  };

  const handleAutresPierresChange = (index, field, value) => {
    const newAutresPierres = [...devis.autresPierres];
    newAutresPierres[index][field] = value;
    setDevis(prev => ({ ...prev, autresPierres: newAutresPierres }));
  };

  const handleAddDiamant = () => {
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, { taille: '', qte: 0, fourniPar: 'TGN 409', sertissage: 'Serti grain' }]
    }));
  };

  const handleAddAutrePierre = () => {
    setDevis(prev => ({
      ...prev,
      autresPierres: [...prev.autresPierres, { forme: '', dimension: '', type: '', prix: 0, carat: 0, fourniPar: 'TGN 409', qte: 1 }]
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

  return (
    <div className={`min-h-screen ${bgClass} p-8`}>
      <h1 className="text-3xl font-bold mb-8">Nouveau devis - {/* Générer un ID unique */}</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Client</label>
          <select
            value={devis.client}
            onChange={(e) => handleInputChange('client', e.target.value)}
            className={inputClass}
          >
            <option value="">Sélectionner un client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.nom} {client.prenom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Catégorie</label>
          <input
            type="text"
            value={devis.categorie}
            onChange={(e) => handleInputChange('categorie', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Métal</label>
          <input
            type="text"
            value={devis.metal}
            onChange={(e) => handleInputChange('metal', e.target.value)}
            className={inputClass}
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
          />
        </div>
        <div>
          <label className="block mb-2">Poids estimé</label>
          <input
            type="text"
            value={devis.poidsEstime}
            onChange={(e) => handleInputChange('poidsEstime', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <input
            type="text"
            value={devis.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Gravure</label>
          <input
            type="text"
            value={devis.gravure}
            onChange={(e) => handleInputChange('gravure', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-2">Style de gravure</label>
          <input
            type="text"
            value={devis.styleGravure}
            onChange={(e) => handleInputChange('styleGravure', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-2">Options</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.poinconEtat}
              onChange={() => handleOptionsChange('poinconEtat')}
              className="mr-2"
            />
            <label>Poinçon état</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.deSertissage}
              onChange={() => handleOptionsChange('deSertissage')}
              className="mr-2"
            />
            <label>De sertissage</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={devis.options.rhodiage}
              onChange={() => handleOptionsChange('rhodiage')}
              className="mr-2"
            />
            <label>Rhodiage</label>
          </div>
        </div>
        <div>
          <label className="block mb-2">Commentaire interne</label>
          <textarea
            value={devis.commentaireInterne}
            onChange={(e) => handleInputChange('commentaireInterne', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Diamants</h2>
        {devis.diamants.map((diamant, index) => (
          <div key={index} className="flex mb-4 space-x-4">
            <input
              type="text"
              className={`${inputClass} flex-grow`}
              placeholder="Taille"
              value={diamant.taille}
              onChange={(e) => handleDiamantsChange(index, 'taille', e.target.value)}
            />
            <input
              type="number"
              className={`${inputClass} w-24`}
              placeholder="Qté"
              value={diamant.qte}
              onChange={(e) => handleDiamantsChange(index, 'qte', parseInt(e.target.value))}
            />
            <input
              type="text"
              className={`${inputClass} w-32`}
              placeholder="Fourni par"
              value={diamant.fourniPar}
              onChange={(e) => handleDiamantsChange(index, 'fourniPar', e.target.value)}
            />
            <input
              type="text"
              className={`${inputClass} w-32`}
              placeholder="Sertissage"
              value={diamant.sertissage}
              onChange={(e) => handleDiamantsChange(index, 'sertissage', e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleAddDiamant}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
        >
          Ajouter un diamant
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Autres pierres</h2>
        {devis.autresPierres.map((pierre, index) => (
          <div key={index} className="flex mb-4 space-x-4">
            <input
              type="text"
              className={`${inputClass} flex-grow`}
              placeholder="Forme"
              value={pierre.forme}
              onChange={(e) => handleAutresPierresChange(index, 'forme', e.target.value)}
            />
            <input
              type="text"
              className={`${inputClass} w-24`}
              placeholder="Dimension"
              value={pierre.dimension}
              onChange={(e) => handleAutresPierresChange(index, 'dimension', e.target.value)}
            />
            <input
              type="text"
              className={`${inputClass} w-32`}
              placeholder="Type"
              value={pierre.type}
              onChange={(e) => handleAutresPierresChange(index, 'type', e.target.value)}
            />
            <input
              type="number"
              className={`${inputClass} w-32`}
              placeholder="Prix"
              value={pierre.prix}
              onChange={(e) => handleAutresPierresChange(index, 'prix', parseFloat(e.target.value))}
            />
            <input
              type="number"
              className={`${inputClass} w-32`}
              placeholder="Carat"
              value={pierre.carat}
              onChange={(e) => handleAutresPierresChange(index, 'carat', parseFloat(e.target.value))}
            />
            <input
              type="text"
              className={`${inputClass} w-32`}
              placeholder="Fourni par"
              value={pierre.fourniPar}
              onChange={(e) => handleAutresPierresChange(index, 'fourniPar', e.target.value)}
            />
            <input
              type="number"
              className={`${inputClass} w-32`}
              placeholder="Qté"
              value={pierre.qte}
              onChange={(e) => handleAutresPierresChange(index, 'qte', parseInt(e.target.value))}
            />
          </div>
        ))}
        <button
          onClick={handleAddAutrePierre}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
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
    </div>
  );
};

export default PageCreerDevis;