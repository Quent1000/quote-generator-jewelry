import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { HomeIcon, UserIcon, CogIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon, SunIcon, MoonIcon, ArrowLeftOnRectangleIcon, UsersIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/devisapp-logo.png'; // Assurez-vous que le chemin est correct

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Accueil', path: '/', icon: HomeIcon },
    { name: 'Profil', path: '/profil', icon: UserIcon },
    { name: 'Clients', path: '/clients', icon: UserGroupIcon },
    { name: 'Devis', path: '/creer-devis', icon: DocumentTextIcon },
    { name: 'Tableau de bord', path: '/tableau-de-bord', icon: ChartBarIcon },
  ];

  // Ajouter les éléments de menu pour les administrateurs
  if (isAdmin) {
    navItems.push(
      { name: 'Paramètres', path: '/parametrage-devis', icon: CogIcon },
      { name: 'Gestion Utilisateurs', path: '/gestion-utilisateurs', icon: UsersIcon }
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className={`w-64 h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} flex flex-col`}>
      <div className="flex items-center justify-center h-24 border-b border-gray-200 dark:border-gray-700">
        <img src={logo} alt="DevisApp Logo" className="h-auto w-auto max-h-20 max-w-[80%]" />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-teal-500 text-white'
                    : 'hover:bg-teal-100 hover:text-teal-500'
                }`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
              <img
                className="w-full h-full object-cover"
                src={user.photoURL || "https://via.placeholder.com/32"}
                alt="User avatar"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;