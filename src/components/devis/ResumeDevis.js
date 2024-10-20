import React, { useCallback, useMemo, useState } from 'react';
import CustomSelect from './CustomSelect';
import {
  calculerTotalMetal,
  calculerTotalDiamants,
  calculerTotalAutresPierres,
  calculerTotalGravureEtFinition,
  calculerTotalComposants,
  calculerTotalTemps,
  calculerTotalImpression3DEtFonte,
  calculerFraisFontePalladium,
  calculerTotalSertissage,
  calculerTotalGeneral,
  calculerCoutFabricationNonMarge,
  calculerMarge
} from '../../utils/devisUtils';

const ResumeDevis = React.memo(({ devis, darkMode, clients, parametres, handleInputChange, tauxHoraires, handleRemiseChange, handleSubmit, isEditing }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  console.log("ResumeDevis props:", { devis, darkMode, clients, parametres, tauxHoraires });

  const formatPrix = useCallback((prix) => `${parseFloat(prix || 0).toFixed(2)} €`, []);
  const formatTemps = useCallback((minutes) => {
    const heures = Math.floor(minutes / 60);
    const minutesRestantes = minutes % 60;
    return `${heures}h ${minutesRestantes}min`;
  }, []);

  // Utiliser useMemo pour les calculs
  const calculatedValues = useMemo(() => {
    if (!tauxHoraires) {
      console.warn("tauxHoraires est undefined dans ResumeDevis");
      return null;
    }

    return {
      totalTemps: calculerTotalTemps(devis, tauxHoraires, parametres),
      totalSertissage: calculerTotalSertissage(devis, parametres),
      totalGravureEtFinition: calculerTotalGravureEtFinition(devis, parametres),
      totalComposants: calculerTotalComposants(devis, parametres),
      fraisFontePalladium: calculerFraisFontePalladium(devis, parametres),
      totalImpression3DEtFonte: calculerTotalImpression3DEtFonte(devis, parametres),
      totalGeneral: calculerTotalGeneral(devis, parametres, tauxHoraires),
      coutFabricationNonMarge: calculerCoutFabricationNonMarge(devis, parametres, tauxHoraires),
      marge: calculerMarge(devis, parametres, tauxHoraires),
      totalMetal: calculerTotalMetal(devis, parametres)
    };
  }, [devis, tauxHoraires, parametres]);

  if (!calculatedValues) {
    return null; // ou affichez un message de chargement
  }

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';

  const inputClass = `w-full p-2 border rounded ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const infos = client.informationsPersonnelles || {};
      const nomComplet = `${infos.prenom || ''} ${infos.nom || ''}`.trim();
      return client.entreprise?.nom ? `${nomComplet} - ${client.entreprise.nom}` : nomComplet || 'À remplir';
    }
    return 'À sélectionner';
  };

  const Section = ({ title, children }) => (
    <div className="mb-6 bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
      <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-gray-800 dark:text-gray-200">
        {value === 'Non spécifié' || value === 'Non défini' ? 'À remplir' : value}
      </span>
    </div>
  );

  const calculerTempsTotal = () => {
    const temps = devis.tempsProduction || {};
    return Object.values(temps).reduce((total, t) => {
      return total + (t.heures || 0) * 60 + (t.minutes || 0);
    }, 0);
  };

  const renderComposants = (composants, titre) => (
    <div className="col-span-2">
      <h4 className="font-semibold mb-2">{titre}</h4>
      {composants.map((composant, index) => (
        <div key={index} className="text-sm flex justify-between">
          <span>{composant.description || composant.nom}</span>
          <span>{formatPrix(composant.prixTotal || composant.prix)}</span>
        </div>
      ))}
    </div>
  );

  const TruncatedText = ({ text, maxLength = 150 }) => {
    if (!text) return <p>Aucune description fournie</p>;
    if (text.length <= maxLength) return <p className="whitespace-pre-wrap">{text}</p>;
    
    return (
      <div>
        <p className="whitespace-pre-wrap">
          {showFullDescription ? text : `${text.substring(0, maxLength)}...`}
        </p>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-2 text-teal-500 hover:text-teal-600 underline focus:outline-none"
        >
          {showFullDescription ? 'Voir moins' : 'Voir plus'}
        </button>
      </div>
    );
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg ${bgClass} ${textClass}`}>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Résumé du Devis
      </h2>
      
      {!isEditing && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg">
          <p>Ce devis est en cours de création. Les champs marqués "À remplir" doivent être complétés avant la finalisation.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Informations générales">
          <InfoItem label="Client" value={getClientName(devis.client)} />
          <InfoItem label="Titre du devis" value={devis.titreDevis || 'À remplir'} />
          <InfoItem label="Catégorie" value={devis.categorie || 'À remplir'} />
          <InfoItem label="Sous-catégorie" value={devis.sousCategorie || 'À remplir'} />
          <InfoItem 
            label="Créé par" 
            value={devis.createdByUser ? `${devis.createdByUser.prenom} ${devis.createdByUser.nom}` : 'En attente de création'} 
          />
          <InfoItem 
            label="Date de création" 
            value={devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : 'En attente de création'} 
          />
        </Section>

        <Section title="Détails du produit">
          <InfoItem label="Métal" value={devis.metal} />
          <InfoItem label="Poids estimé" value={devis.poidsEstime ? `${devis.poidsEstime} g` : null} />
          <InfoItem label="Taille" value={devis.taille} />
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Description:</h4>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <TruncatedText text={devis.description} />
            </div>
          </div>
        </Section>

        <Section title="Temps de production">
          <div className="space-y-2">
            {Object.entries(devis.tempsProduction).map(([type, temps]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type}:</span>
                <span>{`${temps.heures}h ${temps.minutes}min`}</span>
              </div>
            ))}
            <div className="font-semibold mt-2">
              <span>Total temps:</span>
              <span className="float-right">{formatTemps(calculerTempsTotal())}</span>
            </div>
            <div className="font-semibold">
              <span>Coût total:</span>
              <span className="float-right">{formatPrix(calculatedValues.totalTemps)}</span>
            </div>
          </div>
        </Section>

        <Section title="Diamants et pierres">
          <div className="space-y-3">
            <h4 className="font-semibold">Diamants ronds</h4>
            {devis.diamants.map((diamant, index) => (
              <div key={index} className="text-sm">
                {`${diamant.taille}mm | Qté: ${diamant.qte} | ${diamant.fourniPar} | ${diamant.sertissage}`}
              </div>
            ))}
            <InfoItem label="Total diamants" value={formatPrix(calculerTotalDiamants(devis, parametres))} />
            
            <h4 className="font-semibold mt-4">Autres pierres</h4>
            {devis.autresPierres.map((pierre, index) => (
              <div key={index} className="text-sm">
                {`${pierre.forme} ${pierre.type} | Qté: ${pierre.qte} | Taille: ${pierre.dimension || pierre.taille} | ${pierre.sertissage}`}
              </div>
            ))}
            <InfoItem label="Total autres pierres" value={formatPrix(calculerTotalAutresPierres(devis, parametres))} />
            <InfoItem label="Total sertissage" value={formatPrix(calculatedValues.totalSertissage)} />
          </div>
        </Section>

        <Section title="Impression 3D et Fonte">
          <InfoItem 
            label="Tarif fonte" 
            value={formatPrix(devis.tarifFonte === 'custom' ? devis.tarifFonteCustom : devis.tarifFonte)} 
          />
          <InfoItem 
            label="Tarif impression cire" 
            value={formatPrix(devis.tarifImpressionCire === 'custom' ? devis.tarifImpressionCireCustom : devis.tarifImpressionCire)} 
          />
          <InfoItem 
            label="Tarif impression résine" 
            value={formatPrix(devis.tarifImpressionResine === 'custom' ? devis.tarifImpressionResineCustom : devis.tarifImpressionResine)} 
          />
          {devis.metal === "Or Gris Palladié" && (
            <InfoItem 
              label="Frais fonte palladium" 
              value={formatPrix(calculatedValues.fraisFontePalladium)} 
            />
          )}
          <InfoItem 
            label="Total" 
            value={formatPrix(calculatedValues.totalImpression3DEtFonte + calculatedValues.fraisFontePalladium)} 
          />
        </Section>

        <Section title="Composants">
          <div className="space-y-4">
            {renderComposants(devis.composantsFrequents, "Composants fréquents")}
            {renderComposants(devis.composantsLibres, "Composants libres")}
            <InfoItem label="Total composants" value={formatPrix(calculatedValues.totalComposants)} />
          </div>
        </Section>

        <Section title="Gravure et Finition">
          {devis.gravure && devis.styleGravure && (
            <InfoItem 
              label="Gravure" 
              value={`${devis.gravure} - ${devis.styleGravure === 'custom' ? 'Prix personnalisé' : devis.styleGravure} (${formatPrix(devis.styleGravure === 'custom' ? devis.prixGravureCustom : parametres.prixGravure[devis.styleGravure])})`} 
            />
          )}
          {devis.options.rhodiage && <InfoItem label="Rhodiage" value={formatPrix(parametres.prixRhodiage)} />}
          {devis.options.gravureLogoMarque && (
            <InfoItem label="Gravure logo marque" value={formatPrix(parametres.prixPoincons.marque.gravureLogoMarque)} />
          )}
          {devis.options.gravureNumeroSerie && (
            <InfoItem label="Gravure numéro de série" value={formatPrix(parametres.prixPoincons.marque.gravureNumeroSerie)} />
          )}
          {devis.options.poinconMaitre && (
            <InfoItem 
              label="Poinçon maître" 
              value={`${devis.options.poinconMaitre === 'gravureLaser' ? 'Gravure laser' : 'Frappe'} - ${formatPrix(parametres.prixPoincons.poinconMaitre[devis.options.poinconMaitre])}`} 
            />
          )}
          {devis.options.poinconTitre && (
            <InfoItem 
              label="Poinçon titre" 
              value={`${devis.options.poinconTitre === 'gravureLaser' ? 'Gravure laser' : 'Frappe'} - ${formatPrix(parametres.prixPoincons.poinconTitre[devis.options.poinconTitre])}`} 
            />
          )}
          <InfoItem label="Total Gravure et Finition" value={formatPrix(calculatedValues.totalGravureEtFinition)} />
        </Section>
      </div>

      <Section title="Livraison">
        <div className="mb-4">
          <CustomSelect
            options={[
              { value: '', label: 'Sélectionner la méthode de livraison' },
              ...(parametres?.prixLivraison ? Object.entries(parametres.prixLivraison) : []).map(([type, prix]) => ({
                value: type,
                label: `${type} - ${prix}€`
              }))
            ]}
            value={devis.typeLivraison || ''}
            onChange={(value) => {
              handleInputChange('typeLivraison', value);
              handleInputChange('prixLivraison', value ? parametres?.prixLivraison?.[value] || 0 : 0);
            }}
            className={inputClass}
            darkMode={darkMode}
            isScrollable={true}
            maxHeight={200}
          />
        </div>
        <InfoItem label="Prix livraison" value={formatPrix(devis.prixLivraison)} />
      </Section>

      <Section title="Remise">
        <div className="flex items-center space-x-4">
          <select
            name="type"
            value={devis.remise.type}
            onChange={(e) => handleRemiseChange(e.target.value, devis.remise.valeur)}
            className={inputClass}
          >
            <option value="pourcentage">Pourcentage</option>
            <option value="montant">Montant fixe</option>
          </select>
          <input
            type="number"
            name="valeur"
            value={devis.remise.valeur}
            onChange={(e) => handleRemiseChange(devis.remise.type, e.target.value)}
            className={`${inputClass} w-24`}
            step="0.01"
            min="0"
          />
          <span>{devis.remise.type === 'pourcentage' ? '%' : '€'}</span>
        </div>
      </Section>

      <div className="mt-8 bg-teal-100 dark:bg-teal-900 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-center mb-6">Récapitulatif final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-lg font-semibold mb-2">Total Général</p>
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-300">
              {formatPrix(calculatedValues.totalGeneral)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-lg font-semibold mb-2">Marge Totale</p>
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-300">
              {formatPrix(calculatedValues.marge)}
            </p>
          </div>
        </div>
        {devis.remise.valeur > 0 && (
          <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-lg font-semibold mb-2">Remise appliquée</p>
            <p className="text-xl font-bold text-red-500">
              {devis.remise.type === 'pourcentage'
                ? `${devis.remise.valeur}%`
                : formatPrix(devis.remise.valeur)}
            </p>
          </div>
        )}
        <div className="mt-6 space-y-2">
          <InfoItem
            label="Coût de fabrication non margé"
            value={formatPrix(calculatedValues.coutFabricationNonMarge)}
          />
          <InfoItem
            label="Prix total du métal (non facturé)"
            value={formatPrix(calculatedValues.totalMetal)}
          />
          <InfoItem
            label="Prix de la livraison"
            value={formatPrix(devis.prixLivraison)}
          />
        </div>
      </div>


      <div className="mt-8">
        <button
          onClick={handleSubmit}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            darkMode
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          {isEditing ? 'Mettre à jour le devis' : 'Créer le devis'}
        </button>
      </div>
    </div>
  );
});

export default ResumeDevis;
