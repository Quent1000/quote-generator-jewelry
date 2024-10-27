// Fonction pour appliquer une marge
export const appliquerMarge = (montant, marge) => montant * (1 + marge / 100);

export const calculerTotalMetal = (devis, parametres) => {
  if (devis.metal && devis.poidsEstime) {
    const prixMetal = parametres.prixMetaux[devis.metal] || 0;
    return (parseFloat(devis.poidsEstime) * prixMetal) / 1000;
  }
  return 0;
};

export const calculerTotalDiamants = (devis, parametres) => {
  const total = devis.diamants.reduce((total, diamant) => total + parseFloat(diamant.prixTotalDiamants || 0), 0);
  return appliquerMarge(total, parametres.margeDiamantsRondsFournis || 0);
};

export const calculerTotalAutresPierres = (devis, parametres) => {
  const total = devis.autresPierres.reduce((total, pierre) => total + parseFloat(pierre.prixTotal || 0), 0);
  return appliquerMarge(total, parametres.margeAutresPierresFournis || 0);
};

export const calculerTotalGravureEtFinition = (devis, parametres) => {
  let total = 0;
  const options = devis.options || {};
  const prixPoincons = parametres?.prixPoincons || {};
  const prixMarque = prixPoincons.marque || {};
  const stylesGravure = parametres?.prixGravure || {};

  if (prixPoincons.poinconMaitre && options.poinconMaitre) {
    total += prixPoincons.poinconMaitre[options.poinconMaitre] || 0;
  }
  if (prixPoincons.poinconTitre && options.poinconTitre) {
    total += prixPoincons.poinconTitre[options.poinconTitre] || 0;
  }
  if (devis.gravure && devis.styleGravure && stylesGravure[devis.styleGravure]) {
    total += stylesGravure[devis.styleGravure];
  }
  if (options.gravureLogoMarque && prixMarque.gravureLogoMarque) {
    total += prixMarque.gravureLogoMarque;
  }
  if (options.gravureNumeroSerie && prixMarque.gravureNumeroSerie) {
    total += prixMarque.gravureNumeroSerie;
  }
  if (options.rhodiage && parametres.prixRhodiage) {
    total += parametres.prixRhodiage;
  }
  return appliquerMarge(total, parametres.margePoinconEtGravure || 0);
};

export const calculerTotalComposants = (devis, parametres) => {
  const totalFrequents = devis.composantsFrequents?.reduce((acc, c) => acc + parseFloat(c.prixTotal || c.prix || 0), 0) || 0;
  const totalLibres = devis.composantsLibres?.reduce((acc, c) => acc + parseFloat(c.prixTotal || c.prix || 0), 0) || 0;
  return appliquerMarge(totalFrequents + totalLibres, parametres.margeComposants || 0);
};

export const calculerTotalTemps = (devis, tauxHoraires, parametres) => {
  if (!tauxHoraires) {
    console.warn("tauxHoraires est undefined dans calculerTotalTemps");
    return 0;
  }
  const totalSansMarge = Object.entries(devis.tempsProduction).reduce((total, [type, temps]) => {
    const heures = (temps.heures || 0) + (temps.minutes || 0) / 60;
    return total + heures * (tauxHoraires[type] || 0);
  }, 0);
  return appliquerMarge(totalSansMarge, parametres.margeGlobale || 0);
};

export const calculerTotalImpression3DEtFonte = (devis, parametres) => {
  const tarifFonte = devis.tarifFonte === 'custom' ? parseFloat(devis.tarifFonteCustom || 0) : parseFloat(devis.tarifFonte || 0);
  const tarifImpressionCire = devis.tarifImpressionCire === 'custom' ? parseFloat(devis.tarifImpressionCireCustom || 0) : parseFloat(devis.tarifImpressionCire || 0);
  const tarifImpressionResine = devis.tarifImpressionResine === 'custom' ? parseFloat(devis.tarifImpressionResineCustom || 0) : parseFloat(devis.tarifImpressionResine || 0);
  
  const totalSansMarge = 
    tarifFonte * (devis.tarifFonteQuantite || 1) +
    tarifImpressionCire * (devis.tarifImpressionCireQuantite || 1) +
    tarifImpressionResine * (devis.tarifImpressionResineQuantite || 1);
  
  return appliquerMarge(totalSansMarge, parametres.margeGlobale || 0);
};

export const calculerFraisFontePalladium = (devis, parametres) => {
  if (devis.metal === "Or Gris Palladié" && devis.poidsEstime && parametres.fraisFontePalladium) {
    return parseFloat(devis.poidsEstime) * parseFloat(parametres.fraisFontePalladium);
  }
  return 0;
};

