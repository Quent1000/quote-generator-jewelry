import React from 'react';
import CustomSelect from './CustomSelect';

const ResumeDevis = ({ devis, darkMode, clients, parametres, handleInputChange, tauxHoraires, handleRemiseChange }) => {
  // Supprimez l'état local de remise

  console.log("Clients dans ResumeDevis:", clients);
  console.log("ID du client sélectionné:", devis.client);

  const formatPrix = (prix) => `${parseFloat(prix || 0).toFixed(2)} €`;
  const formatTemps = (temps) => {
    const totalMinutes = Object.values(temps).reduce((acc, t) => acc + (t.heures || 0) * 60 + (t.minutes || 0), 0);
    const heures = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${heures}h ${minutes}min`;
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const inputClass = `p-2 border rounded ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const infos = client.informationsPersonnelles || {};
      const nomComplet = `${infos.prenom || ''} ${infos.nom || ''}`.trim();
      return client.entreprise?.nom ? `${nomComplet} - ${client.entreprise.nom}` : nomComplet || 'Nom non spécifié';
    }
    return 'Client non spécifié';
  };

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 pb-1 border-b border-gray-300 dark:border-gray-600">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div>
      <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="ml-2">{value || 'Non spécifié'}</span>
    </div>
  );

  const calculerTotalTemps = () => {
    const temps = devis.tempsProduction || {};
    return Object.entries(temps).reduce((total, [type, t]) => {
      const heures = (t.heures || 0) + (t.minutes || 0) / 60;
      const tauxHoraire = tauxHoraires[type] || 0;
      return total + heures * tauxHoraire;
    }, 0);
  };

  const calculerTotalSertissage = () => {
    const sertissageDiamants = devis.diamants.reduce((acc, d) => acc + (d.prixSertissage || 0), 0);
    const sertissageAutresPierres = devis.autresPierres.reduce((acc, p) => acc + (p.prixSertissage || 0), 0);
    return sertissageDiamants + sertissageAutresPierres;
  };

  const calculerTotalGeneral = () => {
    const coutMateriau = parseFloat(devis.valeurMetal) || 0;
    const coutPierres = (devis.diamants?.reduce((acc, d) => acc + (parseFloat(d.prixTotalDiamants) || 0), 0) || 0) +
                        (devis.autresPierres?.reduce((acc, p) => acc + (parseFloat(p.prixTotal) || 0), 0) || 0);
    const coutSertissage = calculerTotalSertissage();
    const coutProduction = calculerTotalTemps();
    const coutImpression = parseFloat(devis.tarifFonte || 0) + 
                           parseFloat(devis.tarifImpressionCire || 0) + 
                           parseFloat(devis.tarifImpressionResine || 0);
    const coutLivraison = parseFloat(devis.prixLivraison || 0);
    const coutComposants = calculerTotalComposants();

    const totalAvantRemise = coutMateriau + coutPierres + coutSertissage + coutProduction + coutImpression + coutLivraison + coutComposants;
    
    // Calcul de la remise
    let remiseAmount = 0;
    if (devis.remise.type === 'pourcentage') {
      remiseAmount = totalAvantRemise * (devis.remise.valeur / 100);
    } else {
      remiseAmount = devis.remise.valeur;
    }

    return totalAvantRemise - remiseAmount;
  };

  const handleRemiseInputChange = (e) => {
    const { name, value } = e.target;
    handleRemiseChange(name === 'type' ? value : devis.remise.type, name === 'valeur' ? value : devis.remise.valeur);
  };

  const calculerTotalComposants = () => {
    console.log("Composants fréquents:", devis.composantsFrequents);
    console.log("Composants libres:", devis.composantsLibres);
    
    const totalFrequents = devis.composantsFrequents?.reduce((acc, c) => acc + (parseFloat(c.prix) || 0), 0) || 0;
    const totalLibres = devis.composantsLibres?.reduce((acc, c) => acc + (parseFloat(c.prix) || 0), 0) || 0;
    
    const total = totalFrequents + totalLibres;
    console.log("Total calculé:", total);
    return total;
  };

  console.log("Composants fréquents:", devis.composantsFrequents);
  console.log("Composants libres:", devis.composantsLibres);
  console.log("Total composants:", calculerTotalComposants());

  return (
    <div className={`${bgClass} ${textClass} shadow-lg rounded-xl p-6 border ${borderClass}`}>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Résumé du Devis
      </h2>
      
      <Section title="Informations et détails">
        <InfoItem label="Client" value={getClientName(devis.client)} />
        <InfoItem label="Titre du devis" value={devis.titreDevis} />
        <InfoItem label="Catégorie" value={devis.categorie} />
        <InfoItem label="Sous-catégorie" value={devis.sousCategorie} />
        <InfoItem label="Métal" value={devis.metal} />
        <InfoItem label="Poids estimé" value={devis.poidsEstime ? `${devis.poidsEstime} g` : null} />
        <InfoItem label="Taille" value={devis.taille} />
        <InfoItem label="Description" value={devis.description} />
      </Section>

      <Section title="Temps de production">
        <InfoItem label="Temps total" value={formatTemps(devis.tempsProduction)} />
        <InfoItem label="Coût total" value={formatPrix(calculerTotalTemps())} />
      </Section>

      <Section title="Diamants et pierres">
        <div className="col-span-2">
          <h4 className="font-semibold mb-2">Diamants ronds</h4>
          {devis.diamants.map((diamant, index) => (
            <div key={index} className="mb-1 text-sm">
              <span>{diamant.taille}mm</span>
              <span className="mx-1">|</span>
              <span>Qté: {diamant.qte}</span>
              <span className="mx-1">|</span>
              <span>Fourni par: {diamant.fourniPar}</span>
              <span className="mx-1">|</span>
              <span>Sertissage: {diamant.sertissage}</span>
            </div>
          ))}
          <InfoItem label="Total prix diamants" value={formatPrix(devis.diamants.reduce((acc, d) => acc + (d.prixTotalDiamants || 0), 0))} />
        </div>
        <div className="col-span-2 mt-4">
          <h4 className="font-semibold mb-2">Autres pierres</h4>
          {devis.autresPierres.map((pierre, index) => (
            <div key={index} className="mb-1 text-sm">
              <span>{pierre.forme}</span>
              <span className="mx-1">|</span>
              <span>{pierre.type}</span>
              <span className="mx-1">|</span>
              <span>Qté: {pierre.qte}</span>
              <span className="mx-1">|</span>
              <span>Taille: {pierre.dimension}</span>
              <span className="mx-1">|</span>
              <span>Sertissage: {pierre.sertissage}</span>
            </div>
          ))}
          <InfoItem label="Total prix autres pierres" value={formatPrix(devis.autresPierres.reduce((acc, p) => acc + (p.prixTotal || 0), 0))} />
        </div>
        <InfoItem label="Total prix sertissage" value={formatPrix(calculerTotalSertissage())} />
      </Section>

      <Section title="Impression 3D et Fonte">
        <InfoItem label="Tarif fonte" value={formatPrix(devis.tarifFonte === 'custom' ? devis.tarifFonteCustom : devis.tarifFonte)} />
        <InfoItem label="Tarif impression cire" value={formatPrix(devis.tarifImpressionCire === 'custom' ? devis.tarifImpressionCireCustom : devis.tarifImpressionCire)} />
        <InfoItem label="Tarif impression résine / Prototypage" value={formatPrix(devis.tarifImpressionResine === 'custom' ? devis.tarifImpressionResineCustom : devis.tarifImpressionResine)} />
      </Section>

      <Section title="Composants">
        <InfoItem label="Composants fréquents" value={devis.composantsFrequents?.length || 0} />
        <InfoItem label="Composants libres" value={devis.composantsLibres?.length || 0} />
        <InfoItem 
          label="Total composants" 
          value={formatPrix(calculerTotalComposants())}
        />
      </Section>

      <Section title="Livraison">
        <div className="col-span-2">
          <CustomSelect
            options={(parametres?.prixLivraison ? Object.entries(parametres.prixLivraison) : []).map(([type, prix]) => ({
              value: type,
              label: `${type} - ${prix}€`
            }))}
            value={devis.typeLivraison || ''}
            onChange={(value) => {
              handleInputChange('typeLivraison', value);
              handleInputChange('prixLivraison', parametres?.prixLivraison?.[value] || 0);
            }}
            className="w-full p-2 border rounded"
            darkMode={darkMode}
          />
        </div>
        <InfoItem label="Prix livraison" value={formatPrix(devis.prixLivraison)} />
      </Section>

      <Section title="Remise">
        <div className="col-span-2 flex items-center space-x-4">
          <select
            name="type"
            value={devis.remise.type}
            onChange={handleRemiseInputChange}
            className={inputClass}
          >
            <option value="pourcentage">Pourcentage</option>
            <option value="montant">Montant fixe</option>
          </select>
          <input
            type="number"
            name="valeur"
            value={devis.remise.valeur}
            onChange={handleRemiseInputChange}
            className={`${inputClass} w-24`}
            step="0.01"
            min="0"
          />
          <span>{devis.remise.type === 'pourcentage' ? '%' : '€'}</span>
        </div>
      </Section>

      <div className="mt-8 bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-2">Total Général</h3>
        <p className="text-3xl text-center font-bold text-teal-600 dark:text-teal-300">
          {formatPrix(calculerTotalGeneral())}
        </p>
        {devis.remise.valeur > 0 && (
          <p className="text-center text-sm mt-2">
            (Remise appliquée : {devis.remise.type === 'pourcentage' ? `${devis.remise.valeur}%` : formatPrix(devis.remise.valeur)})
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeDevis;