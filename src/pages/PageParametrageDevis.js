import React, { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { CogIcon, CurrencyDollarIcon, ScaleIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const PageParametrageDevis = () => {
  const { darkMode } = useAppContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [parametres, setParametres] = useState({
    tauxHoraireCAO: 50,
    tauxHoraireBijouterie: 50,
    tauxHoraireAdministratif: 50,
    prixSertissage: {
      "Serti grain": 3,
      "Serti rail": 4,
      "Serti copeaux": 5,
      "Serti clos": 6,
      "Serti descendu": 7,
      "Serti masse": 8
    },
    prixGravure: {
      "Manuscrite": 20,
      "Bâton": 15
    },
    prixMetaux: {
      "JAUNE": 50000,
      "GRIS": 55000,
      "GPD": 60000,
      "ROUGE 5N": 58000,
      "ROSE 4N": 56000
    },
    prixRhodiage: 30,
    prixLivraison: {
      "Standard": 10,
      "Express": 20,
      "International": 30
    }
  });

  const fetchParametres = useCallback(async () => {
    const docRef = doc(db, 'parametresDevis', 'default');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setParametres(docSnap.data());
    } else {
      // Utilisez une fonction pour obtenir les valeurs initiales
      const getInitialParametres = () => ({
        tauxHoraireCAO: 50,
        tauxHoraireBijouterie: 50,
        tauxHoraireAdministratif: 50,
        prixSertissage: {
          "Serti grain": 3,
          "Serti rail": 4,
          "Serti copeaux": 5,
          "Serti clos": 6,
          "Serti descendu": 7,
          "Serti masse": 8
        },
        prixGravure: {
          "Manuscrite": 20,
          "Bâton": 15
        },
        prixMetaux: {
          "JAUNE": 50000,
          "GRIS": 55000,
          "GPD": 60000,
          "ROUGE 5N": 58000,
          "ROSE 4N": 56000
        },
        prixRhodiage: 30,
        prixLivraison: {
          "Standard": 10,
          "Express": 20,
          "International": 30
        }
      });
      const initialParametres = getInitialParametres();
      await setDoc(docRef, initialParametres);
      setParametres(initialParametres);
    }
  }, []);

  useEffect(() => {
    fetchParametres();
  }, [fetchParametres]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setParametres(prev => ({ ...prev, [name]: parseFloat(value) }));
  }, []);

  const handleNestedInputChange = useCallback((category, key, value) => {
    setParametres(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: parseFloat(value)
      }
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'parametresDevis', 'default');
    await setDoc(docRef, parametres);
    alert('Paramètres sauvegardés avec succès dans Firestore !');
  };

  const tabClass = `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
    darkMode
      ? 'text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
      : 'text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-teal-500'
  }`;

  const selectedTabClass = `${tabClass} ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-teal-500 text-white'
  }`;

  const inputClass = `w-full p-2 rounded-md ${
    darkMode
      ? 'bg-gray-700 text-white border-gray-600 focus:border-teal-500 focus:ring-teal-500'
      : 'bg-white text-gray-900 border-gray-300 focus:border-teal-500 focus:ring-teal-500'
  } border focus:outline-none focus:ring-2`;

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-6">Paramétrage des devis</h1>
      <form onSubmit={handleSubmit}>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-2 rounded-xl bg-teal-900/20 p-1 mb-4">
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <CogIcon className="w-5 h-5 mr-2 inline-block" />
              Taux horaires
            </Tab>
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <ScaleIcon className="w-5 h-5 mr-2 inline-block" />
              Prix sertissage
            </Tab>
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <CurrencyDollarIcon className="w-5 h-5 mr-2 inline-block" />
              Prix gravure
            </Tab>
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <CurrencyDollarIcon className="w-5 h-5 mr-2 inline-block" />
              Prix métaux
            </Tab>
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <TruckIcon className="w-5 h-5 mr-2 inline-block" />
              Autres
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Taux horaire CAO</label>
                  <input
                    type="number"
                    name="tauxHoraireCAO"
                    value={parametres.tauxHoraireCAO}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block mb-2">Taux horaire Bijouterie</label>
                  <input
                    type="number"
                    name="tauxHoraireBijouterie"
                    value={parametres.tauxHoraireBijouterie}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block mb-2">Taux horaire Administratif</label>
                  <input
                    type="number"
                    name="tauxHoraireAdministratif"
                    value={parametres.tauxHoraireAdministratif}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parametres.prixSertissage).map(([type, prix]) => (
                  <div key={type}>
                    <label className="block mb-2">{type}</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixSertissage', type, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(parametres.prixGravure).map(([type, prix]) => (
                  <div key={type}>
                    <label className="block mb-2">{type}</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixGravure', type, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parametres.prixMetaux).map(([metal, prix]) => (
                  <div key={metal}>
                    <label className="block mb-2">{metal}</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixMetaux', metal, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Prix Rhodiage</label>
                  <input
                    type="number"
                    name="prixRhodiage"
                    value={parametres.prixRhodiage}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                {Object.entries(parametres.prixLivraison).map(([methode, prix]) => (
                  <div key={methode}>
                    <label className="block mb-2">Prix Livraison {methode}</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixLivraison', methode, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
            darkMode
              ? 'bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500'
              : 'bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-teal-500'
          }`}
        >
          Sauvegarder les paramètres
        </button>
      </form>
    </div>
  );
};

export default PageParametrageDevis;