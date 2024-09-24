import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { CogIcon, CurrencyEuroIcon, ScaleIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

const PageParametrageDevis = () => {
  const { darkMode } = useAppContext();
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
      "Sur site": 0,
      "VD la poste": 10,
      "DHL": 20,
      "Fedex": 25
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const savedParams = localStorage.getItem('parametresDevis');
    if (savedParams) {
      try {
        const parsedParams = JSON.parse(savedParams);
        setParametres(prev => ({...prev, ...parsedParams}));
      } catch (error) {
        console.error("Erreur lors du parsing des paramètres:", error);
      }
    }
  }, []);

  const handleChange = (e, category = null, subCategory = null) => {
    const { name, value } = e.target;
    setParametres(prev => {
      if (category) {
        if (subCategory) {
          return {
            ...prev,
            [category]: {
              ...prev[category],
              [subCategory]: {
                ...prev[category][subCategory],
                [name]: parseFloat(value) || 0
              }
            }
          };
        }
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [name]: parseFloat(value) || 0
          }
        };
      }
      return {
        ...prev,
        [name]: parseFloat(value) || 0
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('parametresDevis', JSON.stringify(parametres));
    alert('Paramètres sauvegardés avec succès !');
  };

  const inputClass = `w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring focus:ring-teal-200`;
  const labelClass = 'block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300';

  const TabContent = ({ children, icon: Icon }) => (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium leading-5 text-teal-700 dark:text-teal-300">
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </div>
  );

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400">Paramétrage du devis</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-teal-900/20 p-1">
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 dark:text-teal-300
                 ${selected ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-white/[0.12] hover:text-teal-600'}`
              }
            >
              <TabContent icon={CogIcon}>Taux horaires</TabContent>
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 dark:text-teal-300
                 ${selected ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-white/[0.12] hover:text-teal-600'}`
              }
            >
              <TabContent icon={CurrencyEuroIcon}>Prix des services</TabContent>
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 dark:text-teal-300
                 ${selected ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-white/[0.12] hover:text-teal-600'}`
              }
            >
              <TabContent icon={ScaleIcon}>Prix des métaux</TabContent>
            </Tab>
            <Tab 
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-teal-700 dark:text-teal-300
                 ${selected ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-white/[0.12] hover:text-teal-600'}`
              }
            >
              <TabContent icon={TruckIcon}>Livraison</TabContent>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['CAO', 'Bijouterie', 'Administratif'].map((type) => (
                  <div key={type}>
                    <label htmlFor={`tauxHoraire${type}`} className={labelClass}>Taux horaire {type} (€/h)</label>
                    <input
                      type="number"
                      id={`tauxHoraire${type}`}
                      name={`tauxHoraire${type}`}
                      value={parametres[`tauxHoraire${type}`] || ''}
                      onChange={handleChange}
                      className={inputClass}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Prix de sertissage (€ par pierre)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(parametres.prixSertissage).map(([type, prix]) => (
                      <div key={type}>
                        <label htmlFor={type} className={labelClass}>{type}</label>
                        <input
                          type="number"
                          id={type}
                          name={type}
                          value={prix || ''}
                          onChange={(e) => handleChange(e, 'prixSertissage')}
                          className={inputClass}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Prix de gravure (€)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parametres.prixGravure).map(([style, prix]) => (
                      <div key={style}>
                        <label htmlFor={style} className={labelClass}>{style}</label>
                        <input
                          type="number"
                          id={style}
                          name={style}
                          value={prix || ''}
                          onChange={(e) => handleChange(e, 'prixGravure')}
                          className={inputClass}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="prixRhodiage" className={labelClass}>Prix du rhodiage (€)</label>
                  <input
                    type="number"
                    id="prixRhodiage"
                    name="prixRhodiage"
                    value={parametres.prixRhodiage || ''}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <h3 className="text-lg font-semibold mb-3">Prix des métaux (€/kg)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parametres.prixMetaux).map(([metal, prix]) => (
                  <div key={metal}>
                    <label htmlFor={metal} className={labelClass}>{metal}</label>
                    <input
                      type="number"
                      id={metal}
                      name={metal}
                      value={prix || ''}
                      onChange={(e) => handleChange(e, 'prixMetaux')}
                      className={inputClass}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <h3 className="text-lg font-semibold mb-3">Prix de livraison (€)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(parametres.prixLivraison).map(([methode, prix]) => (
                  <div key={methode}>
                    <label htmlFor={`prixLivraison${methode}`} className={labelClass}>{methode}</label>
                    <input
                      type="number"
                      id={`prixLivraison${methode}`}
                      name={methode}
                      value={prix}
                      onChange={(e) => handleChange(e, 'prixLivraison')}
                      className={inputClass}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Sauvegarder les paramètres
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageParametrageDevis;