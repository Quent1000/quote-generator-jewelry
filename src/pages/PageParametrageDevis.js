import React, { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { CogIcon, CurrencyDollarIcon, ScaleIcon, TruckIcon, CheckCircleIcon, XCircleIcon, FingerPrintIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import withRoleAccess from '../components/auth/withRoleAccess';

const PageParametrageDevis = () => {
  const { darkMode } = useAppContext();
  const [parametres, setParametres] = useState({
    tauxHoraireCAO: 0,
    tauxHoraireBijouterie: 0,
    tauxHoraireAdministratif: 0,
    tauxHoraireDesign: 0,
    tauxHoraireDesertissage: 0,
    prixSertissage: {},
    coefficientDiamantsRonds: 1.15,
    prixGravure: {
      "Manuscrite": 20,
      "Bâton": 15
    },
    prixMetaux: {
      "Or Jaune 3N": 0,
      "Or Rouge 5N": 0,
      "Or Rose 4N": 0,
      "Or Gris": 0,
      "Or Gris Palladié": 0,
      "Argent 925": 0,
      "Or jaune 24K": 0,
      "Or jaune 2N": 0
    },
    prixRhodiage: 0,
    prixLivraison: {
      "VD La Poste": 30, // Anciennement "International"
      "DHL": 10, // Anciennement "Standard"
      "DHL Express": 20, // Anciennement "Express"
      "Fedex": 25, // Nouveau
      "Récupération sur site": 0 // Nouveau
    },
    prixDiamantsRonds: {
      "0.50 - 1.20 mm": 600,
      "1.25 - 1.75 mm": 580,
      "1.80 - 2.65 mm": 600,
      "2.70 - 3.25 mm": 870,
      "3.30 - 3.50 mm": 1098,
      "3.55 - 3.65 mm": 1056,
      "3.70 - 3.85 mm": 1185,
      "3.90 - 4.10 mm": 1440,
      "4.15 - 4.55 mm": 2360
    },
    prixPoincons: {
      poinconMaitre: {
        gravureLaser: 6,
        frappe: 5
      },
      poinconTitre: {
        gravureLaser: 8,
        frappe: 5
      },
      marque: {
        gravureLogoMarque: 3,
        gravureNumeroSerie: 8
      }
    },
    prixFonte: {
      "Moins de 6g": 10.00,
      "Moins de 12g": 15.00,
      "Plus de 12g": 18.00
    },
    prixImpressionCire: {
      "Petite impression": 10.00,
      "Moyenne impression": 15.00,
      "Grosse impression": 18.00
    },
    prixImpressionResine: {
      "Petite impression": 20.00,
      "Moyenne impression": 30.00,
      "Grosse impression": 40.00
    }
  });
  const [selectedIndex, setSelectedIndex] = useState(() => {
    // Récupérer l'index sauvegardé dans localStorage, ou utiliser 0 par défaut
    return parseInt(localStorage.getItem('selectedTabIndex') || '0');
  });

  const fetchParametres = useCallback(async () => {
    const docRef = doc(db, 'parametresDevis', 'default');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setParametres({
        ...data,
        tauxHoraireDesign: data.tauxHoraireDesign || 0,
        tauxHoraireDesertissage: data.tauxHoraireDesertissage || 0,
        prixDiamantsRonds: data.prixDiamantsRonds || {
          "0.50 - 1.20 mm": 600,
          "1.25 - 1.75 mm": 580,
          "1.80 - 2.65 mm": 600,
          "2.70 - 3.25 mm": 870,
          "3.30 - 3.50 mm": 1098,
          "3.55 - 3.65 mm": 1056,
          "3.70 - 3.85 mm": 1185,
          "3.90 - 4.10 mm": 1440,
          "4.15 - 4.55 mm": 2360
        },
        prixPoincons: data.prixPoincons || {
          poinconMaitre: {
            gravureLaser: 6,
            frappe: 5
          },
          poinconTitre: {
            gravureLaser: 8,
            frappe: 5
          },
          marque: {
            gravureLogoMarque: 3,
            gravureNumeroSerie: 8
          }
        },
        prixFonte: data.prixFonte || {
          "Moins de 6g": 10.00,
          "Moins de 12g": 15.00,
          "Plus de 12g": 18.00
        },
        prixImpressionCire: data.prixImpressionCire || {
          "Petite impression": 10.00,
          "Moyenne impression": 15.00,
          "Grosse impression": 18.00
        },
        prixImpressionResine: data.prixImpressionResine || {
          "Petite impression": 20.00,
          "Moyenne impression": 30.00,
          "Grosse impression": 40.00
        },
        prixLivraison: {
          "VD La Poste": data.prixLivraison?.["VD La Poste"] || data.prixLivraison?.International || 30,
          "DHL": data.prixLivraison?.["DHL"] || data.prixLivraison?.Standard || 10,
          "DHL Express": data.prixLivraison?.["DHL Express"] || data.prixLivraison?.Express || 20,
          "Fedex": data.prixLivraison?.["Fedex"] || 25,
          "Récupération sur site": data.prixLivraison?.["Récupération sur site"] || 0
        }
      });
    } else {
      // Utilisez une fonction pour obtenir les valeurs initiales
      const getInitialParametres = () => ({
        tauxHoraireCAO: 50,
        tauxHoraireBijouterie: 50,
        tauxHoraireAdministratif: 50,
        tauxHoraireDesign: 50,
        tauxHoraireDesertissage: 50,
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
          "Or Jaune 3N": 72000,
          "Or Rouge 5N": 70000,
          "Or Rose 4N": 68000,
          "Or Gris": 65000,
          "Or Gris Palladié": 60000,
          "Argent 925": 55000,
          "Or jaune 24K": 75000,
          "Or jaune 2N": 70000
        },
        prixRhodiage: 30,
        prixLivraison: {
          "VD La Poste": 30, // Anciennement "International"
          "DHL": 10, // Anciennement "Standard"
          "DHL Express": 20, // Anciennement "Express"
          "Fedex": 25, // Nouveau
          "Récupération sur site": 0 // Nouveau
        },
        prixDiamantsRonds: {
          "0.50 - 1.20 mm": 600,
          "1.25 - 1.75 mm": 580,
          "1.80 - 2.65 mm": 600,
          "2.70 - 3.25 mm": 870,
          "3.30 - 3.50 mm": 1098,
          "3.55 - 3.65 mm": 1056,
          "3.70 - 3.85 mm": 1185,
          "3.90 - 4.10 mm": 1440,
          "4.15 - 4.55 mm": 2360
        },
        prixPoincons: {
          poinconMaitre: {
            gravureLaser: 6,
            frappe: 5
          },
          poinconTitre: {
            gravureLaser: 8,
            frappe: 5
          },
          marque: {
            gravureLogoMarque: 3,
            gravureNumeroSerie: 8
          }
        },
        prixFonte: {
          "Moins de 6g": 10.00,
          "Moins de 12g": 15.00,
          "Plus de 12g": 18.00
        },
        prixImpressionCire: {
          "Petite impression": 10.00,
          "Moyenne impression": 15.00,
          "Grosse impression": 18.00
        },
        prixImpressionResine: {
          "Petite impression": 20.00,
          "Moyenne impression": 30.00,
          "Grosse impression": 40.00
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'coefficientDiamantsRonds') {
      // Permettre à la fois le point et la virgule comme séparateur décimal
      const sanitizedValue = value.replace(',', '.');
      setParametres(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setParametres(prev => ({ ...prev, [name]: parseFloat(value) }));
    }
  };

  const handleNestedInputChange = useCallback((category, key, value) => {
    setParametres(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: parseFloat(value)
      }
    }));
  }, []);

  const handleNestedPoinconInputChange = (category, type, value) => {
    setParametres(prev => ({
      ...prev,
      prixPoincons: {
        ...prev.prixPoincons,
        [category]: {
          ...prev.prixPoincons[category],
          [type]: parseFloat(value)
        }
      }
    }));
  };

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // La notification disparaît après 3 secondes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'parametresDevis', 'default');
    try {
      await setDoc(docRef, parametres);
      showNotification('Les paramètres ont été mis à jour avec succès.', 'success');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres :", error);
      showNotification('Une erreur est survenue lors de la mise à jour des paramètres.', 'error');
    }
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

  // Ajouter cet effet pour sauvegarder l'index sélectionné dans localStorage
  useEffect(() => {
    localStorage.setItem('selectedTabIndex', selectedIndex.toString());
  }, [selectedIndex]);

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-8">Paramétrage des devis</h1>
      <form onSubmit={handleSubmit}>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex p-1 space-x-1 bg-teal-900/20 rounded-xl mb-8">
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
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <FingerPrintIcon className="w-5 h-5 mr-2 inline-block" />
              Poinçons et Marques
            </Tab>
            <Tab className={({ selected }) => (selected ? selectedTabClass : tabClass)}>
              <CubeIcon className="w-5 h-5 mr-2 inline-block" />
              Impression 3D et Fonte
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
                <div>
                  <label className="block mb-2">Taux horaire Design</label>
                  <input
                    type="number"
                    name="tauxHoraireDesign"
                    value={parametres.tauxHoraireDesign}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block mb-2">Taux horaire Désertissage</label>
                  <input
                    type="number"
                    name="tauxHoraireDesertissage"
                    value={parametres.tauxHoraireDesertissage}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parametres.prixSertissage || {}).map(([type, prix]) => (
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
              <div className="mt-4">
                <label className="block mb-2">Coefficient diamants ronds (%)</label>
                <input
                  type="text"
                  name="coefficientDiamantsRonds"
                  value={parametres.coefficientDiamantsRonds}
                  onChange={handleInputChange}
                  step="0.01"
                  className={inputClass}
                  pattern="^\d*[.,]?\d*$"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 mt-8">Prix diamants ronds (€/carat)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parametres.prixDiamantsRonds).map(([taille, prix]) => (
                  <div key={taille}>
                    <label className="block mb-2">{taille}</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixDiamantsRonds', taille, e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(parametres.prixMetaux).map(([metal, prix]) => (
                  <div key={metal}>
                    <label className="block mb-2">{metal} (€/kg)</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixMetaux', metal, e.target.value)}
                      className={inputClass}
                      min="0"
                      step="0.01"
                      placeholder="ex: 72000"
                    />
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Prix Rhodiage</h3>
                  <div>
                    <label className="block mb-2">Prix Rhodiage</label>
                    <input
                      type="number"
                      name="prixRhodiage"
                      value={parametres.prixRhodiage}
                      onChange={handleInputChange}
                      className={inputClass}
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Prix Livraison</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(parametres.prixLivraison).map(([methode, prix]) => (
                      <div key={methode}>
                        <label className="block mb-2">Prix Livraison {methode}</label>
                        <input
                          type="number"
                          value={prix}
                          onChange={(e) => handleNestedInputChange('prixLivraison', methode, e.target.value)}
                          className={inputClass}
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Poinçon de maître</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block mb-1">Gravure laser</label>
                      <input
                        type="number"
                        value={parametres.prixPoincons.poinconMaitre.gravureLaser}
                        onChange={(e) => handleNestedPoinconInputChange('poinconMaitre', 'gravureLaser', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Frappé</label>
                      <input
                        type="number"
                        value={parametres.prixPoincons.poinconMaitre.frappe}
                        onChange={(e) => handleNestedPoinconInputChange('poinconMaitre', 'frappe', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Poinçon de titre</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block mb-1">Gravure laser</label>
                      <input
                        type="number"
                        value={parametres.prixPoincons.poinconTitre.gravureLaser}
                        onChange={(e) => handleNestedPoinconInputChange('poinconTitre', 'gravureLaser', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Frappé</label>
                      <input
                        type="number"
                        value={parametres.prixPoincons.poinconTitre.frappe}
                        onChange={(e) => handleNestedPoinconInputChange('poinconTitre', 'frappe', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Marque</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block mb-1">Gravure logo marque</label>
                      <input
                        type="number"
                        value={parametres.prixPoincons.marque.gravureLogoMarque}
                        onChange={(e) => handleNestedPoinconInputChange('marque', 'gravureLogoMarque', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Gravure N° série</label>
                      <input
                        type="number"
                        value={parametres.prixPoincons.marque.gravureNumeroSerie}
                        onChange={(e) => handleNestedPoinconInputChange('marque', 'gravureNumeroSerie', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <h3 className="text-xl font-semibold mb-4">Prix de la fonte</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(parametres.prixFonte).map(([poids, prix]) => (
                  <div key={poids}>
                    <label className="block mb-2">{poids}</label>
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => handleNestedInputChange('prixFonte', poids, e.target.value)}
                      className={inputClass}
                      step="0.01"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-4 mt-8">Prix impression cire</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Petite impression</label>
                  <input
                    type="number"
                    value={parametres.prixImpressionCire["Petite impression"]}
                    onChange={(e) => handleNestedInputChange('prixImpressionCire', 'Petite impression', e.target.value)}
                    className={inputClass}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block mb-2">Moyenne impression</label>
                  <input
                    type="number"
                    value={parametres.prixImpressionCire["Moyenne impression"]}
                    onChange={(e) => handleNestedInputChange('prixImpressionCire', 'Moyenne impression', e.target.value)}
                    className={inputClass}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block mb-2">Grosse impression</label>
                  <input
                    type="number"
                    value={parametres.prixImpressionCire["Grosse impression"]}
                    onChange={(e) => handleNestedInputChange('prixImpressionCire', 'Grosse impression', e.target.value)}
                    className={inputClass}
                    step="0.01"
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 mt-8">Prix impression résine</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Petite impression</label>
                  <input
                    type="number"
                    value={parametres.prixImpressionResine["Petite impression"]}
                    onChange={(e) => handleNestedInputChange('prixImpressionResine', 'Petite impression', e.target.value)}
                    className={inputClass}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block mb-2">Moyenne impression</label>
                  <input
                    type="number"
                    value={parametres.prixImpressionResine["Moyenne impression"]}
                    onChange={(e) => handleNestedInputChange('prixImpressionResine', 'Moyenne impression', e.target.value)}
                    className={inputClass}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block mb-2">Grosse impression</label>
                  <input
                    type="number"
                    value={parametres.prixImpressionResine["Grosse impression"]}
                    onChange={(e) => handleNestedInputChange('prixImpressionResine', 'Grosse impression', e.target.value)}
                    className={inputClass}
                    step="0.01"
                  />
                </div>
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

      {notification && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white flex items-center`}>
          {notification.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 mr-2" />
          ) : (
            <XCircleIcon className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
};

// Exporter le composant avec le contrôle d'accès
export default withRoleAccess(PageParametrageDevis, ['admin']);