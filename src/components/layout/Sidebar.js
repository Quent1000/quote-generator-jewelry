import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { HomeIcon, UserIcon, CogIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon, SunIcon, MoonIcon, ArrowLeftOnRectangleIcon, UsersIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/devisapp-logo.png'; // Assurez-vous que le chemin est correct

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Accueil', icon: <HomeIcon className="w-6 h-6" />, link: '/' },
    { title: 'Tableau de bord', icon: <ChartBarIcon className="w-6 h-6" />, link: '/tableau-de-bord' },
    { title: 'Clients', icon: <UserGroupIcon className="w-6 h-6" />, link: '/clients' },
    { title: 'Créer un devis', icon: <DocumentTextIcon className="w-6 h-6" />, link: '/creer-devis' },
   // { title: 'Créer un devis (V2)', icon: <DocumentTextIcon className="w-6 h-6" />, link: '/creer-devis-v2' },
    { title: 'Paramétrage devis', icon: <CogIcon className="w-6 h-6" />, link: '/parametrage-devis', role: 'admin' },
    { title: 'Profil', icon: <UserIcon className="w-6 h-6" />, link: '/profil' },
    { title: 'Gestion utilisateurs', icon: <UsersIcon className="w-6 h-6" />, link: '/gestion-utilisateurs', role: 'admin' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const getUserInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  return (
    <div className={`w-64 h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} flex flex-col`}>
      <div className="flex items-center justify-center h-24 border-b border-gray-200 dark:border-gray-700">
        <img src={logo} alt="DevisApp Logo" className="h-auto w-auto max-h-20 max-w-[80%]" />
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 py-4">
          {menuItems.map((item, index) => (
            (!item.role || user.role === item.role) && (
              <li key={index} className="mb-2">
                <Link
                  to={item.link}
                  className={`flex items-center space-x-2 p-2 rounded transition duration-200 ${
                    location.pathname === item.link
                      ? 'bg-gray-700 text-white'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 overflow-hidden rounded-full mr-3">
            {user.photoURL ? (
              <img
                className="w-full h-full object-cover"
                src={user.photoURL}
                alt="Avatar de l'utilisateur"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-lg font-medium ${darkMode ? 'bg-gray-700 text-white' : 'bg-teal-100 text-teal-800'}`}>
                {getUserInitials()}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            <span>Déconnexion</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;