import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  CogIcon,
  MoonIcon,
  SunIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import logo from '../../assets/devisapp-logo.png';

const sidebarItems = [
  { name: 'Tableau de bord', path: '/', icon: HomeIcon },
  { name: 'Clients', path: '/clients', icon: UserIcon },
  { name: 'Créer un devis', path: '/creer-devis', icon: DocumentTextIcon },
  { name: 'Paramétrage devis', path: '/parametrage-devis', icon: CogIcon },
  { name: 'Profil', path: '/profil', icon: UserCircleIcon },
];

const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const navItemClass = `flex items-center px-4 py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200`;
  const activeNavItemClass = `${navItemClass} bg-teal-50 dark:bg-gray-700 text-teal-600 dark:text-teal-400 font-medium`;

  return (
    <div className={`w-64 h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-center h-24 border-b border-gray-200 dark:border-gray-700">
        <img src={logo} alt="DevisApp Logo" className="h-auto w-auto max-h-20 max-w-[80%]" />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? activeNavItemClass : navItemClass}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full mr-2"
              src={user.photoURL || "https://via.placeholder.com/32"}
              alt="User avatar"
            />
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