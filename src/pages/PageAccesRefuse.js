import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PageAccesRefuse = () => {
  const { darkMode } = useAppContext();

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Accès refusé</h1>
        <p className="mb-4">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
        <Link to="/" className="text-teal-500 hover:text-teal-600">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default PageAccesRefuse;