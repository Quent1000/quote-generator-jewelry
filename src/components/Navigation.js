import React from 'react';
import DarkModeToggle from './DarkModeToggle';
import { Link } from 'react-router-dom';

const Navigation = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4`}>
      {/* Autres éléments de navigation */}
      <div className="flex items-center">
        <span className="mr-2">John Doe</span>
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <button className="ml-4">Déconnexion</button>
      </div>
      <Link to="/devis-advanced" className="nav-link">
        Devis Avancé (Google Sheets)
      </Link>
    </nav>
  );
};

export default Navigation;