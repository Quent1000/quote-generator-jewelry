import React from 'react';
import CustomSelect from './CustomSelect';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from '../Tooltip'; // Assurez-vous d'avoir un composant Tooltip

const TempsProduction = ({ devis, handleInputChange, darkMode, tauxHoraires }) => {
  const inputClass = `w-full p-2 border rounded ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`;

  const tempsOptions = {
    heures: Array.from({ length: 25 }, (_, i) => ({ value: i, label: `${i} h` })),
    minutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => ({ value: m, label: `${m} min` }))
  };

  const calculerPrix = (temps, tauxHoraire) => {
    const heures = temps?.heures || 0;
    const minutes = temps?.minutes || 0;
    const tempsTotal = heures + minutes / 60;
    return tempsTotal * tauxHoraire;
  };

  const renderOption = (label, content, tooltipContent = null) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-2">
        <label className="font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        {tooltipContent && (
          <Tooltip content={tooltipContent}>
            <InformationCircleIcon className="w-5 h-5 ml-2 text-gray-400 cursor-help" />
          </Tooltip>
        )}
      </div>
      {content}
    </div>
  );

  const renderTempsSelect = (type, label) => (
    <div className="flex space-x-2 mb-2">
      <CustomSelect
        options={tempsOptions.heures}
        value={devis.tempsProduction[type]?.heures || 0}
        onChange={(value) => handleInputChange(`tempsProduction.${type}.heures`, parseInt(value))}
        className={`${inputClass} flex-1`}
        darkMode={darkMode}
        isScrollable={true}
        maxHeight={200}
      />
      <CustomSelect
        options={tempsOptions.minutes}
        value={devis.tempsProduction[type]?.minutes || 0}
        onChange={(value) => handleInputChange(`tempsProduction.${type}.minutes`, parseInt(value))}
        className={`${inputClass} flex-1`}
        darkMode={darkMode}
        isScrollable={true}
        maxHeight={200}
      />
    </div>
  );

  const calculerTotalTemps = () => {
    const types = ['administratif', 'cao', 'bijouterie', 'joaillerie', 'dessertissage', 'design'];
    return types.reduce((total, type) => {
      return total + calculerPrix(devis.tempsProduction[type], tauxHoraires[type]);
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Temps de production</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {renderOption("Administratif", (
          <>
            {renderTempsSelect('administratif', 'Administratif')}
            <p className="text-right font-medium mt-2">
              Prix : {calculerPrix(devis.tempsProduction.administratif, tauxHoraires.administratif).toFixed(2)} €
            </p>
          </>
        ))}
        {renderOption("CAO", (
          <>
            {renderTempsSelect('cao', 'CAO')}
            <p className="text-right font-medium mt-2">
              Prix : {calculerPrix(devis.tempsProduction.cao, tauxHoraires.cao).toFixed(2)} €
            </p>
          </>
        ))}
        {renderOption("Bijouterie", (
          <>
            {renderTempsSelect('bijouterie', 'Bijouterie')}
            <p className="text-right font-medium mt-2">
              Prix : {calculerPrix(devis.tempsProduction.bijouterie, tauxHoraires.bijouterie).toFixed(2)} €
            </p>
          </>
        ), "Utilisé pour le calcul du prix des pièces fabriquées en série ou des pièces standard, nécessitant des processus de production plus rapides et automatisés.")}
        {renderOption("Joaillerie", (
          <>
            {renderTempsSelect('joaillerie', 'Joaillerie')}
            <p className="text-right font-medium mt-2">
              Prix : {calculerPrix(devis.tempsProduction.joaillerie, tauxHoraires.joaillerie).toFixed(2)} €
            </p>
          </>
        ), "Utilisé pour le calcul du prix des pièces sur mesure ou uniques, demandant des techniques artisanales plus poussées et un temps de travail plus long.")}
        {renderOption("Désertissage", (
          <>
            {renderTempsSelect('dessertissage', 'Désertissage')}
            <p className="text-right font-medium mt-2">
              Prix : {calculerPrix(devis.tempsProduction.dessertissage, tauxHoraires.dessertissage).toFixed(2)} €
            </p>
          </>
        ))}
        {renderOption("Design", (
          <>
            {renderTempsSelect('design', 'Design')}
            <p className="text-right font-medium mt-2">
              Prix : {calculerPrix(devis.tempsProduction.design, tauxHoraires.design).toFixed(2)} €
            </p>
          </>
        ))}
      </div>
      <div className="mt-8 bg-teal-100 dark:bg-teal-900 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-center mb-2">Prix total temps de production</h3>
        <p className="text-3xl text-center font-bold text-teal-600 dark:text-teal-300">
          {calculerTotalTemps().toFixed(2)} €
        </p>
      </div>
    </div>
  );
};

export default TempsProduction;