import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import PageClients from './components/PageClients';
import PageCreerDevis from './components/PageCreerDevis';
import PageTableauDeBord from './components/PageTableauDeBord';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Appliquer le mode sombre immédiatement au chargement de l'application
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
          <Navigation darkMode={darkMode} />
          <div className="fixed top-4 right-4 flex items-center z-10">
            <span className="mr-2 text-sm">{darkMode ? 'Sombre' : 'Clair'}</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 flex items-center rounded-full p-1 ${
                darkMode ? 'bg-teal-500' : 'bg-gray-300'
              } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
              aria-label="Toggle dark mode"
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  darkMode ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<PageTableauDeBord darkMode={darkMode} />} />
              <Route path="/clients" element={<PageClients darkMode={darkMode} />} />
              <Route path="/creer-devis" element={<PageCreerDevis darkMode={darkMode} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;