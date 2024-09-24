import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, DocumentTextIcon, CogIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../context/AppContext';
import logo from '../../assets/devisapp-logo.png'; // Assurez-vous que le chemin est correct

const Sidebar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useAppContext();

  const navItems = [
    { name: 'Tableau de bord', icon: HomeIcon, path: '/' },
    { name: 'Créer un devis', icon: DocumentTextIcon, path: '/creer-devis' },
    { name: 'Clients', icon: UserIcon, path: '/clients' },
    { name: 'Paramétrage du devis', icon: CogIcon, path: '/parametrage-devis' },
  ];

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-600'}`}>
      <div className="p-4 flex items-center justify-center">
        <img src={logo} alt="DEVISAPP Logo" className="h-24 w-auto" /> {/* Augmenté la hauteur à 20 (ou ajustez selon vos besoins) */}
      </div>
      <nav className="flex-1 mt-5 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-teal-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'hover:bg-teal-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
            <span className="text-sm font-medium">John Doe</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button 
            className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`} 
            aria-label="Paramètres"
          >
            <CogIcon className="h-5 w-5" />
          </button>
          <button 
            className={`flex items-center p-2 rounded-md transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`} 
            aria-label="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;