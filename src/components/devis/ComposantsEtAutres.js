import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import CustomSelect from './CustomSelect';

const ComposantsEtAutres = ({ devis, handleInputChange, handleComposantChange, darkMode }) => {
  const [composantsFrequents, setComposantsFrequents] = useState([]);
  const [composantsLibres, setComposantsLibres] = useState(devis.composantsLibres || []);
  const [composantsFrequentsSelectionnes, setComposantsFrequentsSelectionnes] = useState(devis.composantsFrequents || []);

  useEffect(() => {
    const chargerComposantsFrequents = async () => {
      const composantsRef = collection(db, 'composantsFrequents');
      const snapshot = await getDocs(composantsRef);
      let composants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (composants.length === 0) {
        const exemplesComposants = [
          { description: "Systeme guradian GM", prix: 25 },
          { description: "Systeme guradian PM", prix: 15 },
          { description: "Mousqueton GM", prix: 18 }
        ];
        
        for (const exemple of exemplesComposants) {
          const docRef = await addDoc(composantsRef, exemple);
          composants.push({ id: docRef.id, ...exemple });
        }
      }
      
      setComposantsFrequents(composants);
    };

    chargerComposantsFrequents();
  }, []);

  useEffect(() => {
    handleInputChange('composantsFrequents', composantsFrequentsSelectionnes);
    handleInputChange('composantsLibres', composantsLibres);
  }, [composantsFrequentsSelectionnes, composantsLibres, handleInputChange]);

  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const renderOption = (label, content) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      {content}
    </div>
  );

  const ajouterComposantLibre = () => {
    const nouveauComposant = { description: '', prix: '' };
    setComposantsLibres([...composantsLibres, nouveauComposant]);
    handleComposantChange(composantsLibres.length, 'composant', nouveauComposant, 'composantsLibres');
  };

  const handleComposantLibreChange = (index, champ, valeur) => {
    const nouveauxComposants = [...composantsLibres];
    nouveauxComposants[index] = { ...nouveauxComposants[index], [champ]: valeur };
    setComposantsLibres(nouveauxComposants);
    handleComposantChange(index, champ, valeur, 'composantsLibres');
  };

  const handleComposantFrequentChange = (selectedValue) => {
    const composantSelectionne = composantsFrequents.find(c => c.id === selectedValue);
    if (composantSelectionne) {
      const nouveauxComposants = [...composantsFrequentsSelectionnes, composantSelectionne];
      setComposantsFrequentsSelectionnes(nouveauxComposants);
      handleComposantChange(nouveauxComposants.length - 1, 'composant', composantSelectionne, 'composantsFrequents');
    }
  };

  const retirerComposantFrequent = (index) => {
    const nouveauxComposants = composantsFrequentsSelectionnes.filter((_, i) => i !== index);
    setComposantsFrequentsSelectionnes(nouveauxComposants);
    handleInputChange('composantsFrequents', nouveauxComposants);
  };

  const calculerTotal = () => {
    const totalFrequents = composantsFrequentsSelectionnes.reduce((sum, comp) => sum + parseFloat(comp.prix || 0), 0);
    const totalLibres = composantsLibres.reduce((sum, comp) => sum + parseFloat(comp.prix || 0), 0);
    return totalFrequents + totalLibres;
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Composants et autres</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {renderOption("Composants fréquents", (
          <>
            <CustomSelect
              options={[
                { value: '', label: 'Sélectionnez un composant fréquent' },
                ...composantsFrequents.map(comp => ({ 
                  value: comp.id, 
                  label: `${comp.description} - ${comp.prix}€` 
                }))
              ]}
              value=""
              onChange={handleComposantFrequentChange}
              className={inputClass}
              darkMode={darkMode}
            />
            {composantsFrequentsSelectionnes.map((composant, index) => (
              <div key={index} className="mt-2 flex justify-between items-center">
                <span>{composant.description} - {composant.prix}€</span>
                <button
                  onClick={() => retirerComposantFrequent(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Retirer
                </button>
              </div>
            ))}
          </>
        ))}
        {renderOption("Composants libres", (
          <>
            {composantsLibres.map((composant, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={composant.description}
                  onChange={(e) => handleComposantLibreChange(index, 'description', e.target.value)}
                  className={inputClass}
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={composant.prix}
                  onChange={(e) => handleComposantLibreChange(index, 'prix', e.target.value)}
                  className={inputClass}
                  placeholder="Prix en €"
                  step="0.01"
                />
              </div>
            ))}
            <button
              onClick={ajouterComposantLibre}
              className="mt-2 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Ajouter un composant libre
            </button>
          </>
        ))}
      </div>
      <div className="mt-8 bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-2">Total Composants</h3>
        <p className="text-3xl text-center font-bold text-teal-600 dark:text-teal-300">
          {calculerTotal().toFixed(2)} €
        </p>
      </div>
    </div>
  );
};

export default ComposantsEtAutres;