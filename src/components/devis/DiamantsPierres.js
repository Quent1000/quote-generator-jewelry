import React, { useEffect } from 'react';
import CustomSelect from './CustomSelect';

const DiamantsPierres = ({ 
  devis, 
  handleDiamantsChange, 
  handleAutresPierresChange, 
  handleAddDiamant, 
  handleRemoveDiamant, 
  handleAddAutrePierre, 
  handleRemoveAutrePierre, 
  calculerPrixDiamants, 
  calculerPrixSertissage, 
  calculerPrixAutresPierres, 
  calculerPrixSertissageAutresPierres,
  darkMode,
  diametresEtCarats,
  formesPierres,
  typesPierres,
  parametres
}) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const diamantOptions = [
    { value: '', label: 'Sélectionner un diamètre' },
    ...Object.entries(diametresEtCarats).map(([taille, carat]) => ({
      value: taille,
      label: `ø ${taille} mm (${carat} ct)`
    }))
  ];

  const sertissageOptions = Object.keys(parametres.prixSertissage || {}).map(type => ({
    value: type,
    label: type
  }));

  const fournisseurOptions = [
    { value: 'TGN 409', label: 'TGN 409' },
    { value: 'Client', label: 'Client' }
  ];

  useEffect(() => {
    calculerPrixDiamants();
    calculerPrixSertissage();
    calculerPrixAutresPierres();
    calculerPrixSertissageAutresPierres();
  }, [devis.diamants, devis.autresPierres, calculerPrixDiamants, calculerPrixSertissage, calculerPrixAutresPierres, calculerPrixSertissageAutresPierres]);

  const handleDiamantChange = (index, field, value) => {
    const updatedDiamant = { ...devis.diamants[index], [field]: value };
    
    if (field === 'taille') {
      updatedDiamant.carat = diametresEtCarats[value] || 0;
      updatedDiamant.prixUnitaire = parametres.prixDiamantsRonds[value] || 0;
    }

    // Calcul du prix total
    if (updatedDiamant.fourniPar === 'Client') {
      updatedDiamant.prixTotal = 0;
    } else {
      updatedDiamant.prixTotal = updatedDiamant.carat * updatedDiamant.prixUnitaire * updatedDiamant.qte * parametres.coefficientDiamantsRonds;
    }

    // Calcul du prix de sertissage
    if (updatedDiamant.sertissage) {
      updatedDiamant.prixSertissage = (parametres.prixSertissage[updatedDiamant.sertissage] || 0) * updatedDiamant.qte;
    } else {
      updatedDiamant.prixSertissage = 0;
    }

    handleDiamantsChange(index, field, value);
  };

  const handleAutrePierreChange = (index, field, value) => {
    const updatedPierre = { ...devis.autresPierres[index], [field]: value };

    // Calcul du prix total
    if (updatedPierre.fourniPar === 'Client') {
      updatedPierre.prixTotal = 0;
    } else {
      updatedPierre.prixTotal = updatedPierre.prix * updatedPierre.qte;
    }

    // Calcul du prix de sertissage
    if (updatedPierre.sertissage) {
      updatedPierre.prixSertissage = (parametres.prixSertissage[updatedPierre.sertissage] || 0) * updatedPierre.qte;
    } else {
      updatedPierre.prixSertissage = 0;
    }

    handleAutresPierresChange(index, field, value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Diamants et Pierres</h2>
      
      {/* Section Diamants */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Diamants Ronds</h3>
        {devis.diamants.map((diamant, index) => (
          <div key={index} className="flex flex-wrap -mx-2 mb-4">
            <div className="w-1/6 px-2">
              <label className="block mb-2">Taille (mm)</label>
              <CustomSelect
                options={diamantOptions}
                value={diamant.taille}
                onChange={(value) => handleDiamantChange(index, 'taille', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Quantité</label>
              <input
                type="number"
                value={diamant.qte}
                onChange={(e) => handleDiamantChange(index, 'qte', parseInt(e.target.value))}
                className={inputClass}
                min="0"
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Fourni par</label>
              <CustomSelect
                options={fournisseurOptions}
                value={diamant.fourniPar}
                onChange={(value) => handleDiamantChange(index, 'fourniPar', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Sertissage</label>
              <CustomSelect
                options={sertissageOptions}
                value={diamant.sertissage}
                onChange={(value) => handleDiamantChange(index, 'sertissage', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Prix unitaire</label>
              <input
                type="number"
                value={diamant.prixUnitaire}
                onChange={(e) => handleDiamantChange(index, 'prixUnitaire', parseFloat(e.target.value))}
                className={inputClass}
                step="0.01"
                readOnly={diamant.fourniPar === 'Client'}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Prix total</label>
              <input
                type="number"
                value={diamant.prixTotal}
                className={`${inputClass} bg-gray-100`}
                readOnly
              />
            </div>
            <div className="w-1/6 px-2 mt-2">
              <label className="block mb-2">Coût sertissage</label>
              <input
                type="number"
                value={diamant.prixSertissage}
                className={`${inputClass} bg-gray-100`}
                readOnly
              />
            </div>
            <div className="w-1/6 px-2 mt-2">
              <button
                onClick={() => handleRemoveDiamant(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddDiamant}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors mt-2"
        >
          Ajouter un diamant
        </button>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Total prix diamants</label>
            <input
              type="text"
              value={`${calculerPrixDiamants().toFixed(2)} €`}
              readOnly
              className={`${inputClass} w-full bg-gray-100`}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Total prix sertissage diamants</label>
            <input
              type="text"
              value={`${calculerPrixSertissage().toFixed(2)} €`}
              readOnly
              className={`${inputClass} w-full bg-gray-100`}
            />
          </div>
        </div>
      </div>

      {/* Section Autres Pierres */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Autres Pierres</h3>
        {devis.autresPierres.map((pierre, index) => (
          <div key={index} className="flex flex-wrap -mx-2 mb-4">
            <div className="w-1/6 px-2">
              <label className="block mb-2">Forme</label>
              <CustomSelect
                options={formesPierres.map(forme => ({ value: forme, label: forme }))}
                value={pierre.forme}
                onChange={(value) => handleAutrePierreChange(index, 'forme', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Type</label>
              <CustomSelect
                options={typesPierres.map(type => ({ value: type, label: type }))}
                value={pierre.type}
                onChange={(value) => handleAutrePierreChange(index, 'type', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Taille</label>
              <input
                type="text"
                value={pierre.taille}
                onChange={(e) => handleAutrePierreChange(index, 'taille', e.target.value)}
                className={inputClass}
                placeholder="ex: 5x3mm"
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Quantité</label>
              <input
                type="number"
                value={pierre.qte}
                onChange={(e) => handleAutrePierreChange(index, 'qte', parseInt(e.target.value))}
                className={inputClass}
                min="0"
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Fourni par</label>
              <CustomSelect
                options={fournisseurOptions}
                value={pierre.fourniPar}
                onChange={(value) => handleAutrePierreChange(index, 'fourniPar', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2">
              <label className="block mb-2">Sertissage</label>
              <CustomSelect
                options={sertissageOptions}
                value={pierre.sertissage}
                onChange={(value) => handleAutrePierreChange(index, 'sertissage', value)}
                className={inputClass}
                darkMode={darkMode}
              />
            </div>
            <div className="w-1/6 px-2 mt-2">
              <label className="block mb-2">Prix unitaire</label>
              <input
                type="number"
                value={pierre.prix}
                onChange={(e) => handleAutrePierreChange(index, 'prix', parseFloat(e.target.value))}
                className={inputClass}
                step="0.01"
                readOnly={pierre.fourniPar === 'Client'}
              />
            </div>
            <div className="w-1/6 px-2 mt-2">
              <label className="block mb-2">Prix total</label>
              <input
                type="number"
                value={pierre.prixTotal}
                className={`${inputClass} bg-gray-100`}
                readOnly
              />
            </div>
            <div className="w-1/6 px-2 mt-2">
              <label className="block mb-2">Coût sertissage</label>
              <input
                type="number"
                value={pierre.prixSertissage}
                className={`${inputClass} bg-gray-100`}
                readOnly
              />
            </div>
            <div className="w-1/6 px-2 mt-2">
              <button
                onClick={() => handleRemoveAutrePierre(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAutrePierre}
          className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors mt-2"
        >
          Ajouter une autre pierre
        </button>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Total prix autres pierres</label>
            <input
              type="text"
              value={`${calculerPrixAutresPierres().toFixed(2)} €`}
              readOnly
              className={`${inputClass} w-full bg-gray-100`}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Total prix sertissage autres pierres</label>
            <input
              type="text"
              value={`${calculerPrixSertissageAutresPierres().toFixed(2)} €`}
              readOnly
              className={`${inputClass} w-full bg-gray-100`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamantsPierres;