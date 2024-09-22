import React, { useState, useEffect } from 'react';

const PageCreerDevis = ({ darkMode }) => {
  const [devis, setDevis] = useState({
    numero: '',
    client: '',
    titre: '',
    description: '',
    categorieBijou: '',
    metal: '',
    taille: '',
    gravure: '',
    poincon: false,
    dessertissage: false,
    rhodiage: false,
    temps: {
      administratif: { heures: 0, minutes: 0 },
      CAO: { heures: 0, minutes: 0 },
      repare: { heures: 0, minutes: 0 },
      polissage: { heures: 0, minutes: 0 },
      dessertissage: { heures: 0, minutes: 0 }
    },
    tarifFonte: '',
    tarifImpressionCire: '',
    tarifImpressionResine: '',
    methodeLivraison: '',
    remiseGenerale: '',
    imagePrincipale: null,
    galerie: [],
    diamants: []
  });

  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

  const clients = [
    { id: 1, nom: 'david gusky', societe: 'DAVIDOR' },
    { id: 2, nom: 'Quentin Imhoff', societe: 'TGN409' }
  ];

  const categoriesBijoux = [
    'Bague', 'Collier / Pendentif', 'Boucle d\'oreille', 'Bracelet', 'Autres'
  ];

  const metaux = ['JAUNE', 'GRIS', 'GPD', 'ROUGE 5N', 'ROSE 4N'];

  const methodesLivraison = ['Sur site', 'VD la poste', 'DHL', 'Fedex'];

  useEffect(() => {
    const nouveauNumero = `DEV-${Date.now()}`;
    setDevis(prev => ({ ...prev, numero: nouveauNumero }));
  }, []);

  const typesSertissage = [
    'Serti grain', 'Serti rail', 'Serti copeaux', 'Serti clos', 'Serti descendu', 'Serti masse'
  ];

  const taillesDiamant = [
    '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0',
    '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '3.0', '3.1', '3.2'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDevis(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTimeChange = (type, unit, value) => {
    setDevis(prev => ({
      ...prev,
      temps: {
        ...prev.temps,
        [type]: {
          ...prev.temps[type],
          [unit]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleDiamantAdd = () => {
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, { taille: '', quantite: 0, sertissage: '' }]
    }));
  };

  const handleDiamantChange = (index, field, value) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.map((diamant, i) => 
        i === index ? { ...diamant, [field]: value } : diamant
      )
    }));
  };

  const handleDiamantRemove = (index) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.filter((_, i) => i !== index)
    }));
  };

  const parseTimeToMinutes = (timeString) => {
    const match = timeString.match(/^(\d+)(?:h|H)?(?:(\d+)(?:m|M)?)?$/);
    if (match) {
      const hours = parseInt(match[1] || 0);
      const minutes = parseInt(match[2] || 0);
      return hours * 60 + minutes;
    }
    return 0;
  };

  const formatMinutesToTime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours && mins) return `${hours}h${mins}`;
    if (hours) return `${hours}h`;
    return `${mins}min`;
  };

  const handleTarifChange = (e, field) => {
    const { value } = e.target;
    setDevis(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setDevis(prev => ({ ...prev, imagePrincipale: e.target.files[0] }));
    }
  };

  const handleGalerieChange = (e) => {
    if (e.target.files) {
      setDevis(prev => ({ ...prev, galerie: [...prev.galerie, ...e.target.files] }));
    }
  };

  useEffect(() => {
    // Logique de calcul des totaux
    const sousTotal = 1000; // À remplacer par votre calcul réel
    const remise = sousTotal * (parseFloat(devis.remiseGenerale) / 100);
    const ht = sousTotal - remise;
    const tva = ht * 0.2; // Supposons une TVA de 20%
    setTotalHT(ht);
    setTotalTVA(tva);
    setTotalTTC(ht + tva);
  }, [devis]);

  const inputClass = `w-full p-2 border rounded ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : 'border-gray-300'} focus:border-teal-500 focus:ring focus:ring-teal-200`;
  const labelClass = 'block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300';
  const buttonClass = 'bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

  return (
    <div className={`p-4 ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-gray-50'}`}>
      <h2 className="text-2xl font-bold mb-4 text-teal-700 dark:text-teal-300">Nouveau devis - {devis.numero}</h2>
      <form className="grid grid-cols-3 gap-4">
        {/* Colonne 1 */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Client</label>
            <select name="client" value={devis.client} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nom} de {client.societe}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Titre du devis</label>
            <input type="text" name="titre" value={devis.titre} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={devis.description} onChange={handleChange} className={inputClass} rows="3"></textarea>
          </div>
          <div>
            <label className={labelClass}>Catégorie du bijou</label>
            <select name="categorieBijou" value={devis.categorieBijou} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner une catégorie</option>
              {categoriesBijoux.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Colonne 2 */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Métal</label>
            <select name="metal" value={devis.metal} onChange={handleChange} className={inputClass}>
              <option value="">Sélectionner un métal</option>
              {metaux.map(metal => (
                <option key={metal} value={metal}>{metal}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Taille</label>
            <input type="text" name="taille" value={devis.taille} onChange={handleChange} className={inputClass} placeholder="Ex: 54, 18cm, 45cm..." />
          </div>
          <div>
            <label className={labelClass}>Gravure</label>
            <input type="text" name="gravure" value={devis.gravure} onChange={handleChange} className={inputClass} placeholder="Texte à graver..." />
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" name="poincon" checked={devis.poincon} onChange={handleChange} className="mr-2" />
              <span className="text-sm">Poinçon</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="dessertissage" checked={devis.dessertissage} onChange={handleChange} className="mr-2" />
              <span className="text-sm">Dé-ssertissage</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="rhodiage" checked={devis.rhodiage} onChange={handleChange} className="mr-2" />
              <span className="text-sm">Rhodiage</span>
            </label>
          </div>
          <div>
            <label className={labelClass}>Image principale</label>
            <input type="file" onChange={handleImageChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Galerie d'images</label>
            <input type="file" multiple onChange={handleGalerieChange} className={inputClass} />
          </div>
        </div>

        {/* Colonne 3 */}
        <div className="space-y-4">
          {['Administratif', 'CAO', 'Repare', 'Polissage', 'Dessertissage'].map((type) => (
            <div key={type} className={type === 'Dessertissage' && !devis.dessertissage ? 'hidden' : ''}>
              <label className={labelClass}>{`Temps ${type}`}</label>
              <input
                type="text"
                value={formatMinutesToTime(devis[`temps${type}`])}
                onChange={(e) => handleTimeChange(e, `temps${type}`)}
                className={inputClass}
                placeholder="ex: 1h30, 45min"
              />
            </div>
          ))}
          {['Fonte', 'ImpressionCire', 'ImpressionResine'].map((type) => (
            <div key={type}>
              <label className={labelClass}>{`Tarif ${type.replace(/([A-Z])/g, ' $1').trim()}`}</label>
              <input
                type="text"
                value={devis[`tarif${type}`]}
                onChange={(e) => handleTarifChange(e, `tarif${type}`)}
                className={inputClass}
                placeholder="Entrez le montant"
              />
            </div>
          ))}
        </div>

{/* Détails du prix */}
<div className="col-span-3 mt-4">
          <h3 className="text-lg font-semibold mb-2">Détails du prix</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Remise générale (%)</label>
              <input
                type="number"
                name="remiseGenerale"
                value={devis.remiseGenerale}
                onChange={handleChange}
                className={inputClass}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className={labelClass}>Méthode de livraison</label>
              <select
                name="methodeLivraison"
                value={devis.methodeLivraison}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Sélectionner une méthode</option>
                {methodesLivraison.map(methode => (
                  <option key={methode} value={methode}>{methode}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 bg-gray-100 p-4 rounded dark:bg-gray-700">
            <div className="flex justify-between">
              <span>Total HT</span>
              <span>{totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Remise générale</span>
              <span>{(totalHT * (parseFloat(devis.remiseGenerale) / 100)).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Total HT final</span>
              <span>{(totalHT - (totalHT * (parseFloat(devis.remiseGenerale) / 100))).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>TVA</span>
              <span>{totalTVA.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="col-span-3 mt-4">
          <button type="submit" className={buttonClass}>
            Créer le devis
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageCreerDevis;