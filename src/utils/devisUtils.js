export const calculateDevis = (devis, parametres) => {
  const calculerTotalMetal = (devis, parametres) => {
    if (devis.metal && devis.poidsEstime) {
      const prixMetal = parametres.prixMetaux[devis.metal] || 0;
      return (parseFloat(devis.poidsEstime) * prixMetal) / 1000;
    }
    return 0;
  };

  const calculerTotalDiamants = (devis) => {
    return devis.diamants.reduce((total, diamant) => total + parseFloat(diamant.prixTotalDiamants || 0), 0);
  };

  const calculerTotalAutresPierres = (devis) => {
    return devis.autresPierres.reduce((total, pierre) => total + parseFloat(pierre.prixTotal || 0), 0);
  };

  const calculerTotalGravureEtFinition = (devis, parametres) => {
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
    return total;
  };

  const calculerTotalComposants = (devis) => {
    const totalFrequents = devis.composantsFrequents?.reduce((acc, c) => acc + parseFloat(c.prixTotal || c.prix || 0), 0) || 0;
    const totalLibres = devis.composantsLibres?.reduce((acc, c) => acc + parseFloat(c.prixTotal || c.prix || 0), 0) || 0;
    return totalFrequents + totalLibres;
  };

  const calculerTotalTemps = (devis, tauxHoraires) => {
    if (!tauxHoraires) {
      console.warn("tauxHoraires est undefined dans calculerTotalTemps");
      return 0;
    }
    return Object.entries(devis.tempsProduction).reduce((total, [type, temps]) => {
      const heures = (temps.heures || 0) + (temps.minutes || 0) / 60;
      return total + heures * (tauxHoraires[type] || 0);
    }, 0);
  };

  const calculerTotalImpression3DEtFonte = (devis) => {
    const tarifFonte = devis.tarifFonte === 'custom' ? parseFloat(devis.tarifFonteCustom || 0) : parseFloat(devis.tarifFonte || 0);
    const tarifImpressionCire = devis.tarifImpressionCire === 'custom' ? parseFloat(devis.tarifImpressionCireCustom || 0) : parseFloat(devis.tarifImpressionCire || 0);
    const tarifImpressionResine = devis.tarifImpressionResine === 'custom' ? parseFloat(devis.tarifImpressionResineCustom || 0) : parseFloat(devis.tarifImpressionResine || 0);
    return tarifFonte + tarifImpressionCire + tarifImpressionResine;
  };

  const calculerFraisFontePalladium = (devis, parametres) => {
    if (devis.metal === "Or Gris Palladié" && devis.poidsEstime && parametres.fraisFontePalladium) {
      return parseFloat(devis.poidsEstime) * parseFloat(parametres.fraisFontePalladium);
    }
    return 0;
  };

  const totalMetal = calculerTotalMetal(devis, parametres);
  const totalDiamants = calculerTotalDiamants(devis);
  const totalAutresPierres = calculerTotalAutresPierres(devis);
  const totalGravureEtFinition = calculerTotalGravureEtFinition(devis, parametres);
  const totalComposants = calculerTotalComposants(devis);
  const totalTemps = calculerTotalTemps(devis, parametres.tauxHoraires);
  const totalImpression3DEtFonte = calculerTotalImpression3DEtFonte(devis);
  const fraisFontePalladium = calculerFraisFontePalladium(devis, parametres);

  const totalGeneral = totalMetal + totalDiamants + totalAutresPierres + totalGravureEtFinition + totalComposants + totalTemps + totalImpression3DEtFonte + fraisFontePalladium;

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
    totalGeneral
  };
};