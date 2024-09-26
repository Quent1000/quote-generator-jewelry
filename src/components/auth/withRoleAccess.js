import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const withRoleAccess = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { user, isAdmin } = useAuth();

    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return <Navigate to="/login" />;
    }

    if (allowedRoles.includes(user.role) || isAdmin) {
      // L'utilisateur a le rôle requis ou est admin, on affiche le composant
      return <WrappedComponent {...props} />;
    } else {
      // L'utilisateur n'a pas le rôle requis, on le redirige vers une page d'accès refusé
      return <Navigate to="/acces-refuse" />;
    }
  };
};

export default withRoleAccess;