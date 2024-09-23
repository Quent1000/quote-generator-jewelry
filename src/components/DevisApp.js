import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PageTableauDeBord from './PageTableauDeBord';
import PageCreerDevis from './PageCreerDevis';
import PageClients from './PageClients';
import DarkModeToggle from './DarkModeToggle';

function DevisApp() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
        <nav className={`w-64 flex-shrink-0 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} flex flex-col shadow-lg`}>
          <div className="p-4 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-teal-500">DEVISAPP</h1>
          </div>
          <ul className="flex-grow px-4 py-6 space-y-4">
            <li>
              <Link to="/" className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link to="/creer-devis" className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Créer un devis
              </Link>
            </li>
            <li>
              <Link to="/clients" className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Clients
              </Link>
            </li>
          </ul>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button 
                className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`} 
                aria-label="Paramètres"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className={`flex items-center p-2 rounded-md transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`} 
                aria-label="Déconnexion"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </nav>

        <main className={`flex-grow overflow-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
          <Routes>
            <Route path="/" element={<PageTableauDeBord darkMode={darkMode} />} />
            <Route path="/creer-devis" element={<PageCreerDevis darkMode={darkMode} />} />
            <Route path="/clients" element={<PageClients darkMode={darkMode} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default DevisApp;