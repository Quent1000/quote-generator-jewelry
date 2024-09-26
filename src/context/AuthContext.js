import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const isAdmin = (user) => {
  return user && user.role === 'admin';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Créer un nouveau document utilisateur s'il n'existe pas
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              firstName: '',
              lastName: '',
              role: 'user', // Ajout du rôle par défaut
            });
          }
          
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            ...firebaseUser,
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            photoURL: userData?.photoURL || '',
            role: userData?.role || 'user', // Ajout du rôle
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    }
  };

  const updateUser = async (newUserData) => {
    if (!user) return;

    try {
      // Mettre à jour le profil dans Firebase Authentication
      if (newUserData.displayName) {
        await updateProfile(auth.currentUser, { displayName: newUserData.displayName });
      }

      // Mettre à jour les données dans Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, newUserData);

      // Mettre à jour l'état local
      setUser(currentUser => ({ ...currentUser, ...newUserData }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Erreur de réinitialisation du mot de passe:", error);
      throw error;
    }
  };

  const setUserAsAdmin = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: 'admin' });
      if (user && user.uid === userId) {
        setUser(currentUser => ({ ...currentUser, role: 'admin' }));
      }
    } catch (error) {
      console.error("Erreur lors de la définition de l'utilisateur comme admin:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    resetPassword,
    isAdmin: user ? isAdmin(user) : false,
    setUserAsAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};