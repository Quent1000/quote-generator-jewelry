import React from 'react';
import CustomSelect from './CustomSelect';
import { PlusCircleIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from '../Tooltip'; // Assurez-vous d'avoir un composant Tooltip

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
  parametres
}) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const autoFilledInputClass = `w-full p-2 border rounded ${
    darkMode 
      ? 'bg-gray-600 border-gray-500 text-teal-300' 
      : 'bg-teal-50 border-teal-300 text-teal-700'
  } font-semibold`;

  const diamantOptions = [
    { value: '', label: 'Sélectionner' },
    ...Object.entries(diametresEtCarats).map(([taille, carat]) => ({
      value: taille,
      label: `ø ${taille} mm (${carat} ct)`
    }))
  ];

  const sertissageOptions = [
    { value: '', label: 'Sélectionner' },
    ...Object.keys(parametres.prixSertissage || {}).map(type => ({
      value: type,
      label: type
    }))
  ];

  const fournisseurOptions = [
    { value: 'TGN 409', label: 'TGN 409' },
    { value: 'Client', label: 'Client' }
  ];

  const handleDiamantChange = (index, field, value) => {
    const updatedDiamant = { ...devis.diamants[index], [field]: value };
    
    if (field === 'taille') {
      updatedDiamant.carat = diametresEtCarats[value] || 0;
      // Si un diamètre est sélectionné, mettre la quantité à 1, sinon à 0
      updatedDiamant.qte = value ? 1 : 0;
      const prixCategorie = Object.entries(parametres.prixDiamantsRonds).find(([categorie]) => {
        const [min, max] = categorie.split(' - ').map(parseFloat);
        return parseFloat(value) >= min && parseFloat(value) <= max;
      });
      updatedDiamant.prixCarat = prixCategorie ? prixCategorie[1] : 0;
    }

    // Mise à jour des calculs
    updatedDiamant.prixUnitaire = updatedDiamant.carat * updatedDiamant.prixCarat;

    if (updatedDiamant.fourniPar === 'Client') {
      updatedDiamant.prixTotalDiamants = 0;
    } else {
      updatedDiamant.prixTotalDiamants = parseFloat((updatedDiamant.prixUnitaire * updatedDiamant.qte).toFixed(2));
    }

    if (field === 'sertissage') {
      updatedDiamant.coutSertissageUnitaire = parametres.prixSertissage[value] || 0;
    }

    // Assurez-vous que le coût de sertissage unitaire est un nombre
    updatedDiamant.coutSertissageUnitaire = parseFloat(updatedDiamant.coutSertissageUnitaire) || 0;

    // Calculez le prix de sertissage, en utilisant 0 si le résultat est NaN
    updatedDiamant.prixSertissage = updatedDiamant.coutSertissageUnitaire * updatedDiamant.qte;
    updatedDiamant.prixSertissage = isNaN(updatedDiamant.prixSertissage) ? 0 : updatedDiamant.prixSertissage;

    handleDiamantsChange(index, 'diamant', updatedDiamant);
  };

  const handleAutrePierreChange = (index, field, value) => {
    let updatedPierre = { ...devis.autresPierres[index], [field]: value };
    
    if (field === 'forme') {
      // Si une forme est sélectionnée, mettre la quantité à 1, sinon à 0
      updatedPierre.qte = value ? 1 : 0;
    }

    // Gestion spéciale pour le champ caratage
    if (field === 'carat') {
      updatedPierre.carat = value.replace(',', '.');
    }

    // Calculs basés sur les valeurs mises à jour
    if (updatedPierre.fourniPar === 'Client') {
      updatedPierre.prixTotal = 0;
    } else {
      updatedPierre.prixTotal = (parseFloat(updatedPierre.prix) || 0) * (parseInt(updatedPierre.qte) || 0);
    }

    // Assurez-vous que le coût de sertissage unitaire est un nombre
    updatedPierre.coutSertissageUnitaire = parseFloat(updatedPierre.coutSertissageUnitaire) || 0;

    // Calculez le prix de sertissage, en utilisant 0 si le résultat est NaN
    updatedPierre.prixSertissage = updatedPierre.coutSertissageUnitaire * (parseInt(updatedPierre.qte) || 0);
    updatedPierre.prixSertissage = isNaN(updatedPierre.prixSertissage) ? 0 : updatedPierre.prixSertissage;

    handleAutresPierresChange(index, updatedPierre);
  };

  // Ajoutez cette vérification
  const formePierreOptions = [
    { value: '', label: 'Sélectionner' },
    ...formesPierres.map(forme => ({ value: forme, label: forme }))
  ];

  const typePierresOptions = [
    { value: '', label: 'Sélectionner un type' },
    ...[
      "Diamant",
      "Saphir",
      "Rubis",
      "Émeraude",
      "Améthyste",
      "Topaze",
      "Péridot",
      "Citrine",
      "Aigue-marine",
      "Grenat",
      "Tourmaline",
      "Tanzanite",
      "Opale",
      "Quartz rose",
      "Lapis-lazuli"
    ].map(type => ({ value: type, label: type }))
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        Diamants Ronds
        <Tooltip content="Ajoutez ici les détails des diamants ronds pour votre devis">
          <InformationCircleIcon className="h-5 w-5 ml-2 text-gray-400" />
        </Tooltip>
      </h3>
      
      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 w-1/6">Diamètre</th>
              <th className="p-2 w-1/12">Quantité</th>
              <th className="p-2 w-1/8">Fourni par</th>
              <th className="p-2 w-1/6">Sertissage</th>
              <th className="p-2 w-1/8">Coût sertissage unitaire</th>
              <th className="p-2 w-1/8">Prix Total diamants</th>
              <th className="p-2 w-1/8">Prix Total sertissage</th>
              <th className="p-2 w-16"></th> {/* Colonne pour le bouton de suppression */}
            </tr>
          </thead>
          <tbody>
            {devis.diamants.map((diamant, index) => (
              <tr key={index} className="border-b dark:border-gray-700">
                <td className="p-2">
                  <CustomSelect
                    options={diamantOptions}
                    value={diamant.taille}
                    onChange={(value) => handleDiamantChange(index, 'taille', value)}
                    className={inputClass}
                    darkMode={darkMode}
                    isScrollable={true}
                    maxHeight={300}
                  />
                </td>
                <td className="p-2">
                  {diamant.taille ? (
                    <input
                      type="number"
                      value={diamant.qte}
                      onChange={(e) => handleDiamantChange(index, 'qte', parseInt(e.target.value))}
                      className={inputClass}
                      min="0"
                    />
                  ) : (
                    <input
                      type="number"
                      value={0}
                      readOnly
                      className={`${inputClass} bg-gray-100 dark:bg-gray-700`}
                    />
                  )}
                </td>
                <td className="p-2">
                  <CustomSelect
                    options={fournisseurOptions}
                    value={diamant.fourniPar}
                    onChange={(value) => handleDiamantChange(index, 'fourniPar', value)}
                    className={inputClass}
                    darkMode={darkMode}
                    width="100%"
                  />
                </td>
                <td className="p-2">
                  <CustomSelect
                    options={sertissageOptions}
                    value={diamant.sertissage || ''}
                    onChange={(value) => handleDiamantChange(index, 'sertissage', value)}
                    className={inputClass}
                    darkMode={darkMode}
                    width="100%"
                  />
                </td>
                <td className="p-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={diamant.coutSertissageUnitaire || 0}
                      onChange={(e) => handleDiamantChange(index, 'coutSertissageUnitaire', parseFloat(e.target.value))}
                      className={`${inputClass} pr-6`}
                      step="0.01"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  </div>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={`${(diamant.prixTotalDiamants || 0).toFixed(2)} €`}
                    className={autoFilledInputClass}
                    readOnly
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={`${isNaN(diamant.prixSertissage) ? '0.00' : diamant.prixSertissage.toFixed(2)} €`}
                    className={autoFilledInputClass}
                    readOnly
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRemoveDiamant(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={handleAddDiamant}
          className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Ajouter un diamant
        </button>
        
        <div className="flex space-x-4">
          <div>
            <label className="block mb-2 font-semibold">Total prix diamants</label>
            <input
              type="text"
              value={`${calculerPrixDiamants().toFixed(2)} €`}
              readOnly
              className={`${autoFilledInputClass} w-full`}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Total prix sertissage diamants</label>
            <input
              type="text"
              value={`${calculerPrixSertissage().toFixed(2)} €`}
              readOnly
              className={`${autoFilledInputClass} w-full`}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          Autres pierres
          <Tooltip content="Ajoutez ici les détails des autres pierres pour votre devis">
            <InformationCircleIcon className="h-5 w-5 ml-2 text-gray-400" />
          </Tooltip>
        </h3>
        
        <div className="overflow-x-auto relative">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2">Forme</th>
                <th className="p-2">Type</th>
                <th className="p-2">Taille</th>
                <th className="p-2">Prix unitaire</th>
                <th className="p-2">Caratage</th>
                <th className="p-2">Sertissage</th>
                <th className="p-2">Coût sertissage unitaire</th>
                <th className="p-2">Fourni par</th>
                <th className="p-2">Quantité</th>
                <th className="p-2 w-16"></th> {/* Supprimé le titre et réduit la largeur */}
              </tr>
            </thead>
            <tbody>
              {devis.autresPierres.map((pierre, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="p-2">
                    <CustomSelect
                      options={formePierreOptions}
                      value={pierre.forme}
                      onChange={(value) => handleAutrePierreChange(index, 'forme', value)}
                      className={inputClass}
                      darkMode={darkMode}
                      isScrollable={true}
                      maxHeight={300}
                    />
                  </td>
                  <td className="p-2">
                    <CustomSelect
                      options={typePierresOptions}
                      value={pierre.type}
                      onChange={(value) => handleAutrePierreChange(index, 'type', value)}
                      className={inputClass}
                      darkMode={darkMode}
                      isScrollable={true}
                      maxHeight={200}
                      fixedWidth="100%"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={pierre.dimension}
                      onChange={(e) => handleAutrePierreChange(index, 'dimension', e.target.value)}
                      className={inputClass}
                      placeholder="ex: 4.34 x 2.61"
                    />
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <input
                        type="number"
                        value={pierre.prix || 0}
                        onChange={(e) => handleAutrePierreChange(index, 'prix', parseFloat(e.target.value))}
                        className={`${inputClass} pr-6`}
                        step="0.01"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={pierre.carat}
                        onChange={(e) => handleAutrePierreChange(index, 'carat', e.target.value)}
                        className={`${inputClass} pr-8`}
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">ct</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <CustomSelect
                      options={sertissageOptions}
                      value={pierre.sertissage || ''}
                      onChange={(value) => handleAutrePierreChange(index, 'sertissage', value)}
                      className={inputClass}
                      darkMode={darkMode}
                      isScrollable={true}
                      maxHeight={200}
                      fixedWidth="100%"
                    />
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <input
                        type="number"
                        value={pierre.coutSertissageUnitaire || 0}
                        onChange={(e) => handleAutrePierreChange(index, 'coutSertissageUnitaire', parseFloat(e.target.value))}
                        className={`${inputClass} pr-6`}
                        step="0.01"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <CustomSelect
                      options={fournisseurOptions}
                      value={pierre.fourniPar}
                      onChange={(value) => handleAutrePierreChange(index, 'fourniPar', value)}
                      className={inputClass}
                      darkMode={darkMode}
                      fixedWidth="100%"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={pierre.qte}
                      onChange={(e) => handleAutrePierreChange(index, 'qte', parseInt(e.target.value))}
                      className={inputClass}
                      min="0"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleRemoveAutrePierre(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    >
                      <TrashIcon className="h-6 w-6" /> {/* Augmenté la taille de l'icône */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={handleAddAutrePierre}
            className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Ajouter une autre pierre
          </button>
          
          <div className="flex space-x-4">
            <div>
              <label className="block mb-2 font-semibold">Total prix autres pierres</label>
              <input
                type="text"
                value={`${calculerPrixAutresPierres().toFixed(2)} €`}
                readOnly
                className={`${autoFilledInputClass} w-full`}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Total prix sertissage autres pierres</label>
              <input
                type="text"
                value={`${calculerPrixSertissageAutresPierres().toFixed(2)} €`}
                readOnly
                className={`${autoFilledInputClass} w-full`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamantsPierres;