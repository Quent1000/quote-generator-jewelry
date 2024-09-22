import React, { useState, useEffect } from 'react';
import PriceInput from './PriceInput';
import TimeInputSeparate from './TimeInputSeparate';

const PageCreerDevis = ({ darkMode }) => {
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
    imagePrincipale: null,
    galerie: [],
    diamants: [{ taille: '', quantite: 0, sertissage: '', fournisseur: 'TGN 409' }],
    poidsEstime: ''
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

  const methodesLivraison = ['Sur site', 'VD la poste', 'DHL', 'Fedex'];

  

  const typesSertissage = [
    'Serti grain', 'Serti rail', 'Serti copeaux', 'Serti clos', 'Serti descendu', 'Serti masse'
  ];

  const taillesDiamant = [
    '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0',
    '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '3.0', '3.1', '3.2'
  ];

  const [autresPierres, setAutresPierres] = useState([{
    forme: '',
    dimension: '',
    type: '',
    prix: '',
    caratage: ''
  }]);

  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDevis(prev => {
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
    setDevis(prev => ({
      ...prev,
      diamants: [...prev.diamants, { taille: '', quantite: 0, sertissage: '' }]
    }));
  };

  const handleDiamantChange = (index, field, value) => {
    setDevis(prev => ({
      ...prev,
      diamants: prev.diamants.map((diamant, i) => 
        i === index ? { ...diamant, [field]: field === 'quantite' ? parseInt(value) || 0 : value } : diamant
      )
    }));
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

//  const formatTime = (timeObj) => {
//    const { hours, minutes } = timeObj;
//    if (hours === 0 && minutes === 0) return '0min';
//    if (hours === 0) return `${minutes}min`;
//    if (minutes === 0) return `${hours}h`;
//    return `${hours}h${minutes}min`;
//  };
  

useEffect(() => {
  const calculerPrixDiamants = () => {
    return devis.diamants.reduce((total, diamant) => {
      // Logique de calcul du prix des diamants
      return total + (diamant.quantite * 100); // Prix fictif, à ajuster
    }, 0);
  };

  const calculerPrixAutresPierres = () => {
    return autresPierres.reduce((total, pierre) => {
      return total + parseFloat(pierre.prix || 0);
    }, 0);
  };
  

  const prixMetal = (devis.poidsEstime || 0) * 50; // Prix fictif au gramme, à ajuster

  const sousTotal = calculerPrixDiamants() + calculerPrixAutresPierres() + prixMetal;
  const remise = sousTotal * (parseFloat(devis.remiseGenerale) / 100);
  const ht = sousTotal - remise;
  const tva = ht * 0.2; // TVA de 20%
  setTotalHT(ht);
  setTotalTVA(tva);
  setTotalTTC(ht + tva);
}, [devis, autresPierres]);

  const inputClass = `w-full p-2 border rounded ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring focus:ring-teal-200`;
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
  <label className={labelClass}>Commentaire privé</label>
  <textarea
    name="commentairePrivé"
    value={devis.commentairePrivé}
    onChange={handleChange}
    className={`${inputClass} h-24`}
    placeholder="Commentaire visible uniquement en interne"
  ></textarea>
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
          <div>
  <label className={labelClass}>Poids estimé du métal (g)</label>
  <input
    type="number"
    name="poidsEstime"
    value={devis.poidsEstime || ''}
    onChange={handleChange}
    className={inputClass}
    min="0"
    step="0.1"
  />
  
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
  <label className={labelClass}>Diamants</label>
  <div className="grid grid-cols-5 gap-2 mb-2 font-bold">
  <div>Taille</div>
  <div>Quantité</div>
  <div>Fourni par</div>
  <div>Sertissage</div>
  <div></div>
</div>
  {devis.diamants.map((diamant, index) => (
    <div key={index} className="grid grid-cols-5 gap-2 mb-2">
      <select
        value={diamant.taille}
        onChange={(e) => handleDiamantChange(index, 'taille', e.target.value)}
        className={inputClass}
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
        placeholder="Quantité"
        className={inputClass}
        min="0"
      />
      <select
        value={diamant.fournisseur}
        onChange={(e) => handleDiamantChange(index, 'fournisseur', e.target.value)}
        className={inputClass}
      >
        <option value="TGN 409">TGN 409</option>
        <option value="Client">Client</option>
      </select>
      <select
        value={diamant.sertissage}
        onChange={(e) => handleDiamantChange(index, 'sertissage', e.target.value)}
        className={inputClass}
      >
        <option value="">Type de sertissage</option>
        {typesSertissage.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      {devis.diamants.length > 1 && (
        <button 
          onClick={() => handleDiamantRemove(index)} 
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          type="button"
        >
          Supprimer
        </button>
      )}
    </div>
  ))}
  <button 
    onClick={handleDiamantAdd} 
    className={`${buttonClass} mt-2`}
    type="button"
  >
    Ajouter un diamant
  </button>
</div>
<div>
  <label className={labelClass}>Autres Pierres</label>
  <div className="grid grid-cols-6 gap-2 mb-2 font-bold">
    <div>Forme</div>
    <div>Dimension</div>
    <div>Type</div>
    <div>Prix</div>
    <div>Caratage</div>
    <div></div>
  </div>
  {autresPierres.map((pierre, index) => (
    <div key={index} className="grid grid-cols-6 gap-2 mb-2">
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
        placeholder="Dimension"
        className={inputClass}
      />
      <select
        value={pierre.type}
        onChange={(e) => handleAutrePierreChange(index, 'type', e.target.value)}
        className={inputClass}
      >
        <option value="">Type de pierre</option>
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
        placeholder="Caratage"
        className={inputClass}
      />
      {autresPierres.length > 1 && (
        <button 
          onClick={() => setAutresPierres(prev => prev.filter((_, i) => i !== index))}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          type="button"
        >
          Supprimer
        </button>
      )}
    </div>
  ))}
  <button 
    onClick={() => setAutresPierres(prev => [...prev, { forme: '', dimension: '', type: '', prix: '', caratage: '' }])}
    className={`${buttonClass} mt-2`}
    type="button"
  >
    Ajouter une autre pierre
  </button>
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
        {['Administratif', 'CAO', 'Repare', 'Polissage', 'Dessertissage'].map((type) => {
  const lowercaseType = type.toLowerCase();
  const timeValue = devis.temps[lowercaseType] || { hours: 0, minutes: 0 };
  
  return (
    <div key={type} className={type === 'Dessertissage' && !devis.dessertissage ? 'hidden' : ''}>
      <label className={labelClass}>{`Temps ${type}`}</label>
      <TimeInputSeparate
        name={`temps${type}`}
        hours={timeValue.hours}
        minutes={timeValue.minutes}
        onChange={handleChange}
        darkMode={darkMode}
      />
    </div>
  );
})}
          {['Fonte', 'ImpressionCire', 'ImpressionResine'].map((type) => (
  <div key={type}>
    <label className={labelClass}>{`Tarif ${type.replace(/([A-Z])/g, ' $1').trim()}`}</label>
    <PriceInput
      name={`tarif${type}`}
      value={devis[`tarif${type}`]}
      onChange={handleChange}
      darkMode={darkMode}
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