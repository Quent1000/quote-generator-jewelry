import React, { useEffect, useMemo, useCallback } from 'react';
import CustomSelect from './CustomSelect';

const ResumeDevis = React.memo(({ devis, darkMode, clients, parametres, handleInputChange, tauxHoraires, handleRemiseChange, handleSubmit }) => {
  console.log("ResumeDevis props:", { devis, darkMode, clients, parametres, tauxHoraires });

  const formatPrix = useCallback((prix) => `${parseFloat(prix || 0).toFixed(2)} €`, []);
  const formatTemps = useCallback((minutes) => {
    const heures = Math.floor(minutes / 60);
    const minutesRestantes = minutes % 60;
    return `${heures}h ${minutesRestantes}min`;
  }, []);

  const calculerTotalTemps = useCallback(() => {
    return Object.entries(devis.tempsProduction).reduce((total, [type, temps]) => {
      const heures = (temps.heures || 0) + (temps.minutes || 0) / 60;
      return total + heures * (tauxHoraires[type] || 0);
    }, 0);
  }, [devis.tempsProduction, tauxHoraires]);

  const calculerTotalSertissage = useCallback(() => {
    return devis.diamants.reduce((acc, d) => acc + parseFloat(d.prixSertissage || 0), 0) +
           devis.autresPierres.reduce((acc, p) => acc + parseFloat(p.prixSertissage || 0), 0);
  }, [devis.diamants, devis.autresPierres]);

  const calculerTotalGravureEtFinition = useCallback(() => {
    return parseFloat(devis.totalGravureEtFinition || 0);
  }, [devis.totalGravureEtFinition]);

  const calculerTotalComposants = useCallback(() => {
    const totalFrequents = devis.composantsFrequents?.reduce((acc, c) => acc + parseFloat(c.prixTotal || c.prix || 0), 0) || 0;
    const totalLibres = devis.composantsLibres?.reduce((acc, c) => acc + parseFloat(c.prixTotal || c.prix || 0), 0) || 0;
    return totalFrequents + totalLibres;
  }, [devis.composantsFrequents, devis.composantsLibres]);

  const calculerFraisFontePalladium = useCallback(() => {
    if (devis.metal === "Or Gris Palladié" && devis.poidsEstime && parametres.fraisFontePalladium) {
      return parseFloat(devis.poidsEstime) * parseFloat(parametres.fraisFontePalladium);
    }
    return 0;
  }, [devis.metal, devis.poidsEstime, parametres.fraisFontePalladium]);

  const calculerTotalImpression3DEtFonte = useCallback(() => {
    return parseFloat(devis.tarifFonte || 0) +
           parseFloat(devis.tarifImpressionCire || 0) +
           parseFloat(devis.tarifImpressionResine || 0);
  }, [devis.tarifFonte, devis.tarifImpressionCire, devis.tarifImpressionResine]);

  const calculerTotalDiamantsAvecMarge = useCallback(() => {
    const totalDiamants = devis.diamants.reduce((acc, d) => acc + (parseFloat(d.prixTotalDiamants) || 0), 0);
    return totalDiamants * (1 + (parametres.margeDiamantsRondsFournis || 0) / 100);
  }, [devis.diamants, parametres.margeDiamantsRondsFournis]);

  const calculerTotalAutresPierresAvecMarge = useCallback(() => {
    const totalAutresPierres = devis.autresPierres.reduce((acc, p) => acc + (parseFloat(p.prixTotal) || 0), 0);
    return totalAutresPierres * (1 + parametres.margeAutresPierresFournis / 100);
  }, [devis.autresPierres, parametres.margeAutresPierresFournis]);

  const calculerTotalSertissageAvecMarge = useCallback(() => {
    return calculerTotalSertissage() * (1 + parametres.margeSertissage / 100);
  }, [calculerTotalSertissage, parametres.margeSertissage]);

  const calculerTotalComposantsAvecMarge = useCallback(() => {
    return calculerTotalComposants() * (1 + parametres.margeComposants / 100);
  }, [calculerTotalComposants, parametres.margeComposants]);

  const calculerTotalAutresPrestations = useCallback(() => {
    const totalTemps = calculerTotalTemps();
    const totalImpression = calculerTotalImpression3DEtFonte();
    console.log("Total temps:", totalTemps);
    console.log("Total impression 3D et fonte:", totalImpression);
    const total = (totalTemps + totalImpression) * (1 + parametres.margeGlobale / 100);
    console.log("Total autres prestations:", total);
    return total;
  }, [calculerTotalTemps, calculerTotalImpression3DEtFonte, parametres.margeGlobale]);

  const calculerTotalGravureEtFinitionAvecMarge = useCallback(() => {
    return calculerTotalGravureEtFinition() * (1 + parametres.margePoinconEtGravure / 100);
  }, [calculerTotalGravureEtFinition, parametres.margePoinconEtGravure]);

  const calculerTotalGeneral = useCallback(() => {
    const totalDiamantsAvecMarge = calculerTotalDiamantsAvecMarge();
    const totalAutresPierresAvecMarge = calculerTotalAutresPierresAvecMarge();
    const totalSertissageAvecMarge = calculerTotalSertissageAvecMarge();
    const totalComposantsAvecMarge = calculerTotalComposantsAvecMarge();
    const totalGravureEtFinitionAvecMarge = calculerTotalGravureEtFinitionAvecMarge();
    const totalAutresPrestations = calculerTotalAutresPrestations();
    const fraisFontePalladium = calculerFraisFontePalladium();
    const coutLivraison = parseFloat(devis.prixLivraison || 0);

    console.log('Calcul du total général:');
    console.log('Total diamants avec marge:', totalDiamantsAvecMarge);
    console.log('Total autres pierres avec marge:', totalAutresPierresAvecMarge);
    console.log('Total sertissage avec marge:', totalSertissageAvecMarge);
    console.log('Total composants avec marge:', totalComposantsAvecMarge);
    console.log('Total gravure et finition avec marge:', totalGravureEtFinitionAvecMarge);
    console.log('Total autres prestations:', totalAutresPrestations);
    console.log('Frais fonte palladium:', fraisFontePalladium);
    console.log('Coût livraison:', coutLivraison);

    const total = totalDiamantsAvecMarge +
                  totalAutresPierresAvecMarge +
                  totalSertissageAvecMarge +
                  totalComposantsAvecMarge +
                  totalGravureEtFinitionAvecMarge +
                  totalAutresPrestations +
                  fraisFontePalladium +
                  coutLivraison;

    console.log('Total avant remise:', total);

    let remiseAmount = 0;
    if (devis.remise.type === 'pourcentage') {
      remiseAmount = total * (devis.remise.valeur / 100);
    } else {
      remiseAmount = parseFloat(devis.remise.valeur || 0);
    }

    console.log('Montant de la remise:', remiseAmount);

    const totalGeneral = total - remiseAmount;
    console.log('Total général final:', totalGeneral);

    return totalGeneral;
  }, [
    calculerTotalDiamantsAvecMarge,
    calculerTotalAutresPierresAvecMarge,
    calculerTotalSertissageAvecMarge,
    calculerTotalComposantsAvecMarge,
    calculerTotalGravureEtFinitionAvecMarge,
    calculerTotalAutresPrestations,
    calculerFraisFontePalladium,
    devis.prixLivraison,
    devis.remise
  ]);

  const calculerCoutFabricationNonMarge = useCallback(() => {
    return (
      parseFloat(devis.totalDiamants || 0) +
      parseFloat(devis.totalAutresPierres || 0) +
      calculerTotalSertissage() +
      calculerTotalComposants() +
      calculerTotalGravureEtFinition() +
      calculerTotalTemps() +
      calculerTotalImpression3DEtFonte() +
      (devis.metal === "Or Gris Palladié" ? calculerFraisFontePalladium() : 0) +
      parseFloat(devis.prixLivraison || 0)
    );
  }, [devis, calculerTotalSertissage, calculerTotalComposants, calculerTotalGravureEtFinition, calculerTotalTemps, calculerTotalImpression3DEtFonte, calculerFraisFontePalladium]);

  const calculerMarge = useCallback(() => {
    const totalGeneral = calculerTotalGeneral();
    const coutFabricationNonMarge = calculerCoutFabricationNonMarge();
    console.log("Total général:", totalGeneral);
    console.log("Coût de fabrication non margé:", coutFabricationNonMarge);
    return totalGeneral - coutFabricationNonMarge;
  }, [calculerTotalGeneral, calculerCoutFabricationNonMarge]);

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
      return client.entreprise?.nom ? `${nomComplet} - ${client.entreprise.nom}` : nomComplet || 'Nom non spécifié';
    }
    return 'Client non spécifié';
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
      <span className="text-gray-800 dark:text-gray-200">{value || 'Non spécifié'}</span>
    </div>
  );

  const calculerTempsTotal = () => {
    const temps = devis.tempsProduction || {};
    return Object.values(temps).reduce((total, t) => {
      return total + (t.heures || 0) * 60 + (t.minutes || 0);
    }, 0);
  };

  // Utilisez useMemo pour mémoriser le résultat
  const totalComposants = useMemo(() => calculerTotalComposants(), [calculerTotalComposants]);

  console.log("Composants fréquents:", devis.composantsFrequents);
  console.log("Composants libres:", devis.composantsLibres);
  console.log("Total composants:", totalComposants);

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

  useEffect(() => {
    // Définir la date de validité à 30 jours à partir de la date actuelle si elle n'est pas déjà définie
    if (!devis.validUntil) {
      const defaultValidUntil = new Date();
      defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);
      handleInputChange('validUntil', defaultValidUntil.toISOString().split('T')[0]);
    }
  }, [devis.validUntil, handleInputChange]);

  useEffect(() => {
    console.log("Devis mis à jour dans ResumeDevis:", devis);
  }, [devis]);

  useEffect(() => {
    console.log("ResumeDevis - devis:", devis);
    console.log("ResumeDevis - parametres:", parametres);
    console.log("ResumeDevis - options de livraison:", parametres?.prixLivraison);
  }, [devis, parametres]);

  useEffect(() => {
    console.log("Devis mis à jour:", devis);
    console.log("Coût de fabrication non margé:", calculerCoutFabricationNonMarge());
    console.log("Total général:", calculerTotalGeneral());
    console.log("Marge totale:", calculerMarge());
  }, [devis, calculerCoutFabricationNonMarge, calculerTotalGeneral, calculerMarge]);

  useEffect(() => {
    console.log("Devis mis à jour dans ResumeDevis:", devis);
    const totalGeneral = calculerTotalGeneral();
    const marge = calculerMarge();
    console.log("Total général recalculé:", totalGeneral);
    console.log("Marge recalculée:", marge);
  }, [devis, calculerTotalGeneral, calculerMarge]);

  return (
    <div className={`p-6 rounded-xl shadow-lg ${bgClass} ${textClass}`}>
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Résumé du Devis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Informations générales">
          <InfoItem label="Client" value={getClientName(devis.client)} />
          <InfoItem label="Titre du devis" value={devis.titreDevis} />
          <InfoItem label="Catégorie" value={devis.categorie} />
          <InfoItem label="Sous-catégorie" value={devis.sousCategorie} />
        </Section>

        <Section title="Détails du produit">
          <InfoItem label="Métal" value={devis.metal} />
          <InfoItem label="Poids estimé" value={devis.poidsEstime ? `${devis.poidsEstime} g` : null} />
          <InfoItem label="Taille" value={devis.taille} />
          <InfoItem label="Description" value={devis.description} />
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
              <span className="float-right">{formatPrix(calculerTotalTemps())}</span>
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
            <InfoItem label="Total diamants" value={formatPrix(calculerTotalDiamantsAvecMarge())} />
            
            <h4 className="font-semibold mt-4">Autres pierres</h4>
            {devis.autresPierres.map((pierre, index) => (
              <div key={index} className="text-sm">
                {`${pierre.forme} ${pierre.type} | Qté: ${pierre.qte} | Taille: ${pierre.dimension} | ${pierre.sertissage}`}
              </div>
            ))}
            <InfoItem label="Total autres pierres" value={formatPrix(calculerTotalAutresPierresAvecMarge())} />
            <InfoItem label="Total sertissage" value={formatPrix(calculerTotalSertissageAvecMarge())} />
          </div>
        </Section>

        <Section title="Impression 3D et Fonte">
          <InfoItem label="Tarif fonte" value={formatPrix(devis.tarifFonte)} />
          <InfoItem label="Tarif impression cire" value={formatPrix(devis.tarifImpressionCire)} />
          <InfoItem label="Tarif impression résine" value={formatPrix(devis.tarifImpressionResine)} />
          <InfoItem label="Total" value={formatPrix(calculerTotalImpression3DEtFonte())} />
        </Section>

        <Section title="Composants">
          <div className="space-y-4">
            {renderComposants(devis.composantsFrequents, "Composants fréquents")}
            {renderComposants(devis.composantsLibres, "Composants libres")}
            <InfoItem label="Total composants" value={formatPrix(calculerTotalComposantsAvecMarge())} />
          </div>
        </Section>

        <Section title="Gravure et Finition">
          {devis.gravure && devis.styleGravure && (
            <InfoItem 
              label="Gravure" 
              value={`${devis.gravure} - ${devis.styleGravure} (${formatPrix(parametres.prixGravure[devis.styleGravure])})`} 
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
          <InfoItem label="Total Gravure et Finition" value={formatPrix(calculerTotalGravureEtFinitionAvecMarge())} />
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
              {formatPrix(calculerTotalGeneral())}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-lg font-semibold mb-2">Marge Totale</p>
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-300">
              {formatPrix(calculerMarge())}
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
            value={formatPrix(calculerCoutFabricationNonMarge())}
          />
          <InfoItem
            label="Prix total du métal (non facturé)"
            value={formatPrix(devis.totalMetal)}
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <InfoItem label="Coût de fabrication non margé" value={formatPrix(calculerCoutFabricationNonMarge())} />
        <InfoItem label="Prix total du métal (non facturé)" value={formatPrix(devis.totalMetal)} />
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
          Créer le devis
        </button>
      </div>
    </div>
  );
});

export default ResumeDevis;