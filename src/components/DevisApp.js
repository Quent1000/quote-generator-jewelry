import React, { useState, useEffect } from 'react';
import PageTableauDeBord from './PageTableauDeBord';
import PageCreerDevis from './PageCreerDevis';
import PageClients from './PageClients';
import { Moon, Sun } from 'lucide-react';

const DevisApp = () => {
  const [activePage, setActivePage] = useState('tableau-de-bord');
  const [utilisateur] = useState({
    nom: "John Doe",
    photo: "/chemin/vers/photo.jpg"
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navButtonClass = (page) => `w-full text-left p-4 hover:bg-teal-50 ${activePage === page ? 'bg-teal-100 text-teal-800' : ''} ${darkMode ? 'dark:hover:bg-teal-800 dark:bg-gray-700 dark:text-white' : ''}`;

  return (
    <div className={`flex h-screen ${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-64 ${darkMode ? 'dark:bg-gray-700' : 'bg-white'} shadow-md flex flex-col`}>
        <div className="p-4 flex justify-center">
          <img src="/devisapp-logo.png" alt="DEVISAPP" className="h-25" />
        </div>
        <nav className="flex-grow">
          {['Tableau de bord', 'Créer un devis', 'Clients'].map((item) => (
            <button
              key={item}
              className={navButtonClass(item.toLowerCase().replace(' ', '-'))}
              onClick={() => {
                const formattedItem = item.toLowerCase().replaceAll(' ', '-').replaceAll('é', 'e');
                console.log("Changing page to:", formattedItem);
                setActivePage(formattedItem);
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className={`p-4 border-t ${darkMode ? 'dark:border-gray-600' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <span>{utilisateur.nom}</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className={`mr-2 p-2 rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-gray-200'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                ⚙️
              </button>
            </div>
          </div>
          <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-200">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-auto p-8 ${darkMode ? 'dark:bg-gray-800' : ''}`}>
        {console.log("Active page:", activePage)}
        {activePage === 'tableau-de-bord' && <PageTableauDeBord darkMode={darkMode} />}
        {activePage === 'creer-un-devis' && <PageCreerDevis darkMode={darkMode} />}
        {activePage === 'clients' && <PageClients darkMode={darkMode} />}
      </div>
    </div>
  );
};

export default DevisApp;