export const calculerTotalSertissage = (devis, parametres) => {
  const total = devis.diamants.reduce((acc, d) => acc + parseFloat(d.prixSertissage || 0), 0) +
                devis.autresPierres.reduce((acc, p) => acc + parseFloat(p.prixSertissage || 0), 0);
  return appliquerMarge(total, parametres.margeSertissage || 0);
};

export const calculerTotalAvantRemise = (devis, parametres, tauxHoraires) => {
  return calculerTotalDiamants(devis, parametres) +
         calculerTotalAutresPierres(devis, parametres) +
         calculerTotalGravureEtFinition(devis, parametres) +
         calculerTotalComposants(devis, parametres) +
         calculerTotalTemps(devis, tauxHoraires, parametres) +
         calculerTotalImpression3DEtFonte(devis, parametres) +
         calculerFraisFontePalladium(devis, parametres) +
         calculerTotalSertissage(devis, parametres) +
         parseFloat(devis.prixLivraison || 0); // Ajout du prix de la livraison
};

export const calculerTotalGeneral = (devis, parametres, tauxHoraires) => {
  const totalAvantRemise = calculerTotalAvantRemise(devis, parametres, tauxHoraires);
  return devis.remise.type === 'pourcentage'
    ? totalAvantRemise * (1 - devis.remise.valeur / 100)
    : totalAvantRemise - devis.remise.valeur;
};

export const calculerCoutFabricationNonMarge = (devis, parametres, tauxHoraires) => {
  return calculerTotalDiamants(devis, { ...parametres, margeDiamantsRondsFournis: 0 }) +
         calculerTotalAutresPierres(devis, { ...parametres, margeAutresPierresFournis: 0 }) +
         calculerTotalGravureEtFinition(devis, { ...parametres, margePoinconEtGravure: 0 }) +
         calculerTotalComposants(devis, { ...parametres, margeComposants: 0 }) +
         calculerTotalTemps(devis, tauxHoraires, { ...parametres, margeGlobale: 0 }) +
         calculerTotalImpression3DEtFonte(devis, { ...parametres, margeGlobale: 0 }) +
         calculerFraisFontePalladium(devis, parametres) +
         calculerTotalSertissage(devis, { ...parametres, margeSertissage: 0 }) +
         parseFloat(devis.prixLivraison || 0); // Ajout du prix de la livraison
};

export const calculerMarge = (devis, parametres, tauxHoraires) => {
  const totalGeneral = calculerTotalGeneral(devis, parametres, tauxHoraires);
  const coutFabricationNonMarge = calculerCoutFabricationNonMarge(devis, parametres, tauxHoraires);
  return totalGeneral - coutFabricationNonMarge;
};

export const calculateDevis = (devis, parametres) => {
  const tauxHoraires = {
    administratif: parametres.tauxHoraireAdministratif || 0,
    cao: parametres.tauxHoraireCAO || 0,
    bijouterie: parametres.tauxHoraireBijouterie || 0,
    joaillerie: parametres.tauxHoraireJoaillerie || 0,
    desertissage: parametres.tauxHoraireDesertissage || 0,
    design: parametres.tauxHoraireDesign || 0,
  };

  // Vérification supplémentaire
  if (Object.values(tauxHoraires).every(taux => taux === 0)) {
    console.warn("Tous les taux horaires sont à zéro dans calculateDevis");
  }

  const totalMetal = calculerTotalMetal(devis, parametres);
  const totalDiamants = calculerTotalDiamants(devis, parametres);
  const totalAutresPierres = calculerTotalAutresPierres(devis, parametres);
  const totalGravureEtFinition = calculerTotalGravureEtFinition(devis, parametres);
  const totalComposants = calculerTotalComposants(devis, parametres);
  const totalTemps = calculerTotalTemps(devis, tauxHoraires, parametres);
  const totalImpression3DEtFonte = calculerTotalImpression3DEtFonte(devis, parametres);
  const fraisFontePalladium = calculerFraisFontePalladium(devis, parametres);
  const totalSertissage = calculerTotalSertissage(devis, parametres);
  const totalGeneral = calculerTotalGeneral(devis, parametres, tauxHoraires);
  const coutFabricationNonMarge = calculerCoutFabricationNonMarge(devis, parametres, tauxHoraires);
  const marge = calculerMarge(devis, parametres, tauxHoraires);

  return {
    ...devis,
    totalMetal,
    totalDiamants,
    totalAutresPierres,
    totalGravureEtFinition,
    totalComposants,
    totalTemps,
    totalImpression3DEtFonte,
    fraisFontePalladium,
    totalSertissage,
    totalGeneral,
    coutFabricationNonMarge,
    marge
  };
};
