export const calculateDevis = (devis, parametres) => {
  // Implémentez ici toutes les fonctions de calcul de ResumeDevis.js
  // Par exemple :
  const calculerTotalMetal = (devis, parametres) => {
    if (devis.metal && devis.poidsEstime) {
      const prixMetal = parametres.prixMetaux[devis.metal] || 0;
      // Le prix du métal est généralement en euros par gramme
      // Assurez-vous que poidsEstime est en grammes
      return (parseFloat(devis.poidsEstime) * prixMetal) / 1000; // Divisé par 1000 si le prix est par kilo
    }
    return 0;
  };

  const calculerTotalDiamants = () => {
    // ... logique de calcul
    return devis.diamants.reduce((total, diamant) => total + parseFloat(diamant.prixTotal || 0), 0);
  };

  // ... autres fonctions de calcul

  // Calculez toutes les valeurs
  const totalMetal = calculerTotalMetal(devis, parametres);
  const totalDiamants = calculerTotalDiamants();
  // ... autres calculs

  const calculerTotalGravureEtFinition = (devis, parametres) => {
    let total = 0;
    const options = devis.options || {};
    const prixPoincons = parametres?.prixPoincons || {};
    const prixMarque = prixPoincons.marque || {};
    const stylesGravure = parametres?.prixGravure || {};

    // Vérifiez si prixPoincons.poinconMaitre existe avant d'y accéder
    if (prixPoincons.poinconMaitre && options.poinconMaitre) {
      total += prixPoincons.poinconMaitre[options.poinconMaitre] || 0;
    }

    // Vérifiez si prixPoincons.poinconTitre existe avant d'y accéder
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

  const totalGravureEtFinition = calculerTotalGravureEtFinition(devis, parametres);

  // Retournez un nouvel objet avec les valeurs calculées
  return {
    ...devis,
    totalMetal,
    totalDiamants,
    totalGravureEtFinition,
    // Ne calculez pas totalGravureEtFinitionAvecMarge ici
  };
};