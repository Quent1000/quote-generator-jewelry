import React from 'react';

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const PercentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const StatCard = ({ title, value, icon, color, darkMode }) => (
  <div className={`${darkMode ? 'bg-dark-card' : `bg-${color}-100`} ${darkMode ? 'text-dark-text' : `text-${color}-800`} p-6 rounded-lg shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase font-semibold">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{icon}</div>
    </div>
  </div>
);

const PageTableauDeBord = ({ darkMode }) => {
  const stats = {
    devisEnCours: 5,
    chiffreAffaires: 15000,
    tauxConversion: 75,
    nouveauxClients: 3
  };

  return (
    <div className={`p-6 space-y-6 ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-4">Tableau de Bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Devis en cours" 
          value={stats.devisEnCours} 
          icon={<FileIcon />} 
          color="blue"
          darkMode={darkMode}
        />
        <StatCard 
          title="Chiffre d'affaires" 
          value={`${stats.chiffreAffaires} €`} 
          icon={<ChartIcon />} 
          color="green"
          darkMode={darkMode}
        />
        <StatCard 
          title="Taux de conversion" 
          value={`${stats.tauxConversion}%`} 
          icon={<PercentIcon />} 
          color="yellow"
          darkMode={darkMode}
        />
        <StatCard 
          title="Nouveaux clients" 
          value={stats.nouveauxClients} 
          icon={<UserIcon />} 
          color="purple"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default PageTableauDeBord;