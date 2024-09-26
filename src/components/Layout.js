import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { HomeIcon, UserIcon, CogIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: 'Accueil', path: '/', icon: HomeIcon },
    { name: 'Profil', path: '/profil', icon: UserIcon },
    { name: 'Clients', path: '/clients', icon: UserGroupIcon },
    { name: 'Devis', path: '/devis', icon: DocumentTextIcon },
    { name: 'Tableau de bord', path: '/tableau-de-bord', icon: ChartBarIcon },
  ];

  // Ajouter l'élément de menu Paramètres uniquement pour les administrateurs
  if (isAdmin) {
    navItems.push({ name: 'Paramètres', path: '/parametres', icon: CogIcon });
  }

  // ... (reste du code existant)

  return (
    // ... (reste du code existant)
  );
};

export default Layout;