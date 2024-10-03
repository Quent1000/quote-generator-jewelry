import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const ResumeDevis = ({ devis, darkMode }) => {
  const formatTemps = (temps) => temps ? `${temps.heures || 0}h ${temps.minutes || 0}min` : '0h 0min';
  const formatPrix = (prix) => `${parseFloat(prix).toFixed(2)} €`;

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const calculerTotalTemps = () => {
    const temps = devis.tempsProduction || {};
    return Object.values(temps).reduce((total, t) => total + (t.heures || 0) + (t.minutes || 0) / 60, 0);
  };

  const calculerTotalPrix = () => {
    // Ajoutez ici la logique pour calculer le prix total
    return 0; // Placeholder
  };

  const InfoItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-1 text-sm">
      <span className="font-medium">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <ChevronRightIcon className="h-5 w-5 mr-1" />
        {title}
      </h3>
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{children}</div>
    </div>
  );

  const PierresSummary = ({ pierres, title }) => (
    <div className="mb-2">
      <h4 className="font-semibold mb-1">{title} ({pierres.length})</h4>
      {pierres.map((pierre, index) => (
        <div key={index} className="text-xs mb-1">
          {pierre.taille && `${pierre.taille}mm `}
          {pierre.forme && `${pierre.forme} `}
          {pierre.type && `${pierre.type} `}
          ({pierre.qte}) - {pierre.sertissage || 'Non serti'}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${bgClass} ${textClass} shadow-lg rounded-xl px-4 py-6 mb-4 border ${borderClass}`}>
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Résumé du Devis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Informations Générales">
          <InfoItem label="Client" value={devis.client || 'Non spécifié'} />
          <InfoItem label="Catégorie" value={`${devis.categorie || 'Non spécifiée'} ${devis.sousCategorie ? `- ${devis.sousCategorie}` : ''}`} />
          <InfoItem label="Métal" value={devis.metal || 'Non spécifié'} />
          <InfoItem label="Poids estimé" value={devis.poidsEstime ? `${devis.poidsEstime} g` : 'Non spécifié'} />
        </Section>
        
        <Section title="Pierres et Composants">
          <PierresSummary pierres={devis.diamants} title="Diamants" />
          <PierresSummary pierres={devis.autresPierres} title="Autres pierres" />
          <InfoItem label="Composants fréquents" value={devis.composantsFrequents?.length || 0} />
          <InfoItem label="Composants libres" value={devis.composantsLibres?.length || 0} />
        </Section>
      </div>

      <Section title="Temps de Production">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(devis.tempsProduction || {}).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-xs uppercase">{key}</p>
              <p className="font-bold">{formatTemps(value)}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 text-right">
          <span className="font-semibold">Total: </span>
          <span className="font-bold">{formatTemps({ heures: Math.floor(calculerTotalTemps()), minutes: Math.round((calculerTotalTemps() % 1) * 60) })}</span>
        </div>
      </Section>

      <div className="mt-4 bg-gradient-to-r from-teal-500 to-blue-500 p-4 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-2">Récapitulatif Financier</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <InfoItem label="Coût des matériaux" value={formatPrix(devis.valeurMetal || 0)} />
          <InfoItem label="Coût des pierres" value={formatPrix(/* calculer le coût total des pierres */)} />
          <InfoItem label="Coût des composants" value={formatPrix(/* calculer le coût total des composants */)} />
          <InfoItem label="Coût de production" value={formatPrix(/* calculer le coût de production basé sur le temps */)} />
        </div>
        <div className="mt-2 text-right">
          <span className="font-semibold">Total Estimé: </span>
          <span className="text-xl font-bold">{formatPrix(calculerTotalPrix())}</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeDevis;