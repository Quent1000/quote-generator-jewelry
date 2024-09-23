import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const Navigation = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4`}>
      {/* Autres éléments de navigation */}
      <div className="flex items-center">
        <span className="mr-2">John Doe</span>
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <button className="ml-4">Déconnexion</button>
      </div>
    </nav>
  );
};

export default Navigation;